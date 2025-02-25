const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const prepareFavouriteProducts = (acc, favouriteProduct, userId = null) => {
  if (!acc[favouriteProduct.favourite_product_id]) {
    acc[favouriteProduct.favourite_product_id] = {
      id: favouriteProduct.favourite_product_id,
      user_id: favouriteProduct.favourite_product_user_id,
      product_id: favouriteProduct.favourite_product_product_id,
      product: {
        ...favouriteProduct,
        is_favourite: userId ? true : false,
        ad: {
          id: favouriteProduct.ad_id,
          product_id: favouriteProduct.ad_product_id,
          user_id: favouriteProduct.ad_user_id,
          ad_package_id: favouriteProduct.ad_ad_package_id,
          seller_name: favouriteProduct.ad_seller_name,
          seller_phone: favouriteProduct.ad_seller_phone,
          status_id: favouriteProduct.ad_status_id,
          country_id: favouriteProduct.ad_country_id,
          datetime: favouriteProduct.ad_datetime
        },
        ad_package: favouriteProduct.ad_package_id
          ? {
              id: favouriteProduct.ad_package_id,
              name: favouriteProduct.ad_package_name,
              description: favouriteProduct.ad_package_description,
              price: favouriteProduct.ad_package_price,
              currency_id: favouriteProduct.ad_package_currency_id,
              discount: favouriteProduct.ad_package_discount,
              icon: favouriteProduct.ad_package_icon,
              title_color: favouriteProduct.ad_package_title_color,
              country_id: favouriteProduct.ad_package_country_id,
              status_id: favouriteProduct.ad_package_status_id
            }
          : {},
        status: {
          id: favouriteProduct.status_id,
          name: favouriteProduct.status_name
        },
        currency: {
          id: favouriteProduct.original_currency_id,
          name: favouriteProduct.currency_name
        },
        attributes: []
      }
    };
    delete acc[favouriteProduct.favourite_product_id].product.ad_package_id;
    delete acc[favouriteProduct.favourite_product_id].product.ad_package_name;
    delete acc[favouriteProduct.favourite_product_id].product.ad_package_description;
    delete acc[favouriteProduct.favourite_product_id].product.ad_package_price;
    delete acc[favouriteProduct.favourite_product_id].product.ad_package_currency_id;
    delete acc[favouriteProduct.favourite_product_id].product.ad_package_discount;
    delete acc[favouriteProduct.favourite_product_id].product.ad_package_icon;
    delete acc[favouriteProduct.favourite_product_id].product.ad_package_title_color;
    delete acc[favouriteProduct.favourite_product_id].product.ad_package_country_id;
    delete acc[favouriteProduct.favourite_product_id].product.ad_package_status_id;
    delete acc[favouriteProduct.favourite_product_id].product.row_num;
    delete acc[favouriteProduct.favourite_product_id].product.favourite_product_id;
    delete acc[favouriteProduct.favourite_product_id].product.favourite_product_user_id;
    delete acc[favouriteProduct.favourite_product_id].product.favourite_product_product_id;
    delete acc[favouriteProduct.favourite_product_id].product.ad_id;
    delete acc[favouriteProduct.favourite_product_id].product.ad_product_id;
    delete acc[favouriteProduct.favourite_product_id].product.ad_user_id;
    delete acc[favouriteProduct.favourite_product_id].product.ad_ad_package_id;
    delete acc[favouriteProduct.favourite_product_id].product.ad_seller_name;
    delete acc[favouriteProduct.favourite_product_id].product.ad_seller_phone;
    delete acc[favouriteProduct.favourite_product_id].product.ad_status_id;
    delete acc[favouriteProduct.favourite_product_id].product.ad_country_id;
    delete acc[favouriteProduct.favourite_product_id].product.ad_datetime;
    delete acc[favouriteProduct.favourite_product_id].product.status_name;
    delete acc[favouriteProduct.favourite_product_id].product.status_id;
    delete acc[favouriteProduct.favourite_product_id].product.currency_name;
    delete acc[favouriteProduct.favourite_product_id].product.original_currency_id;
  }
  if (favouriteProduct.product_attribute_value) {
    acc[favouriteProduct.favourite_product_id].product.attributes.push({
      name: favouriteProduct.subcategory_attribute_name,
      data_type: favouriteProduct.data_type,
      value: favouriteProduct.product_attribute_value
    });
  }
  delete acc[favouriteProduct.favourite_product_id].product.subcategory_attribute_name;
  delete acc[favouriteProduct.favourite_product_id].product.data_type;
  delete acc[favouriteProduct.favourite_product_id].product.product_attribute_value;
  return acc;
};

