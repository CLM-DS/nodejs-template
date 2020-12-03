jest.mock('koa');
jest.mock('dotenv');
const { startServer } = require('../../app/server');

describe('Test Case Server', () => {
  it('Server Start init', () => {
    // eslint-disable-next-line global-require
    const config = require('../../app/config');
    const app = startServer(config);
    expect(app).not.toEqual(undefined);
  });
});
