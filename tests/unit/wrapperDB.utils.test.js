jest.mock('mongodb');
const mongoMocks = require('../mocks/mongoMock');
const { mockConfigSimple } = require('../mocks/configMock');
const wrapper = require('../../app/utils/wrapperDB');

describe('Test Cases: wrapperDB', () => {
  it('Test Find One', async () => {
    const client = wrapper.connect(mockConfigSimple);
    client.db = mongoMocks.mockFindOne;
    const data = await wrapper.findOne('test', {});
    expect(data).not.toEqual(undefined);
  });
  it('Test Find', async () => {
    const client = wrapper.connect(mockConfigSimple);
    client.db = mongoMocks.mockFind;
    const data = await wrapper.find('test', {});
    expect(data).not.toEqual(undefined);
  });
  it('Test Create', async () => {
    const client = wrapper.connect(mockConfigSimple);
    client.db = mongoMocks.mockInsertOne;
    const data = await wrapper.create({ test: 'test' });
    expect(data).not.toEqual(undefined);
  });
});
