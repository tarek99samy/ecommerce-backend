const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const redisClient = require('../config/cache');

const prepareProduct = (acc, product) => {
  if (!acc[product.id]) {
    acc[product.id] = {
      ...product,
      is_favourite: product.is_favourite ? true : false,
      status: {
        id: product.status_id,
        name: product.status_name
      },
      currency: {
        id: product.original_currency_id,
        name: product.currency_name
      },
      category: {
        id: product.category_id,
        name: product.category_name
      },
      ad: {
        id: product.ad_id,
        product_id: product.ad_product_id,
        user_id: product.ad_user_id,
        ad_package_id: product.ad_ad_package_id,
        seller_name: product.ad_seller_name,
        seller_phone: product.ad_seller_phone,
        status_id: product.ad_status_id,
        country_id: product.ad_country_id,
        datetime: product.ad_datetime,
        num_views: product.ad_num_views,
        allow_comments: product.ad_allow_comments,
        allow_calls: product.ad_allow_calls
      },
      ad_package: product.ad_package_id
        ? {
            id: product.ad_package_id,
            name: product.ad_package_name,
            description: product.ad_package_description,
            price: product.ad_package_price,
            currency_id: product.ad_package_currency_id,
            discount: product.ad_package_discount,
            icon: product.ad_package_icon,
            title_color: product.ad_package_title_color,
            country_id: product.ad_package_country_id,
            status_id: product.ad_package_status_id
          }
        : {},
      attributes: []
    };
    delete acc[product.id].ad_id;
    delete acc[product.id].ad_product_id;
    delete acc[product.id].ad_user_id;
    delete acc[product.id].ad_ad_package_id;
    delete acc[product.id].ad_seller_name;
    delete acc[product.id].ad_seller_phone;
    delete acc[product.id].ad_status_id;
    delete acc[product.id].ad_country_id;
    delete acc[product.id].ad_datetime;
    delete acc[product.id].ad_num_views;
    delete acc[product.id].ad_allow_comments;
    delete acc[product.id].ad_allow_calls;
    delete acc[product.id].ad_package_id;
    delete acc[product.id].ad_package_name;
    delete acc[product.id].ad_package_description;
    delete acc[product.id].ad_package_price;
    delete acc[product.id].ad_package_currency_id;
    delete acc[product.id].ad_package_discount;
    delete acc[product.id].ad_package_icon;
    delete acc[product.id].ad_package_title_color;
    delete acc[product.id].ad_package_country_id;
    delete acc[product.id].ad_package_status_id;
    delete acc[product.id].status_name;
    delete acc[product.id].currency_name;
    delete acc[product.id].category_id;
    delete acc[product.id].category_name;
  }
  if (product.product_attribute_value) {
    acc[product.id].attributes.push({
      name: product.subcategory_attribute_name,
      data_type: product.data_type,
      is_required: product.is_required,
      value: product.product_attribute_value
    });
  }
  delete acc[product.id].subcategory_attribute_name;
  delete acc[product.id].data_type;
  delete acc[product.id].is_required;
  delete acc[product.id].product_attribute_value;
  return acc;
};

