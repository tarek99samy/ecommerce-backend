const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const redisClient = require('../config/cache');

const prepareAd = (acc, ad) => {
  if (!acc[ad.id]) {
    acc[ad.id] = {
      ...ad,
      status: {
        id: ad.status_id,
        name: ad.ad_status_name
      },
      currency: {
        id: ad.original_currency_id,
        name: ad.currency_name
      },
      category: {
        id: ad.category_id,
        name: ad.category_name
      },
      ad_package: ad.ad_package_id
        ? {
            id: ad.ad_package_id,
            name: ad.ad_package_name,
            description: ad.ad_package_description,
            price: ad.ad_package_price,
            currency_id: ad.ad_package_currency_id,
            discount: ad.ad_package_discount,
            icon: ad.ad_package_icon,
            title_color: ad.ad_package_title_color,
            country_id: ad.ad_package_country_id,
            status_id: ad.ad_package_status_id
          }
        : {},
      product: {
        id: ad.product_id,
        name: ad.product_name,
        description: ad.product_description,
        images: ad.images,
        videos: ad.videos,
        subcategory_id: ad.subcategory_id,
        thirdcategory_id: ad.thirdcategory_id,
        area_id: ad.area_id,
        status_id: ad.product_status_id,
        price: ad.price,
        original_currency_id: ad.original_currency_id
      },
      attributes: []
    };
    delete acc[ad.id].ad_package_id;
    delete acc[ad.id].ad_package_name;
    delete acc[ad.id].ad_package_description;
    delete acc[ad.id].ad_package_price;
    delete acc[ad.id].ad_package_currency_id;
    delete acc[ad.id].ad_package_discount;
    delete acc[ad.id].ad_package_icon;
    delete acc[ad.id].ad_package_title_color;
    delete acc[ad.id].ad_package_country_id;
    delete acc[ad.id].ad_package_status_id;
    delete acc[ad.id].category_id;
    delete acc[ad.id].category_name;
    delete acc[ad.id].ad_status_name;
    delete acc[ad.id].currency_name;
    delete acc[ad.id].product_name;
    delete acc[ad.id].product_description;
    delete acc[ad.id].images;
    delete acc[ad.id].videos;
    delete acc[ad.id].subcategory_id;
    delete acc[ad.id].thirdcategory_id;
    delete acc[ad.id].area_id;
    delete acc[ad.id].product_status_id;
    delete acc[ad.id].price;
    delete acc[ad.id].original_currency_id;
  }
  if (ad.product_attribute_value) {
    acc[ad.id].attributes.push({
      name: ad.subcategory_attribute_name,
      data_type: ad.data_type,
      is_required: ad.is_required,
      value: ad.product_attribute_value
    });
  }
  delete acc[ad.id].subcategory_attribute_name;
  delete acc[ad.id].data_type;
  delete acc[ad.id].is_required;
  delete acc[ad.id].product_attribute_value;
  return acc;
};

const getAllAdsByUserId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const userId = req.get('userId');
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('ad', [
        'ad.*',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `(SELECT COUNT(*) FROM favourite_product WHERE favourite_product.product_id = product.id AND favourite_product.user_id = ${userId}) AS num_favourites`,
        `(SELECT COUNT(*) FROM chat WHERE chat.receiver_id = ${userId}) AS num_chats`,
        `product.name_${lang} as product_name, product.description_${lang} as product_description, product.images, product.videos, product.subcategory_id, product.thirdcategory_id, product.area_id, product.status_id as product_status_id, product.price, product.original_currency_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `category.id as category_id, category.name_${lang} as category_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as ad_status_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type, subcategory_attribute.is_required`,
        'product_attribute.value as product_attribute_value'
      ])
      .join('product', 'product.id', 'ad.product_id')
      .join('subcategory', 'subcategory.id', 'product.subcategory_id')
      .join('category', 'category.id', 'subcategory.category_id')
      .join('area', 'area.id', 'product.area_id')
      .join('city', 'city.id', 'area.city_id')
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'ad.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', 'product.id')
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .where(['ad.user_id'], ['='], [userId])
      .limit(page);

    const result = await query.run();
    if (result.success) {
      let ads = result.data;
      if (ads.length > 0) {
        ads = Object.values(ads.reduce(prepareAd, {}));
        const premiumAds = ads.filter((ad) => ad.ad_package_id !== null).sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
        const regularAds = ads.filter((ad) => ad.ad_package_id === null).sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
        ads = [...premiumAds, ...regularAds];
        await redisClient.set(req.headers['cacheKey'], JSON.stringify(ads), { EX: process.env.CACHE_EXPIRE_TIME });
      }
      return res.status(httpStatus.OK).json({ ads });
    } else {
      throw ApiError.internal('Failed to get ads');
    }
  } catch (error) {
    next(error);
  }
};

const getAllActiveAds = async (req, res, next) => {
  try {
    const { page } = req.query;
    const countryId = req.get('countryId');
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('ad', [
        'ad.*',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `product.name_${lang} as product_name, product.description_${lang} as product_description, product.images, product.videos, product.subcategory_id, product.thirdcategory_id, product.area_id, product.status_id as product_status_id, product.price, product.original_currency_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `category.id as category_id, category.name_${lang} as category_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as ad_status_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type, subcategory_attribute.is_required`,
        'product_attribute.value as product_attribute_value'
      ])
      .join('product', 'product.id', 'ad.product_id')
      .join('subcategory', 'subcategory.id', 'product.subcategory_id')
      .join('category', 'category.id', 'subcategory.category_id')
      .join('area', 'area.id', 'product.area_id')
      .join('city', 'city.id', 'area.city_id')
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'ad.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', 'product.id')
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .where(['ad.status_id', 'ad.country_id'], ['=', '='], [1, countryId])
      .limit(page);

    const result = await query.run();
    if (result.success) {
      let ads = result.data;
      if (ads.length > 0) {
        ads = Object.values(ads.reduce(prepareAd, {}));
        const premiumAds = ads.filter((ad) => ad.ad_package_id !== null).sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
        const regularAds = ads.filter((ad) => ad.ad_package_id === null).sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
        ads = [...premiumAds, ...regularAds];
        await redisClient.set(req.headers['cacheKey'], JSON.stringify(ads), { EX: process.env.CACHE_EXPIRE_TIME });
      }
      return res.status(httpStatus.OK).json({ ads });
    } else {
      throw ApiError.internal('Failed to get ads');
    }
  } catch (error) {
    next(error);
  }
};

