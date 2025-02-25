const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { translateDifferentLang } = require('../middlewares/translate.middleware.js');

const getAllCitiesInCountry = async (req, res, next) => {
  try {
    const { page } = req.query;
    const countryId = req.params.countryId;
    const query = new QueryBuilder().select('city').where(['country_id'], ['='], [countryId]).limit(page);
    const result = await query.run();
    if (result.success) {
      let cities = await translateDifferentLang(result.data, ['name_en'], 'en', req.get('lang'));
      return res.status(httpStatus.OK).json({ cities });
    } else {
      throw ApiError.internal('Failed to get cities');
    }
  } catch (error) {
    next(error);
  }
};

const getAllCities = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('city').limit(page);
    const result = await query.run();
    if (result.success) {
      let cities = await translateDifferentLang(result.data, ['name_en'], 'en', req.get('lang'));
      return res.status(httpStatus.OK).json({ cities });
    } else {
      throw ApiError.internal('Failed to get cities');
    }
  } catch (error) {
    next(error);
  }
};

const getCityById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder()
      .select('city', ['city.*', 'country.name_en as country_name_en', 'country.name_ar as country_name_ar'])
      .join('country', 'country.id', 'city.country_id')
      .where(['city.id'], ['='], [id]);
    const result = await query.run();
    if (result.success) {
      const city = {
        ...result.data[0],
        country: {
          name_en: result.data[0].country_name_en,
          name_ar: result.data[0].country_name_ar
        }
      };
      delete city.country_name_en;
      delete city.country_name_ar;
      return res.status(httpStatus.OK).json({ city });
    } else {
      throw ApiError.internal('Failed to get city');
    }
  } catch (error) {
    next(error);
  }
};

const createCity = async (req, res, next) => {
  try {
    const values = { name_en: req.body.name_en, name_ar: req.body.name_ar, country_id: req.body.country_id };
    const query = new QueryBuilder().insert('city', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'City created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create city');
    }
  } catch (error) {
    next(error);
  }
};

const editCity = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = { name_en: req.body.name_en, name_ar: req.body.name_ar, country_id: req.body.country_id };
    const query = new QueryBuilder().update('city', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'City updated successfully' });
    } else {
      throw ApiError.internal('Failed to update city');
    }
  } catch (error) {
    next(error);
  }
};

const deleteCity = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('city').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'City deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete city');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCitiesInCountry, getAllCities, getCityById, createCity, editCity, deleteCity };