const getAllProductsByCategoryId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const categoryId = +req.params.categoryId;
    const lang = req.get('lang');
    const userId = req.get('userId');
    const countryId = req.get('countryId');
    const query = new QueryBuilder()
      .select('product', [
        'product.*',
        'ad.id as ad_id, ad.product_id as ad_product_id, ad.user_id as ad_user_id, ad.ad_package_id as ad_ad_package_id, ad.seller_name as ad_seller_name, ad.seller_phone as ad_seller_phone, ad.status_id as ad_status_id, ad.country_id as ad_country_id, ad.datetime as ad_datetime, ad.num_views as ad_num_views, ad.allow_comments as ad_allow_comments, ad.allow_calls as ad_allow_calls',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as status_name`,
        `category.id as category_id, category.name_${lang} as category_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type, subcategory_attribute.is_required`,
        'product_attribute.value as product_attribute_value',
        'favourite_product.id as is_favourite'
      ])
      .join('subcategory', 'subcategory.id', 'product.subcategory_id')
      .join('category', ['category.id', 'category.id'], ['subcategory.category_id', categoryId], true)
      .join('ad', ['ad.product_id', 'ad.status_id', 'ad.country_id'], ['product.id', 1, countryId], true)
      .join('area', 'area.id', 'product.area_id')
      .join('city', ['city.id', 'city.country_id'], ['area.city_id', countryId], true)
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'product.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', 'product.id')
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .leftJoin('favourite_product', ['favourite_product.product_id', 'favourite_product.user_id'], ['product.id', userId], true)
      .limit(page);

    const result = await query.run();
    if (result.success) {
      let products = result.data;
      if (products.length > 0) {
        products = Object.values(products.reduce(prepareProduct, {}));
        const premiumProducts = products
          .filter((product) => Object.keys(product.ad_package).length > 0)
          .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
        const regularProducts = products
          .filter((product) => Object.keys(product.ad_package).length === 0)
          .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
        products = [...premiumProducts, ...regularProducts];
        await redisClient.set(req.headers['cacheKey'], JSON.stringify(products), { EX: process.env.CACHE_EXPIRE_TIME });
      }
      return res.status(httpStatus.OK).json({ products });
    } else {
      throw ApiError.internal('Failed to get products by category');
    }
  } catch (error) {
    next(error);
  }
};

const getAllProductsBySubcategoryId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const subcategoryId = +req.params.subcategoryId;
    const lang = req.get('lang');
    const userId = req.get('userId');
    const countryId = req.get('countryId');
    const query = new QueryBuilder()
      .select('product', [
        'product.*',
        'ad.id as ad_id, ad.product_id as ad_product_id, ad.user_id as ad_user_id, ad.ad_package_id as ad_ad_package_id, ad.seller_name as ad_seller_name, ad.seller_phone as ad_seller_phone, ad.status_id as ad_status_id, ad.country_id as ad_country_id, ad.datetime as ad_datetime, ad.num_views as ad_num_views, ad.allow_comments as ad_allow_comments, ad.allow_calls as ad_allow_calls',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as status_name`,
        `category.id as category_id, category.name_${lang} as category_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type, subcategory_attribute.is_required`,
        'product_attribute.value as product_attribute_value',
        'favourite_product.id as is_favourite'
      ])
      .join('subcategory', ['subcategory.id', 'subcategory.id'], ['product.subcategory_id', subcategoryId], true)
      .join('category', 'category.id', 'subcategory.category_id')
      .join('ad', ['ad.product_id', 'ad.status_id', 'ad.country_id'], ['product.id', 1, countryId], true)
      .join('area', 'area.id', 'product.area_id')
      .join('city', ['city.id', 'city.country_id'], ['area.city_id', countryId], true)
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'product.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', 'product.id')
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .leftJoin('favourite_product', ['favourite_product.product_id', 'favourite_product.user_id'], ['product.id', userId], true)
      .limit(page);

    const result = await query.run();
    if (result.success) {
      let products = result.data;
      if (products.length > 0) {
        products = Object.values(products.reduce(prepareProduct, {}));
        const premiumProducts = products
          .filter((product) => Object.keys(product.ad_package).length > 0)
          .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
        const regularProducts = products
          .filter((product) => Object.keys(product.ad_package).length === 0)
          .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
        products = [...premiumProducts, ...regularProducts];
        await redisClient.set(req.headers['cacheKey'], JSON.stringify(products), { EX: process.env.CACHE_EXPIRE_TIME });
      }
      return res.status(httpStatus.OK).json({ products });
    } else {
      throw ApiError.internal('Failed to get products by subcategory');
    }
  } catch (error) {
    next(error);
  }
};

