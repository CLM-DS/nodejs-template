const xss = require('xss');
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
  return properties.reduce(
    (acc, prop) => (acc ? acc[prop] : ctx[prop]),
    undefined,
  );
};

/**
 * Evaluate Schemas
 * @param {SchemeValidation[]} schemas
 * @param {Context} ctx
 * @param {boolean} abort
 */
const evaluateSchemes = (schemas, ctx, abort = true) => {
  const err = schemas.reduce((acc, item) => {
    if (acc && abort) {
      return acc;
    }
    const { property, scheme } = item;
    const data = getProperty(property, ctx);
    if (!data) {
      const e = {
        property,
        message: 'Data not found',
      };
      return abort ? e : { ...(acc || {}), [property]: e };
    }
    const { error } = scheme.validate(data);
    if (error) {
      return abort ? error : { ...(acc || {}), [property]: error };
    }
    return acc;
  }, undefined);
  return err;
};

/**
 * @callback TransformCallback
 * @param {*} error
 * @param {ContextStd} ctx
 * @returns {*}
 */

/**
 * @typedef {Object} ValidationOption
 * @property {TransformCallback} transform option to transform error
 * @property {boolean} abort stop in first error check
 */

/**
 *
 * @param {[SchemeValidation]} schemas
 * @param {*} handler
 * @param {ValidationOption} options
 * @returns {(ctx: Context) => Context}
 */
const useValidation = (schemas, handler, options = {}) => (ctx) => {
  const { abort = true } = options;
  let err = evaluateSchemes(schemas, ctx, abort);
  if (!err) {
    return handler(ctx);
  }
  const { transform } = options || {};
  if (transform) {
    err = transform(err, ctx);
  }
  ctx.status = statusCodes.BAD_REQUEST;
  ctx.body = JSON.parse(xss(JSON.stringify(err)));
  ctx.log.warn(err, 'Validation fail');
  return ctx;
};

module.exports = {
  useValidation,
};
