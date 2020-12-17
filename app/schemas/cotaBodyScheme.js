const Joi = require('joi');

const cotaBodyScheme = Joi.array().items(
  {
    idCota: Joi.string().required(),
    deliveryWh: Joi.string().required(),
    comuna: Joi.string().required(),
    shippingMethod: Joi.string().required(),
    hourDispatch: Joi.string().required(),
    date: Joi.string().required(),
    rutProvider: Joi.string().required(),
    quantity: Joi.string().required(),
    quantityMax: Joi.string().required(),
  },
);

module.exports = {
  cotaBodyScheme,
};
