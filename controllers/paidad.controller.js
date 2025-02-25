const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllTopPaidAds = async (req, res, next) => {
  try {
    const { count, country_id, city_id, area_id } = req.query;
    const lang = req.get('lang');
    let whereValues = { keys: ['status_id', 'is_premium', 'country_id'], opers: ['=', '>=', '='], values: [1, 1, +country_id] };
    let query = new QueryBuilder().select('paid_ad', ['paid_ad.*', `title_${lang} as title`, `description_${lang} as description`]);
    if (+city_id) {
      whereValues.keys.push('city_id');
      whereValues.opers.push('=');
      whereValues.values.push(+city_id);
    }
    if (+area_id) {
      whereValues.keys.push('area_id');
      whereValues.opers.push('=');
      whereValues.values.push(+area_id);
    }
    query = query.where(whereValues.keys, whereValues.opers, whereValues.values).orderBy('id', 'DESC').limit(1, +count);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ paidAds: result.data });
    } else {
      throw ApiError.internal('Failed to get top paid ads');
    }
  } catch (error) {
    next(error);
  }
};

const getAllPaidAdsByCategoryId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const categoryId = req.params.categoryId;
    const lang = req.get('lang');
    const countryId = req.get('countryId');
    const query = new QueryBuilder()
      .select('paid_ad', ['paid_ad.*', `title_${lang} as title`, `description_${lang} as description`])
      .where(['status_id', 'category_id', 'is_premium', 'country_id'], ['=', '=', '!=', '='], [1, categoryId, 1, countryId])
      .limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ paidAds: result.data });
    } else {
      throw ApiError.internal('Failed to get paid ads by category');
    }
  } catch (error) {
    next(error);
  }
};

const getAllPremiumPaidAds = async (req, res, next) => {
  try {
    const { page } = req.query;
    const lang = req.get('lang');
    const countryId = req.get('countryId');
    const query = new QueryBuilder()
      .select('paid_ad', ['paid_ad.*', `title_${lang} as title`, `description_${lang} as description`])
      .where(['is_premium', 'country_id'], ['>=', '='], [1, countryId])
      .limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ paidAds: result.data });
    } else {
      throw ApiError.internal('Failed to get premium paid ads');
    }
  } catch (error) {
    next(error);
  }
};

const getAllActivePaidAds = async (req, res, next) => {
  try {
    const { page } = req.query;
    const lang = req.get('lang');
    const countryId = req.get('countryId');
    const query = new QueryBuilder()
      .select('paid_ad', ['paid_ad.*', `title_${lang} as title`, `description_${lang} as description`])
      .where(['status_id', 'country_id'], ['=', '='], [1, countryId])
      .limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ paidAds: result.data });
    } else {
      throw ApiError.internal('Failed to get active paid ads');
    }
  } catch (error) {
    next(error);
  }
};

const getAllPaidAds = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('paid_ad').limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ paidAds: result.data });
    } else {
      throw ApiError.internal('Failed to get paid ads');
    }
  } catch (error) {
    next(error);
  }
};

const getRandomPaidAdByCategoryId = async (req, res, next) => {
  try {
    const { country_id, city_id, area_id } = req.query;
    const categoryId = +req.params.categoryId;
    const lang = req.get('lang');
    let whereValues = { keys: ['status_id', 'category_id', 'country_id'], opers: ['=', '=', '='], values: [1, categoryId, +country_id] };
    let query = new QueryBuilder().select('paid_ad', ['paid_ad.*', `title_${lang} as title`, `description_${lang} as description`]);
    if (city_id) {
      whereValues.keys.push('city_id');
      whereValues.opers.push('=');
      whereValues.values.push(+city_id);
    }
    if (area_id) {
      whereValues.keys.push('area_id');
      whereValues.opers.push('=');
      whereValues.values.push(+area_id);
    }
    query = query.where(whereValues.keys, whereValues.opers, whereValues.values).orderBy('rand()').limit(1, 1);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ paidAd: result.data });
    } else {
      throw ApiError.internal('Failed to get paid ads by category');
    }
  } catch (error) {
    next(error);
  }
};

const createPaidAd = async (req, res, next) => {
  try {
    const values = {
      title_en: req.body.title_en,
      title_ar: req.body.title_ar,
      description_en: req.body.description_en,
      description_ar: req.body.description_ar,
      image: req.body.image,
      link: req.body.link,
      category_id: req.body.category_id,
      is_premium: req.body.is_premium,
      status_id: req.body.status_id,
      country_id: req.body.country_id,
      city_id: req.body.city_id,
      area_id: req.body.area_id,
      remaining_days: req.body.remaining_days
    };
    const query = new QueryBuilder().insert('paid_ad', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Paid ad created successfully', id: result.data.insertId });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Failed to create paid ad' });
    }
  } catch (error) {
    next(error);
  }
};

const editPaidAd = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      title_en: req.body.title_en,
      title_ar: req.body.title_ar,
      description_en: req.body.description_en,
      description_ar: req.body.description_ar,
      image: req.body.image,
      link: req.body.link,
      category_id: req.body.category_id,
      is_premium: req.body.is_premium,
      status_id: req.body.status_id,
      country_id: req.body.country_id,
      city_id: req.body.city_id,
      area_id: req.body.area_id,
      remaining_days: req.body.remaining_days,
      num_views: req.body.num_views
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('paid_ad', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Paid ad updated successfully' });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Failed to update paid ad' });
    }
  } catch (error) {
    next(error);
  }
};

const deletePaidAd = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('paid_ad').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Paid ad deleted successfully' });
    } else {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Failed to delete paid ad' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTopPaidAds,
  getAllPaidAdsByCategoryId,
  getAllPremiumPaidAds,
  getAllActivePaidAds,
  getAllPaidAds,
  getRandomPaidAdByCategoryId,
  createPaidAd,
  editPaidAd,
  deletePaidAd
};
