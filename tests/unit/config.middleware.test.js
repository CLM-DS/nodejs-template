jest.mock('koa');
const configMiddleware = require('../../app/server/middlewares/configMiddleware');

describe('Test Cases: ConfigMiddleware', () => {
  it('Test Call Config', async () => {
    const ctx = {};
    const next = () => 1;
    await configMiddleware()(ctx, next);
    expect(ctx.config).not.toEqual(undefined);
  });
});
