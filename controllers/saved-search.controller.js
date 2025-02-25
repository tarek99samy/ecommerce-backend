const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllSavedSearchesByUserId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const userId = req.get('userId');
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('saved_search', [
        'saved_search.id, saved_search.keyword',
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`
      ])
      .join('area', 'area.id', 'saved_search.area_id')
      .join('city', 'city.id', 'area.city_id')
      .where(['saved_search.user_id'], ['='], [userId])
      .limit(page);

    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ savedSearches: result.data });
    } else {
      throw ApiError.internal('Failed to get saved searches');
    }
  } catch (error) {
    next(error);
  }
};

const getAllSavedSearches = async (req, res, next) => {
  try {
    const { page } = req.query;
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('saved_search', [
        'saved_search.id, saved_search.keyword',
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`
      ])
      .join('area', 'area.id', 'saved_search.area_id')
      .join('city', 'city.id', 'area.city_id')
      .limit(page);

    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ savedSearches: result.data });
    } else {
      throw ApiError.internal('Failed to get saved searches');
    }
  } catch (error) {
    next(error);
  }
};

const getSavedSearchById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('saved_search', [
        'saved_search.id, saved_search.keyword',
        `area.name_${lang} as area_name`,
        `city.name_${lang} as city_name`
      ])
      .join('area', 'area.id', 'saved_search.area_id')
      .join('city', 'city.id', 'area.city_id')
      .where(['saved_search.id'], ['='], [id]);

    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ savedSearche: result.data });
    } else {
      throw ApiError.internal('Failed to get saved search');
    }
  } catch (error) {
    next(error);
  }
};

const createSavedSearch = async (req, res, next) => {
  try {
    const values = {
      user_id: req.get('userId'),
      city_id: req.body.city_id,
      area_id: req.body.area_id,
      keyword: req.body.keyword
    };
    const query = new QueryBuilder().insert('saved_search', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Saved search created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create saved search');
    }
  } catch (error) {
    next(error);
  }
};

const editSavedSearch = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = { keyword: req.body.keyword };
    const query = new QueryBuilder().update('saved_search', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Saved search updated successfully' });
    } else {
      throw ApiError.internal('Failed to update saved search');
    }
  } catch (error) {
    next(error);
  }
};

const deleteSavedSearch = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('saved_search').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Saved search deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete saved search');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSavedSearchesByUserId,
  getAllSavedSearches,
  getSavedSearchById,
  createSavedSearch,
  editSavedSearch,
  deleteSavedSearch
};