const getAllFavouriteProductsByUserId = async (req, res, next) => {
  try {
    const userId = req.get('userId');
    const lang = req.get('lang');
    const countryId = req.get('countryId');
    const { page } = req.query;
    const query = new QueryBuilder()
      .select('favourite_product', [
        'favourite_product.id as favourite_product_id, favourite_product.user_id as favourite_product_user_id, favourite_product.product_id as favourite_product_product_id',
        'product.*',
        'ad.id as ad_id, ad.product_id as ad_product_id, ad.user_id as ad_user_id, ad.ad_package_id as ad_ad_package_id, ad.seller_name as ad_seller_name, ad.seller_phone as ad_seller_phone, ad.status_id as ad_status_id, ad.country_id as ad_country_id, ad.datetime as ad_datetime',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as status_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type`,
        'product_attribute.value as product_attribute_value'
      ])
      .join('product', 'product.id', 'favourite_product.product_id')
      .join('ad', 'ad.product_id', 'product.id')
      .join('area', 'area.id', 'product.area_id')
      .join('city', ['city.id', 'city.country_id'], ['area.city_id', countryId], true)
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'product.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', 'product.id')
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .where(['favourite_product.user_id'], ['='], [userId])
      .with('product.id')
      .limit(page);
    const result = await query.run();
    if (result.success) {
      let favouriteProducts = result.data;
      if (favouriteProducts.length > 0) {
        favouriteProducts = Object.values(
          favouriteProducts.reduce((acc, favouriteProduct) => prepareFavouriteProducts(acc, favouriteProduct, userId), {})
        );
      }
      return res.status(httpStatus.OK).json({ favouriteProducts });
    } else {
      throw ApiError.internal('Failed to get favourite products by user');
    }
  } catch (error) {
    next(error);
  }
};

const getAllFavouriteProducts = async (req, res, next) => {
  try {
    const lang = req.get('lang');
    const countryId = req.get('countryId');
    const { page } = req.query;
    const query = new QueryBuilder()
      .select('favourite_product', [
        'favourite_product.id as favourite_product_id, favourite_product.user_id as favourite_product_user_id, favourite_product.product_id as favourite_product_product_id',
        'product.*',
        'ad.id as ad_id, ad.product_id as ad_product_id, ad.user_id as ad_user_id, ad.ad_package_id as ad_ad_package_id, ad.seller_name as ad_seller_name, ad.seller_phone as ad_seller_phone, ad.status_id as ad_status_id, ad.country_id as ad_country_id, ad.datetime as ad_datetime',
        `ad_package.id as ad_package_id, ad_package.name_${lang} as ad_package_name, ad_package.description_${lang} as ad_package_description, ad_package.price as ad_package_price, ad_package.currency_id as ad_package_currency_id, ad_package.discount as ad_package_discount, ad_package.icon as ad_package_icon, ad_package.title_color as ad_package_title_color, ad_package.country_id as ad_package_country_id, ad_package.status_id as ad_package_status_id`,
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`,
        `currency.name_${lang} as currency_name`,
        `status.name_${lang} as status_name`,
        `subcategory_attribute.name_${lang} as subcategory_attribute_name, subcategory_attribute.data_type`,
        'product_attribute.value as product_attribute_value'
      ])
      .join('product', 'product.id', 'favourite_product.product_id')
      .join('ad', 'ad.product_id', 'product.id')
      .join('area', 'area.id', 'product.area_id')
      .join('city', ['city.id', 'city.country_id'], ['area.city_id', countryId], true)
      .join('currency', 'currency.id', 'product.original_currency_id')
      .join('status', 'status.id', 'product.status_id')
      .leftJoin('ad_package', 'ad_package.id', 'ad.ad_package_id')
      .leftJoin('product_attribute', 'product_attribute.product_id', 'product.id')
      .leftJoin('subcategory_attribute', 'subcategory_attribute.id', 'product_attribute.subcategory_attribute_id')
      .with('product.id')
      .limit(page);
    const result = await query.run();
    if (result.success) {
      let favouriteProducts = result.data;
      if (favouriteProducts.length > 0) {
        favouriteProducts = Object.values(favouriteProducts.reduce(prepareFavouriteProducts, {}));
      }
      return res.status(httpStatus.OK).json({ favouriteProducts });
    } else {
      throw ApiError.internal('Failed to get favourite products');
    }
  } catch (error) {
    next(error);
  }
};

const createFavouriteProduct = async (req, res, next) => {
  try {
    const values = { user_id: req.body.user_id || req.get('userId'), product_id: req.body.product_id };
    const query = new QueryBuilder().insert('favourite_product', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Favourite product created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create favourite product');
    }
  } catch (error) {
    next(error);
  }
};

const toggleFavouriteProduct = async (req, res, next) => {
  try {
    const userId = req.body.user_id || req.get('userId');
    const productId = req.body.product_id;
    const query = new QueryBuilder().select('favourite_product').where(['user_id', 'product_id'], ['=', '='], [userId, productId]);
    const result = await query.run();
    if (result.success) {
      if (result.data.length > 0) {
        req.params.productId = productId;
        return deleteFavouriteProductByUserIdAndProductId(req, res, next);
      } else {
        return createFavouriteProduct(req, res, next);
      }
    } else {
      throw ApiError.internal('Failed to toggle favourite product');
    }
  } catch (error) {
    next(error);
  }
};

const editFavouriteProduct = async (req, res, next) => {
  try {
    const values = { user_id: req.body.user_id || req.get('userId'), product_id: req.body.product_id };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().insert('favourite_product', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Favourite product created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create favourite product');
    }
  } catch (error) {
    next(error);
  }
};

const deleteFavouriteProductByUserId = async (req, res, next) => {
  try {
    const userId = req.get('userId');
    const query = new QueryBuilder().delete('favourite_product').where(['user_id'], ['='], [userId]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Favourite product deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete favourite product');
    }
  } catch (error) {
    next(error);
  }
};

const deleteFavouriteProductByUserIdAndProductId = async (req, res, next) => {
  try {
    const userId = req.get('userId');
    const productId = req.params.productId;
    const query = new QueryBuilder().delete('favourite_product').where(['user_id', 'product_id'], ['=', '='], [userId, productId]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Favourite product deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete favourite product');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFavouriteProductsByUserId,
  getAllFavouriteProducts,
  createFavouriteProduct,
  toggleFavouriteProduct,
  editFavouriteProduct,
  deleteFavouriteProductByUserId,
  deleteFavouriteProductByUserIdAndProductId
};