const getAllProductsByThirdcategoryId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const thirdcategoryId = +req.params.thirdcategoryId;
    const lang = req.get('lang');
    const userId = req.get('userId');
    const countryId = req.get('countryId');
    const query = new QueryBuilder()
      .select('product', [
        'product.*',
        'ad.id as ad_id, ad.product_id as ad_product_id, ad.user_id as ad_user_id, ad.ad_package_id as ad_ad_package_id, ad.seller_name as ad_seller_name, ad.seller_phone as ad_seller_phone, ad.status_id as ad_status_id, ad.country_id as ad_country_id, ad.datetime as ad_datetime, ad.num_views as ad_num_views, ad.allow_comments as ad_allow_comments, ad.allow_calls as ad_allow_calls',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as status_name`,
        `category.id as category_id, category.name_${lang} as category_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type, subcategory_attribute.is_required`,
        'product_attribute.value as product_attribute_value',
        'favourite_product.id as is_favourite'
      ])
      .join('subcategory', 'subcategory.id', 'product.subcategory_id')
      .join('category', 'category.id', 'subcategory.category_id')
      .join('thirdcategory', ['thirdcategory.id', 'thirdcategory.id'], ['product.thirdcategory_id', thirdcategoryId], true)
      .join('ad', ['ad.product_id', 'ad.status_id', 'ad.country_id'], ['product.id', 1, countryId], true)
      .join('area', 'area.id', 'product.area_id')
      .join('city', ['city.id', 'city.country_id'], ['area.city_id', countryId], true)
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'product.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', 'product.id')
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .leftJoin('favourite_product', ['favourite_product.product_id', 'favourite_product.user_id'], ['product.id', userId], true)
      .limit(page);

    const result = await query.run();
    if (result.success) {
      let products = result.data;
      if (products.length > 0) {
        products = Object.values(products.reduce(prepareProduct, {}));
        const premiumProducts = products
          .filter((product) => Object.keys(product.ad_package).length > 0)
          .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
        const regularProducts = products
          .filter((product) => Object.keys(product.ad_package).length === 0)
          .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
        products = [...premiumProducts, ...regularProducts];
        await redisClient.set(req.headers['cacheKey'], JSON.stringify(products), { EX: process.env.CACHE_EXPIRE_TIME });
      }
      return res.status(httpStatus.OK).json({ products });
    } else {
      throw ApiError.internal('Failed to get products by thirdcategory');
    }
  } catch (error) {
    next(error);
  }
};

const getAllProductsByCountryId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const countryId = +req.params.countryId;
    const lang = req.get('lang');
    const userId = req.get('userId');
    const query = new QueryBuilder()
      .select('product', [
        'product.*',
        'ad.id as ad_id, ad.product_id as ad_product_id, ad.user_id as ad_user_id, ad.ad_package_id as ad_ad_package_id, ad.seller_name as ad_seller_name, ad.seller_phone as ad_seller_phone, ad.status_id as ad_status_id, ad.country_id as ad_country_id, ad.datetime as ad_datetime, ad.num_views as ad_num_views, ad.allow_comments as ad_allow_comments, ad.allow_calls as ad_allow_calls',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as status_name`,
        `category.id as category_id, category.name_${lang} as category_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type, subcategory_attribute.is_required`,
        'product_attribute.value as product_attribute_value',
        'favourite_product.id as is_favourite'
      ])
      .join('subcategory', 'subcategory.id', 'product.subcategory_id')
      .join('category', 'category.id', 'subcategory.category_id')
      .join('area', 'area.id', 'product.area_id')
      .join('city', ['city.id', 'city.country_id'], ['area.city_id', countryId], true)
      .join('ad', ['ad.product_id', 'ad.status_id', 'ad.country_id'], ['product.id', 1, countryId], true)
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'product.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', 'product.id')
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .leftJoin('favourite_product', ['favourite_product.product_id', 'favourite_product.user_id'], ['product.id', userId], true)
      .orderBy('ad.datetime', 'DESC')
      .limit(page);

    const result = await query.run();
    if (result.success) {
      let products = result.data;
      if (products.length > 0) {
        products = Object.values(products.reduce(prepareProduct, {}));
        const premiumProducts = products
          .filter((product) => Object.keys(product.ad_package).length > 0)
          .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
        const regularProducts = products
          .filter((product) => Object.keys(product.ad_package).length === 0)
          .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
        products = [...premiumProducts, ...regularProducts];
        await redisClient.set(req.headers['cacheKey'], JSON.stringify(products), { EX: process.env.CACHE_EXPIRE_TIME });
      }
      return res.status(httpStatus.OK).json({ products });
    } else {
      throw ApiError.internal('Failed to get products by country');
    }
  } catch (error) {
    next(error);
  }
};

