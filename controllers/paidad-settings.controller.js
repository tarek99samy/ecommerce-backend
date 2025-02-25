const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllPaidAdSettings = async (req, res, next) => {
  try {
    const { page } = req.query;
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('paid_ad_settings', ['paid_ad_settings.*', `currency.name_${lang} as currency_name`])
      .join('currency', 'currency.id', 'paid_ad_settings.currency_id')
      .limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ paidAdSettings: result.data });
    } else {
      throw ApiError.internal('Failed to get paid ad settings');
    }
  } catch (error) {
    next(error);
  }
};
const getPaidAdSettingsById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder()
      .select('paid_ad_settings', ['paid_ad_settings.*', `currency.name_${lang} as currency_name`])
      .join('currency', 'currency.id', 'paid_ad_settings.currency_id')
      .where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.length > 0) {
      return res.status(httpStatus.OK).json({ paidAdSetting: result.data[0] });
    } else {
      throw ApiError.internal('Failed to get paid ad setting');
    }
  } catch (error) {
    next(error);
  }
};
const createPaidAdSettings = async (req, res, next) => {
  try {
    const values = {
      name_en: req.body.name_en,
      name_ar: req.body.name_ar,
      price: req.body.price,
      type: req.body.type,
      value: req.body.value,
      currency_id: req.body.currency_id
    };
    const query = new QueryBuilder().insert('paid_ad_settings', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create paid ad setting');
    }
  } catch (error) {
    next(error);
  }
};
const editPaidAdSettings = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = {
      name_en: req.body.name_en,
      name_ar: req.body.name_ar,
      price: req.body.price,
      type: req.body.type,
      value: req.body.value,
      currency_id: req.body.currency_id
    };
    for (const key in values) {
      if (values[key] === null || values[key] === undefined) {
        delete values[key];
      }
    }
    const query = new QueryBuilder().update('paid_ad_settings', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Paid ad setting updated successfully' });
    } else {
      throw ApiError.internal('Failed to update paid ad setting');
    }
  } catch (error) {
    next(error);
  }
};
const deletePaidAdSettings = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('paid_ad_settings').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Paid ad setting deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete paid ad setting');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPaidAdSettings,
  getPaidAdSettingsById,
  createPaidAdSettings,
  editPaidAdSettings,
  deletePaidAdSettings
};
