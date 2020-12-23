const { statusCodes } = require('../constants/httpStatus');

/**
 * @typedef {Object} SchemeValidation
 * @property {string} property
 * @property {import('joi').ObjectSchema} scheme
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
 * @param {SchemeValidation[]} schemas
 * @param {Context} ctx
 */
const evaluateSchemes = (schemas, ctx) => {
  const err = schemas.reduce((acc, item) => {
    if (acc) {
      return acc;
    }
    const { property, scheme } = item;
    const data = getProperty(property, ctx);
    if (!data) {
      return {
        message: 'Data not found',
      };
    }
    const { error } = scheme.validate(data);
    if (error) {
      return error;
    }
    return undefined;
  }, undefined);
  return err;
};

/**
 * @callback TransformCallback
 * @param {*} error
 * @returns {*}
 */

/**
 * @typedef {Object} ValidationOption
 * @property {TransformCallback} transform option to transform error
 */

/**
 *
 * @param {[SchemeValidation]} schemas
 * @param {*} handler
 * @param {ValidationOption} options
 * @returns {(ctx: Context) => Context}
 */
const useValidation = (schemas, handler, options = {}) => (ctx) => {
  let err = evaluateSchemes(schemas, ctx);
  if (!err) {
    return handler(ctx);
  }
  const { transform } = options || {};
  if (transform) {
    err = transform(err);
  }
  ctx.status = statusCodes.BAD_REQUEST;
  ctx.body = err;
  ctx.log.warn(err, 'Validation fail');
  return ctx;
};

module.exports = {
  useValidation,
};
