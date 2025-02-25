const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getAllMessagesByChatId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const chatId = req.params.chatId;
    const lang = req.get('lang');
    const query = new QueryBuilder()
      .select('message', [
        'message.*',
        'sender.name as sender_name, sender.phone as sender_phone, sender.icon as sender_icon',
        'receiver.name as receiver_name, receiver.phone as receiver_phone, receiver.icon as receiver_icon'
      ])
      .join('user as sender', 'sender.id', 'message.sender_id')
      .join('user as receiver', 'receiver.id', 'message.receiver_id')
      .where(['chat_id'], ['='], [chatId])
      .limit(page);
    const result = await query.run();
    if (result.success) {
      let messages = result.data.map((message) => {
        const newMessage = {
          ...message,
          sender: {
            name: message.sender_name,
            phone: message.sender_phone,
            icon: message.sender_icon
          },
          receiver: {
            name: message.receiver_name,
            phone: message.receiver_phone,
            icon: message.receiver_icon
          }
        };
        delete newMessage.sender_name;
        delete newMessage.sender_phone;
        delete newMessage.sender_icon;
        delete newMessage.receiver_name;
        delete newMessage.receiver_phone;
        delete newMessage.receiver_icon;
        return newMessage;
      });
      messages = messages.sort((a, b) => a.datetime - b.datetime);
      return res.status(httpStatus.OK).json({ messages });
    } else {
      throw ApiError.internal('Failed to get messages');
    }
  } catch (error) {
    next(error);
  }
};

const getAllMessages = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('message').limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ messages: result.data });
    } else {
      throw ApiError.internal('Failed to get messages');
    }
  } catch (error) {
    next(error);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const body = JSON.parse(JSON.stringify(req.body));
    const values = {
      sender_id: body.sender_id,
      receiver_id: body.receiver_id,
      chat_id: body.chat_id,
      description: body.description,
      media: req.file && (req.file.filename ? '/uploads/message/' + req.file.filename : null),
      datetime:
        body.datetime ||
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    };
    const query = new QueryBuilder().insert('message', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Message created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create message');
    }
  } catch (error) {
    next(error);
  }
};

const editMessage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const values = { description: req.body.description };
    const query = new QueryBuilder().update('message', values).where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Message updated successfully' });
    } else {
      throw ApiError.internal('Failed to update message');
    }
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('message').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Message deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete message');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllMessages, getAllMessagesByChatId, createMessage, editMessage, deleteMessage };
