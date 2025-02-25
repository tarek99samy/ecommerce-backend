const QueryBuilder = require('../config/db.js');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const prepareChat = (acc, chat) => {
  if (!acc[chat.id]) {
    acc[chat.id] = chat;
    delete acc[chat.id].row_num;
  } else if (acc[chat.id].last_message_datetime < chat.last_message_datetime) {
    acc[chat.id] = chat;
  }
  return acc;
};

const getAllChatsByUserId = async (req, res, next) => {
  try {
    const { page } = req.query;
    const userId = req.get('userId');
    const lang = req.get('lang');
    // get all chats of the user and filter by sender and receiver and its last message
    const query = new QueryBuilder()
      .select('chat', [
        'chat.*',
        `product.name_${lang} as product_name, product.description_${lang} as product_description`,
        `senders.name as sender_name, senders.phone as sender_phone, senders.icon as sender_icon`,
        `receivers.name as receiver_name, receivers.phone as receiver_phone, receivers.icon as receiver_icon`,
        'message.datetime as last_message_datetime, message.description as last_message_description, message.sender_id as last_message_sender_id, message.receiver_id as last_message_receiver_id'
      ])
      .join('product', 'product.id', 'chat.product_id')
      .join('message', 'message.chat_id', 'chat.id')
      .leftJoin('user as senders', 'senders.id', 'chat.sender_id')
      .leftJoin('user as receivers', 'receivers.id', 'chat.receiver_id')
      .orderBy('message.datetime', ' DESC ')
      .with('chat.id')
      .limit(page);

    const result = await query.run();
    if (result.success) {
      let chats = { sentChats: [], receivedChats: [] };
      if (result.data.length > 0) {
        // prepare chats as sender
        chats.sentChats = result.data
          .filter((chat) => +chat.sender_id === +userId)
          .map((chat) => {
            const newChat = {
              ...chat,
              lastMessage: {
                datetime: chat.last_message_datetime,
                description: chat.last_message_description,
                senderId: chat.last_message_sender_id,
                receiverId: chat.last_message_receiver_id
              }
            };
            delete newChat.sender_name;
            delete newChat.sender_phone;
            delete newChat.sender_icon;
            delete newChat.last_message_datetime;
            delete newChat.last_message_description;
            delete newChat.last_message_sender_id;
            delete newChat.last_message_receiver_id;
            return newChat;
          });
        chats.sentChats = Object.values(chats.sentChats.reduce(prepareChat, {}));

        // prepare chats as receiver
        chats.receivedChats = result.data
          .filter((chat) => +chat.receiver_id === +userId)
          .map((chat) => {
            const newChat = {
              ...chat,
              lastMessage: {
                datetime: chat.last_message_datetime,
                description: chat.last_message_description,
                senderId: chat.last_message_sender_id,
                receiverId: chat.last_message_receiver_id
              }
            };
            delete newChat.receiver_name;
            delete newChat.receiver_phone;
            delete newChat.receiver_icon;
            delete newChat.last_message_datetime;
            delete newChat.last_message_description;
            delete newChat.last_message_sender_id;
            delete newChat.last_message_receiver_id;
            return newChat;
          });
        chats.receivedChats = Object.values(chats.receivedChats.reduce(prepareChat, {}));
      }
      return res.status(httpStatus.OK).json(chats);
    } else {
      throw ApiError.internal('Failed to get chats by user');
    }
  } catch (error) {
    next(error);
  }
};

const getChatBetweenTwoUsersOnProduct = async (req, res, next) => {
  try {
    const createIfNull = +req.query.createIfNull || false;
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    const productId = req.params.productId;
    const query = new QueryBuilder()
      .select('chat', ['chat.id'])
      .where(['sender_id', 'receiver_id', 'product_id'], ['=', '=', '='], [senderId, receiverId, productId]);
    const result = await query.run();
    if (result.success) {
      if (result.data.length > 0) {
        return res.status(httpStatus.OK).json({ chatId: result.data[0].id });
      } else if (createIfNull) {
        const values = {
          sender_id: senderId,
          receiver_id: receiverId,
          product_id: productId
        };
        const query = new QueryBuilder().insert('chat', values);
        const result = await query.run();
        if (result.success && result.data.insertId !== null) {
          return res.status(httpStatus.CREATED).json({ message: 'Chat created successfully', chatId: result.data.insertId });
        } else {
          throw ApiError.internal('Failed to create chat');
        }
      } else {
        throw ApiError.notFound('Chat not found');
      }
    } else {
      throw ApiError.internal('Failed to get chat between two users');
    }
  } catch (error) {
    next(error);
  }
};

const getAllChats = async (req, res, next) => {
  try {
    const { page } = req.query;
    const query = new QueryBuilder().select('chat').limit(page);
    const result = await query.run();
    if (result.success) {
      return res.status(httpStatus.OK).json({ chats: result.data });
    } else {
      throw ApiError.internal('Failed to get chats');
    }
  } catch (error) {
    next(error);
  }
};

const createChat = async (req, res, next) => {
  try {
    const values = {
      sender_id: req.body.sender_id,
      receiver_id: req.body.receiver_id,
      product_id: req.body.product_id
    };
    const query = new QueryBuilder().insert('chat', values);
    const result = await query.run();
    if (result.success && result.data.insertId !== null) {
      return res.status(httpStatus.CREATED).json({ message: 'Chat created successfully', id: result.data.insertId });
    } else {
      throw ApiError.internal('Failed to create chat');
    }
  } catch (error) {
    next(error);
  }
};

const deleteChat = async (req, res, next) => {
  try {
    const id = req.params.id;
    const query = new QueryBuilder().delete('chat').where(['id'], ['='], [id]);
    const result = await query.run();
    if (result.success && result.data.affectedRows > 0) {
      return res.status(httpStatus.OK).json({ message: 'Chat deleted successfully' });
    } else {
      throw ApiError.internal('Failed to delete chat');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllChats, getAllChatsByUserId, getChatBetweenTwoUsersOnProduct, createChat, deleteChat };
