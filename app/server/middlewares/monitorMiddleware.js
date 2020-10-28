/**
 * @typedef {'response' | 'request'} TypeLog
 */

/**
 * @typedef {Object} LogDataBase
 * @property {TypeLog} type
 * @property {string} timestamp
 */

/**
* @typedef {LogDataBase & T} LogData
* @template T
*/

/**
 * Build object to log
 * @param {T} data
 * @param {TypeLog} type
 * @template T
 * @returns {LogData}
 */
const buildLog = (data, type) => ({
  ...data,
  type,
  timestamp: new Date().toString(),
});

/**
 * @typedef {Object} ResponseLog
 * @property {*} body
 * @property {*} headers
 * @property {number} status
 */

/**
 * Build object to log response
 * @param {import('koa')} param0
 * @returns {LogData<ResponseLog>}
 */
const buildResponseLog = ({ response }) => buildLog({
  body: response.body,
  headers: response.headers,
  status: response.status,
}, 'response');

/**
 * @typedef {Object} RequestLog
 * @property {*} body
 * @property {*} headers
 * @property {string} method
 */

/**
 * Build object to log request
 * @param {import('koa')} param0
 * @returns {LogData<RequestLog>}
 */
const buildRequestLog = ({ request }) => buildLog({
  body: request.body,
  headers: request.headers,
  url: request.url,
  method: request.method,
}, 'request');

/**
 * Send to log request data and responsedata
 * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
 */
const monitorMiddleware = () => async (ctx, next) => {
  ctx.log.info(buildRequestLog(ctx));
  await next();
  ctx.log.info(buildResponseLog(ctx));
  return ctx;
};

module.exports = monitorMiddleware;
