const { statusCodes } = require('../../app/constants/httpStatus');
const statusService = require('../../app/services/statusService');

describe('Test Cases: StatusService', () => {
  it('Test Status Healthy Fail', () => {
    const ctx = {};
    const res = statusService.healthy(ctx);
    expect(res.status).toEqual(statusCodes.SERVICE_UNAVAILABLE);
  });
  it('Test Status Healthy Success', () => {
    const ctx = {
      log: {},
      db: {},
    };
    const res = statusService.healthy(ctx);
    expect(res.status).toEqual(statusCodes.OK);
  });

  it('Test Status Alive Fail', () => {
    const ctx = {
      log: {},
      db: {
        isConnected: () => false,
      },
    };
    const res = statusService.alive(ctx);
    expect(res.status).toEqual(statusCodes.SERVICE_UNAVAILABLE);
  });

  it('Test Status Alive Success', () => {
    const ctx = {
      log: {},
      db: {
        isConnected: () => true,
      },
    };
    const res = statusService.alive(ctx);
    expect(res.status).toEqual(statusCodes.OK);
  });
});
