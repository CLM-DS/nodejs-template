const { persistAndMove } = require('../services');
const { cotaBodyScheme, cotaHeaderScheme } = require('../schemas');
const { useValidation } = require('../utils/validator');

const handlerCota = useValidation([{
  property: 'request.body',
  scheme: cotaBodyScheme,
}, {
  property: 'request.header',
  scheme: cotaHeaderScheme,
}], persistAndMove);

module.exports = {
  handlerCota,
};