const getAllProductsByCityId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const cityId = +req.params.cityId;
    const lang = req.get('lang');
    const userId = req.get('userId');
    const query = new QueryBuilder()
      .select('product', [
        'product.*',
        'ad.id as ad_id, ad.product_id as ad_product_id, ad.user_id as ad_user_id, ad.ad_package_id as ad_ad_package_id, ad.seller_name as ad_seller_name, ad.seller_phone as ad_seller_phone, ad.status_id as ad_status_id, ad.country_id as ad_country_id, ad.datetime as ad_datetime, ad.num_views as ad_num_views, ad.allow_comments as ad_allow_comments, ad.allow_calls as ad_allow_calls',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as status_name`,
        `category.id as category_id, category.name_${lang} as category_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type, subcategory_attribute.is_required`,
        'product_attribute.value as product_attribute_value',
        'favourite_product.id as is_favourite'
      ])
      .join('subcategory', 'subcategory.id', 'product.subcategory_id')
      .join('category', 'category.id', 'subcategory.category_id')
      .join('area', 'area.id', 'product.area_id')
      .join('city', ['city.id', 'city.id'], ['area.city_id', cityId], true)
      .join('ad', ['ad.product_id', 'ad.status_id', 'ad.country_id'], ['product.id', 1, 'city.country_id'], true)
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'product.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', 'product.id')
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .leftJoin('favourite_product', ['favourite_product.product_id', 'favourite_product.user_id'], ['product.id', userId], true)
      .limit(page);

    const result = await query.run();
    if (result.success) {
      let products = result.data;
      if (products.length > 0) {
        products = Object.values(products.reduce(prepareProduct, {}));
        const premiumProducts = products
          .filter((product) => Object.keys(product.ad_package).length > 0)
          .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
        const regularProducts = products
          .filter((product) => Object.keys(product.ad_package).length === 0)
          .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
        products = [...premiumProducts, ...regularProducts];
        await redisClient.set(req.headers['cacheKey'], JSON.stringify(products), { EX: process.env.CACHE_EXPIRE_TIME });
      }
      return res.status(httpStatus.OK).json({ products });
    } else {
      throw ApiError.internal('Failed to get products by city');
    }
  } catch (error) {
    next(error);
  }
};

const getAllProductsByAreaId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const areaId = +req.params.areaId;
    const lang = req.get('lang');
    const userId = req.get('userId');
    const query = new QueryBuilder()
      .select('product', [
        'product.*',
        'ad.id as ad_id, ad.product_id as ad_product_id, ad.user_id as ad_user_id, ad.ad_package_id as ad_ad_package_id, ad.seller_name as ad_seller_name, ad.seller_phone as ad_seller_phone, ad.status_id as ad_status_id, ad.country_id as ad_country_id, ad.datetime as ad_datetime, ad.num_views as ad_num_views, ad.allow_comments as ad_allow_comments, ad.allow_calls as ad_allow_calls',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as status_name`,
        `category.id as category_id, category.name_${lang} as category_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type, subcategory_attribute.is_required`,
        'product_attribute.value as product_attribute_value',
        'favourite_product.id as is_favourite'
      ])
      .join('subcategory', 'subcategory.id', 'product.subcategory_id')
      .join('category', 'category.id', 'subcategory.category_id')
      .join('area', ['area.id', 'area.id'], ['area.id', areaId], true)
      .join('city', 'city.id', 'area.city_id')
      .join('ad', ['ad.product_id', 'ad.status_id', 'ad.country_id'], ['product.id', 1, 'city.country_id'], true)
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'product.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', 'product.id')
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .leftJoin('favourite_product', ['favourite_product.product_id', 'favourite_product.user_id'], ['product.id', userId], true)
      .limit(page);

    const result = await query.run();
    if (result.success) {
      let products = result.data;
      if (products.length > 0) {
        products = Object.values(products.reduce(prepareProduct, {}));
        const premiumProducts = products
          .filter((product) => Object.keys(product.ad_package).length > 0)
          .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
        const regularProducts = products
          .filter((product) => Object.keys(product.ad_package).length === 0)
          .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
        products = [...premiumProducts, ...regularProducts];
        await redisClient.set(req.headers['cacheKey'], JSON.stringify(products), { EX: process.env.CACHE_EXPIRE_TIME });
      }
      return res.status(httpStatus.OK).json({ products });
    } else {
      throw ApiError.internal('Failed to get products by area');
    }
  } catch (error) {
    next(error);
  }
};

