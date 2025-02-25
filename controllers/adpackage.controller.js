const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const prepareAdPackage = (adpackage) => {
  const newAdpackage = {
    ...adpackage,
    currency: {
      name_en: adpackage.currency_name_en,
      name_ar: adpackage.currency_name_ar
    },
    status: {
      name_en: adpackage.status_name_en,
      name_ar: adpackage.status_name_ar
    }
  };
  delete newAdpackage.currency_name_en;
  delete newAdpackage.currency_name_ar;
  delete newAdpackage.status_name_en;
  delete newAdpackage.status_name_ar;
  return newAdpackage;
};

const getAllActiveAdpackages = async (req, res, next) => {
  try {
    const { page } = req.query;
    const countryId = req.get('countryId');
    const query = new QueryBuilder()
      .select('ad_package', [
        'ad_package.*',
        'currency.name_en as currency_name_en',
        'currency.name_ar as currency_name_ar',
        'status.name_en as status_name_en',
        'status.name_ar as status_name_ar'
      ])
      .join('status', ['status.id', 'status.id'], ['ad_package.status_id', 1], true)
      .join('currency', 'currency.id', 'ad_package.currency_id')
      .where(['ad_package.country_id'], ['='], [countryId])
      .limit(page);

    const result = await query.run();
    if (result.success) {
      const adpackages = result.data.map(prepareAdPackage);
      return res.status(httpStatus.OK).json({ adpackages });
    } else {
      throw ApiError.internal('Failed to get adpackages');
    }
  } catch (error) {
    next(error);
  }
};

const getAllAdpackages = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('ad_package').limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ adpackages: result.data });
    } else {
      throw ApiError.internal('Failed to get adpackages');
    }
  } catch (error) {
    next(error);
  }
};

const getAdpackageById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder()
      .select('ad_package', [
        'ad_package.*',
        'currency.name_en as currency_name_en',
        'currency.name_ar as currency_name_ar',
        'status.name_en as status_name_en',
        'status.name_ar as status_name_ar'
      ])
      .join('status', 'status.id', 'ad_package.status_id')
      .join('currency', 'currency.id', 'ad_package.currency_id')
      .where(['ad_package.id'], ['='], [id]);

    const result = await query.run();
    if (result.success) {
      let adpackage = result.data.map(prepareAdPackage);
      return res.status(httpStatus.OK).json({ adpackage });
    } else {
      throw ApiError.notFound('Failed to get adpackages');
    }
  } catch (error) {
    next(error);
  }
};

const createAdpackage = async (req, res, next) => {
  try {
    const values = {
      name_en: req.body.name_en,
      name_ar: req.body.name_ar,
      description_en: req.body.description_en,
      description_ar: req.body.description_ar,
      price: req.body.price,
      currency_id: req.body.currency_id,
      discount: req.body.discount,
      icon: req.body.icon,
      title_color: req.body.title_color,
      status_id: req.body.status_id,
      country_id: req.body.country_id
    };
    const query = new QueryBuilder().insert('ad_package', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Ad package created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create ad package');
    }
  } catch (error) {
    next(error);
  }
};

const editAdpackage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      name_en: req.body.name_en,
      name_ar: req.body.name_ar,
      description_en: req.body.description_en,
      description_ar: req.body.description_ar,
      price: req.body.price,
      currency_id: req.body.currency_id,
      discount: req.body.discount,
      icon: req.body.icon,
      title_color: req.body.title_color,
      status_id: req.body.status_id,
      country_id: req.body.country_id
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('ad_package', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Ad package updated successfully' });
    } else {
      throw ApiError.internal('Failed to update ad package');
    }
  } catch (error) {
    next(error);
  }
};

const deleteAdpackage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('ad_package').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Ad package deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete ad package');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllActiveAdpackages,
  getAllAdpackages,
  getAdpackageById,
  createAdpackage,
  editAdpackage,
  deleteAdpackage
};
