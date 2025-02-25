const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { translateDifferentLang } = require('../middlewares/translate.middleware.js');

const getAllAreasInCountry = async (req, res, next) => {
  try {
    const { page } = req.query;
    const countryId = req.params.countryId;
    const query = new QueryBuilder()
      .select('area', [
        'area.*',
        'city.id as city_id',
        'city.name_en as city_name_en',
        'city.name_ar as city_name_ar',
        'city.country_id as city_country_id',
        'country.name_en as country_name_en',
        'country.name_ar as country_name_ar'
      ])
      .join('city', 'city.id', 'area.city_id')
      .join('country', 'country.id', 'city.country_id')
      .where(['city.country_id'], ['='], [countryId])
      .limit(page);
    const result = await query.run();
    if (result.success) {
      let areas = result.data.map((area) => {
        const newArea = {
          ...area,
          city: {
            id: area.city_id,
            name_en: area.city_name_en,
            name_ar: area.city_name_ar,
            country_id: area.city_country_id
          },
          country: {
            id: area.city_country_id,
            name_en: area.country_name_en,
            name_ar: area.country_name_ar
          }
        };
        delete newArea.city_id;
        delete newArea.city_name_en;
        delete newArea.city_name_ar;
        delete newArea.city_country_id;
        delete newArea.country_name_en;
        delete newArea.country_name_ar;
        return newArea;
      });
      areas = await translateDifferentLang(areas, ['name_en'], 'en', req.get('lang'));
      return res.status(httpStatus.OK).json({ areas });
    } else {
      throw ApiError.internal('Failed to get areas');
    }
  } catch (error) {
    next(error);
  }
};

const getAllAreasInCity = async (req, res, next) => {
  try {
    const { page } = req.query;
    const cityId = req.params.cityId;
    const query = new QueryBuilder()
      .select('area', [
        'area.*',
        'city.id as city_id',
        'city.name_en as city_name_en',
        'city.name_ar as city_name_ar',
        'city.country_id as city_country_id'
      ])
      .join('city', 'city.id', 'area.city_id')
      .where(['city_id'], ['='], [cityId])
      .limit(page);
    const result = await query.run();
    if (result.success) {
      let areas = result.data.map((area) => {
        const newArea = {
          ...area,
          city: {
            id: area.city_id,
            name_en: area.city_name_en,
            name_ar: area.city_name_ar,
            country_id: area.city_country_id
          }
        };
        delete newArea.city_id;
        delete newArea.city_name_en;
        delete newArea.city_name_ar;
        delete newArea.city_country_id;
        return newArea;
      });
      areas = await translateDifferentLang(areas, ['name_en'], 'en', req.get('lang'));
      return res.status(httpStatus.OK).json({ areas });
    } else {
      throw ApiError.internal('Failed to get areas');
    }
  } catch (error) {
    next(error);
  }
};

const getAllAreas = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('area').limit(page);
    const result = await query.run();
    if (result.success) {
      let areas = await translateDifferentLang(result.data, ['name_en'], 'en', req.get('lang'));
      return res.status(httpStatus.OK).json({ areas });
    } else {
      throw ApiError.internal('Failed to get areas');
    }
  } catch (error) {
    next(error);
  }
};

const getAreaById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder()
      .select('area', [
        'area.*',
        'city.id as city_id',
        'city.name_en as city_name_en',
        'city.name_ar as city_name_ar',
        'city.country_id as city_country_id',
        'country.name_en as country_name_en',
        'country.name_ar as country_name_ar'
      ])
      .join('city', 'city.id', 'area.city_id')
      .join('country', 'country.id', 'city.country_id')
      .where(['area.id'], ['='], [id]);

    const result = await query.run();
    if (result.success) {
      const area = {
        ...result.data[0],
        city: {
          id: result.data[0].city_id,
          name_en: result.data[0].city_name_en,
          name_ar: result.data[0].city_name_ar,
          country_id: result.data[0].city_country_id
        },
        country: {
          id: result.data[0].city_country_id,
          name_en: result.data[0].country_name_en,
          name_ar: result.data[0].country_name_ar
        }
      };
      delete area.city_id;
      delete area.city_name_en;
      delete area.city_name_ar;
      delete area.city_country_id;
      delete area.country_name_en;
      delete area.country_name_ar;
      return res.status(httpStatus.OK).json({ area });
    } else {
      throw ApiError.notFound('Failed to get area');
    }
  } catch (error) {
    next(error);
  }
};

const createArea = async (req, res, next) => {
  try {
    const values = { name_en: req.body.name_en, name_ar: req.body.name_ar, city_id: req.body.city_id };
    const query = new QueryBuilder().insert('area', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Area created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create area');
    }
  } catch (error) {
    next(error);
  }
};

const editArea = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = { name_en: req.body.name_en, name_ar: req.body.name_ar, city_id: req.body.city_id };
    const query = new QueryBuilder().update('area', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Area updated successfully' });
    } else {
      throw ApiError.internal('Failed to update area');
    }
  } catch (error) {
    next(error);
  }
};

const deleteArea = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('area').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Area deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete area');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllAreasInCountry, getAllAreasInCity, getAllAreas, getAreaById, createArea, editArea, deleteArea };