const getAllAds = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('ad').limit(page);
    const result = await query.run();
    if (result.success) {
      const ads = result.data;
      await redisClient.set(req.headers['cacheKey'], JSON.stringify(ads), { EX: process.env.CACHE_EXPIRE_TIME });
      return res.status(httpStatus.OK).json({ ads });
    } else {
      throw ApiError.internal('Failed to get ads');
    }
  } catch (error) {
    next(error);
  }
};

const getAdById = async (req, res, next) => {
  try {
    const id = +req.params.id;
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('ad', [
        'ad.*',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `product.name_${lang} as product_name, product.description_${lang} as product_description, product.images, product.videos, product.subcategory_id, product.thirdcategory_id, product.area_id, product.status_id as product_status_id, product.price, product.original_currency_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as ad_status_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type, subcategory_attribute.is_required`,
        'product_attribute.value as product_attribute_value'
      ])
      .join('product', 'product.id', 'ad.product_id')
      .join('subcategory', 'subcategory.id', 'product.subcategory_id')
      .join('category', 'category.id', 'subcategory.category_id')
      .join('area', 'area.id', 'product.area_id')
      .join('city', 'city.id', 'area.city_id')
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'ad.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', 'product.id')
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .where(['ad.id'], ['='], [id]);

    const result = await query.run();
    if (result.success) {
      let ads = [];
      let tempAds = result.data;
      tempAds = Object.values(tempAds.reduce(prepareAd, {}));
      tempAds
        .sort((a, b) => b.datetime - a.datetime)
        .forEach((ad) => {
          if (ad.ad_package_id === null) {
            ads.push(ad);
          } else {
            ads.unshift(ad);
          }
        });
      return res.status(httpStatus.OK).json({ ad: ads[0] });
    } else {
      throw ApiError.notFound('Failed to get ad');
    }
  } catch (error) {
    next(error);
  }
};

const createAd = async (req, res, next) => {
  try {
    const values = {
      product_id: req.body.product_id,
      user_id: req.body.user_id || req.get('userId'),
      ad_package_id: req.body.ad_package_id,
      seller_name: req.body.seller_name,
      seller_phone: req.body.seller_phone,
      status_id: req.body.status_id,
      country_id: req.body.country_id,
      datetime:
        req.body.datetime ||
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
      allow_comments: req.body.allow_comments,
      allow_calls: req.body.allow_calls
    };
    const query = new QueryBuilder().insert('ad', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Ad created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create ad');
    }
  } catch (error) {
    next(error);
  }
};

const editAd = async (req, res, next) => {
  try {
    const id = +req.params.id;
    const values = {
      product_id: req.body.product_id,
      user_id: req.body.user_id,
      ad_package_id: req.body.ad_package_id,
      seller_name: req.body.seller_name,
      seller_phone: req.body.seller_phone,
      status_id: req.body.status_id,
      country_id: req.body.country_id,
      datetime: req.body.datetime,
      num_views: req.body.num_views,
      num_calls: req.body.num_calls,
      allow_comments: req.body.allow_comments,
      allow_calls: req.body.allow_calls
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('ad', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Ad updated successfully' });
    } else {
      throw ApiError.internal('Failed to update ad');
    }
  } catch (error) {
    next(error);
  }
};

const deleteAd = async (req, res, next) => {
  try {
    const id = +req.params.id;
    const query = new QueryBuilder().delete('ad').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Ad deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete ad');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllAdsByUserId, getAllActiveAds, getAllAds, getAdById, createAd, editAd, deleteAd };
