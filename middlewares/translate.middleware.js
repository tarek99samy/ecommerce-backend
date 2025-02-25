const ApiError = require('../utils/ApiError');
const translate = require('translate-google');

async function translateObject(obj, translatableKeys, fromLang, tolang) {
  let stack = [obj];
  while (stack.length > 0) {
    let current = stack.pop();
    for (let [key, value] of Object.entries(current)) {
      if (typeof value === 'object' && value !== null) {
        stack.push(value);
      } else {
        if (translatableKeys.includes(key)) {
          current[key.replace(`_${fromLang}`, '')] = await translate(value, { from: fromLang, to: tolang }); // Translate and replace
          delete current[key.split('_')[0] + '_en'];
          delete current[key.split('_')[0] + '_ar'];
        }
      }
    }
  }
  return obj;
}

const translateDifferentLang = async (items, translatableKeys, fromLang, toLang) => {
  try {
    let data = items;
    if (toLang !== 'en' && toLang !== 'ar' && data.length) {
      if (toLang.length !== 2 || fromLang.length !== 2) {
        throw ApiError.badRequest('lang must be in ISO 639-1 format');
      }
      for (let i = 0; i < data.length; i++) {
        data[i] = await translateObject(data[i], translatableKeys, fromLang, toLang);
      }
    }
    return data;
  } catch (error) {
    throw ApiError.badRequest(error.message);
  }
};

module.exports = { translateDifferentLang };
