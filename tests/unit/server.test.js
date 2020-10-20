jest.mock('koa');
const { startServer } = require('../../app/server');

describe('Test Case Server', () => {
  it('Server Start', () => {
    const app = startServer({
      prefix: '/test',
    });
    expect(app).not.toEqual(undefined);
  });
});
