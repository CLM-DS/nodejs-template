const { statusCodes } = require('../constants/httpStatus');

/**
 * @typedef {Object} SchemeValidation
 * @property {string} property
 * @property {Object} scheme
 */

/**
  *
  * @typedef {import('../server/middlewares').ContextStd} Context
  */

/**
  * Get property access
  * @param {string} property
  * @param {Context} ctx
  */
const getProperty = (property, ctx) => {
  const properties = property.split('.');
  return properties.reduce((acc, prop) => (acc ? acc[prop] : ctx[prop]), undefined);
};

/**
 * Evaluate Schemas
 * @param {[SchemeValidation]} schemas
 * @param {Context} ctx
 */
const evaluateSchemes = (schemas, ctx) => {
  const err = schemas.reduce((acc, item) => {
    if (acc) {
      return acc;
    }
    const { property, scheme } = item;
    const data = getProperty(property, ctx);
    const { error } = scheme.validate(data);
    if (error) {
      return error;
    }
    return undefined;
  }, undefined);
  return err;
};

/**
 *
 * @param {[SchemeValidation]} schemas
 * @param {*} handler
 * @returns {(ctx: Context) => Context}
 */
const useValidation = (schemas, handler) => (ctx) => {
  const err = evaluateSchemes(schemas, ctx);
  if (!err) {
    return handler(ctx);
  }
  return () => {
    ctx.status = statusCodes.BAD_REQUEST;
    ctx.body = err;
    ctx.log.warn(err, 'Validation fail');
    return ctx;
  };
};

export default {
  useValidation,
};
