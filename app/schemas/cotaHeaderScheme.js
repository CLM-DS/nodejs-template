const Joi = require('joi');

const cotaHeaderScheme = Joi.object().keys({
  'x-channel': Joi.string().required(),
  'x-commerce': Joi.string().required(),
  'x-eventid': Joi.string().required(),
  'x-apikey': Joi.string().required(),
  'x-country': Joi.string().valid('PE', 'CL').required(),
}).unknown(true);

module.exports = {
  cotaHeaderScheme,
};