const getAllProductsBySearch = async (req, res, next) => {
  try {
    const { keyword, subcategory_id, thirdcategory_id, price_min, price_max, status_id, sort, order, page } = req.query;
    let filterColumns = [];
    let filterOperators = [];
    let filterValues = [];
    let filterJoiners = [];
    const lang = req.get('lang');
    const userId = req.get('userId');
    const countryId = req.get('countryId');
    let query = new QueryBuilder()
      .select('product', [
        'product.*',
        'ad.id as ad_id, ad.product_id as ad_product_id, ad.user_id as ad_user_id, ad.ad_package_id as ad_ad_package_id, ad.seller_name as ad_seller_name, ad.seller_phone as ad_seller_phone, ad.status_id as ad_status_id, ad.country_id as ad_country_id, ad.datetime as ad_datetime, ad.num_views as ad_num_views, ad.allow_comments as ad_allow_comments, ad.allow_calls as ad_allow_calls',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as status_name`,
        `category.id as category_id, category.name_${lang} as category_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type, subcategory_attribute.is_required`,
        'product_attribute.value as product_attribute_value',
        'favourite_product.id as is_favourite'
      ])
      .join('ad', ['ad.product_id', 'ad.status_id', 'ad.country_id'], ['product.id', 1, countryId], true)
      .join('area', 'area.id', 'product.area_id')
      .join('city', ['city.id', 'city.country_id'], ['area.city_id', countryId], true)
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'product.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', 'product.id')
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .leftJoin('favourite_product', ['favourite_product.product_id', 'favourite_product.user_id'], ['product.id', userId], true);

    if (+subcategory_id) {
      query = query
        .join('subcategory', ['subcategory.id', 'subcategory.id'], ['product.subcategory_id', subcategory_id], true)
        .join('category', 'category.id', 'subcategory.category_id');
    } else {
      query = query.join('subcategory', 'subcategory.id', 'product.subcategory_id').join('category', 'category.id', 'subcategory.category_id');
    }
    if (+thirdcategory_id) {
      query = query.join('thirdcategory', ['thirdcategory.id', 'thirdcategory.id'], ['product.thirdcategory_id', thirdcategory_id], true);
    }
    if (keyword) {
      filterColumns.push(`product.name_${lang}`);
      filterColumns.push(`product.description_${lang}`);
      filterOperators.push('like');
      filterOperators.push('like');
      filterValues.push(`%${keyword}%`);
      filterValues.push(`%${keyword}%`);
      filterJoiners.push(' OR ');
    }
    if (+price_min && +price_max) {
      filterColumns.push('product.price');
      filterOperators.push('>=');
      filterValues.push(+price_min);
      filterColumns.push('product.price');
      filterOperators.push('<=');
      filterValues.push(+price_max);
      if (filterJoiners.length > 0) {
        filterJoiners.push(' AND ');
      }
      filterJoiners.push(' AND ');
    }
    if (+status_id) {
      filterColumns.push('product.status_id');
      filterOperators.push('=');
      filterValues.push(+status_id);
      if (filterJoiners.length > 0) {
        filterJoiners.push(' AND ');
      }
    }
    if (filterColumns.length > 0) {
      query = query.where(filterColumns, filterOperators, filterValues, filterJoiners);
    }
    if (sort) {
      query = query.orderBy(sort, order);
    }
    if (+page) {
      query = query.with('product.id').limit(+page);
    }

    const result = await query.run();
    if (result.success) {
      let products = result.data;
      if (products.length > 0) {
        products = Object.values(products.reduce(prepareProduct, {}));
        if (sort) {
          if (sort.includes('date')) {
            products = products.sort((a, b) => (order === 'ASC' ? new Date(a[sort]) - new Date(b[sort]) : new Date(b[sort]) - new Date(a[sort])));
          } else {
            products = products.sort((a, b) => (order === 'ASC' ? a[sort] - b[sort] : b[sort] - a[sort]));
          }
        } else {
          const premiumProducts = products
            .filter((product) => Object.keys(product.ad_package).length > 0)
            .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
          const regularProducts = products
            .filter((product) => Object.keys(product.ad_package).length === 0)
            .sort((a, b) => new Date(b.ad.datetime) - new Date(a.ad.datetime));
          products = [...premiumProducts, ...regularProducts];
        }
        await redisClient.set(req.headers['cacheKey'], JSON.stringify(products), { EX: process.env.CACHE_EXPIRE_TIME });
      }
      return res.status(httpStatus.OK).json({ products });
    } else {
      throw ApiError.internal('Failed to get products by search');
    }
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('product').limit(page);
    const result = await query.run();
    if (result.success) {
      const products = result.data;
      await redisClient.set(req.headers['cacheKey'], JSON.stringify(products), { EX: process.env.CACHE_EXPIRE_TIME });
      return res.status(httpStatus.OK).json({ products });
    } else {
      throw ApiError.internal('Failed to get all products');
    }
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const lang = req.get('lang');
    const userId = req.get('userId');
    const query = new QueryBuilder()
      .select('product', [
        'product.*',
        'ad.id as ad_id, ad.product_id as ad_product_id, ad.user_id as ad_user_id, ad.ad_package_id as ad_ad_package_id, ad.seller_name as ad_seller_name, ad.seller_phone as ad_seller_phone, ad.status_id as ad_status_id, ad.country_id as ad_country_id, ad.datetime as ad_datetime, ad.num_views as ad_num_views, ad.allow_comments as ad_allow_comments, ad.allow_calls as ad_allow_calls',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as status_name`,
        `category.id as category_id, category.name_${lang} as category_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type, subcategory_attribute.is_required`,
        'product_attribute.value as product_attribute_value',
        'favourite_product.id as is_favourite'
      ])
      .join('subcategory', 'subcategory.id', 'product.subcategory_id')
      .join('category', 'category.id', 'subcategory.category_id')
      .join('ad', 'ad.product_id', id)
      .join('area', 'area.id', 'product.area_id')
      .join('city', 'city.id', 'area.city_id')
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'product.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', id)
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .leftJoin('favourite_product', ['favourite_product.product_id', 'favourite_product.user_id'], [id, userId], true)
      .where(['product.id'], ['='], [id]);

    const result = await query.run();
    if (result.success) {
      let product = result.data;
      if (product.length > 0) {
        product = Object.values(product.reduce(prepareProduct, {}));
      }
      return res.status(httpStatus.OK).json({ product });
    } else {
      throw ApiError.internal('Failed to get product');
    }
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const values = {
      name_en: req.body.name_en,
      name_ar: req.body.name_ar,
      description_en: req.body.description_en,
      description_ar: req.body.description_ar,
      images: req.body.images,
      videos: req.body.videos,
      subcategory_id: req.body.subcategory_id,
      thirdcategory_id: req.body.thirdcategory_id,
      area_id: req.body.area_id,
      status_id: req.body.status_id,
      price: req.body.price,
      original_currency_id: req.body.original_currency_id,
      country_id: req.body.country_id
    };

    const query = new QueryBuilder().insert('product', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Product created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create product');
    }
  } catch (error) {
    next(error);
  }
};

const editProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      name_en: req.body.name_en,
      name_ar: req.body.name_ar,
      description_en: req.body.description_en,
      description_ar: req.body.description_ar,
      images: req.body.images,
      videos: req.body.videos,
      subcategory_id: req.body.subcategory_id,
      thirdcategory_id: req.body.thirdcategory_id,
      area_id: req.body.area_id,
      status_id: req.body.status_id,
      price: req.body.price,
      original_currency_id: req.body.original_currency_id,
      country_id: req.body.country_id
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('product', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Product updated successfully' });
    } else {
      throw ApiError.internal('Failed to update product');
    }
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('product').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Product deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete product');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProductsByCategoryId,
  getAllProductsBySubcategoryId,
  getAllProductsByThirdcategoryId,
  getAllProductsByCountryId,
  getAllProductsByCityId,
  getAllProductsByAreaId,
  getAllProductsBySubcategoryId,
  getAllProductsBySearch,
  getAllProducts,
  getProductById,
  createProduct,
  editProduct,
  deleteProduct
};
