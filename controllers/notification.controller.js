const db = require('../config/db.js');
const httpStatus = require('http-status');
const { createSchema } = require('../models/notification.model');

const getAllNotificationsByUserId = async (req, res) => {
  const userId = req.params.userId;
  const { page, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    db.query(
      `SELECT * FROM notification WHERE user_id = ? ${page && 'LIMIT ? OFFSET ?'}`,
      [userId, limit, offset],
      (err, result) => {
        if (err) {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error: err.sqlMessage });
        }
        return res.status(httpStatus.OK).json({ notifications: result });
      }
    );
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
  }
};

const getAllNotifications = async (req, res) => {
  const { page, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    db.query(`SELECT * FROM notification ${page && 'LIMIT ? OFFSET ?'}`, [limit, offset], (err, result) => {
      if (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error: err.sqlMessage });
      }
      return res.status(httpStatus.OK).json({ notifications: result });
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
  }
};

const getNotificationById = async (req, res) => {
  const id = req.params.id;
  try {
    db.query(`SELECT * FROM notification WHERE id = ?`, [id], (err, result) => {
      if (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error: err.sqlMessage });
      }
      if (result.length === 0) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Notification not found' });
      }
      return res.status(httpStatus.OK).json({ notification: result });
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
  }
};

const createNotification = async (req, res) => {
  const { user_id, title, description, status_id } = req.body;
  try {
    await createSchema.validateAsync({ user_id, title, description, status_id });
    db.query(
      'INSERT INTO notification (user_id, title, description, status_id) VALUES (?, ?, ?, ?)',
      [user_id, title, description, status_id],
      (err, result) => {
        if (err) {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error: err.sqlMessage });
        }
        return res.status(httpStatus.CREATED).json({ message: 'Notification created successfully', id: result.insertId });
      }
    );
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
  }
};

const editNotification = async (req, res) => {
  const id = req.params.id;
  const { user_id, title, description, status_id } = req.body;
  try {
    db.query(
      'UPDATE notification SET user_id = ?, title = ?, description = ?, status_id = ? WHERE id = ?',
      [user_id, title, description, status_id, id],
      (err, result) => {
        if (err) {
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error: err.sqlMessage });
        }
        if (result.affectedRows === 0) {
          return res.status(httpStatus.NOT_FOUND).json({ message: 'Notification not found' });
        }
        return res.status(httpStatus.OK).json({ message: 'Notification updated successfully' });
      }
    );
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
  }
};

const deleteNotification = async (req, res) => {
  const id = req.params.id;
  try {
    db.query('DELETE FROM notification WHERE id = ?', [id], (err, result) => {
      if (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error: err.sqlMessage });
      }
      if (result.affectedRows === 0) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Notification not found' });
      }
      return res.status(httpStatus.OK).json({ message: 'Notification deleted successfully' });
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error });
  }
};

module.exports = {
  getAllNotificationsByUserId,
  getAllNotifications,
  getNotificationById,
  createNotification,
  editNotification,
  deleteNotification
};
