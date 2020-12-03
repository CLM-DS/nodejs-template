const mockInsertOne = jest.fn(() => ({
  collection: jest.fn(() => ({
    insertOne: jest.fn(() => ({
    })),
  })),
}));

const mockFind = jest.fn(() => ({
  collection: jest.fn(() => ({
    find: jest.fn(() => ({
      toArray: jest.fn(() => []),
    })),
  })),
}));

const mockFindOne = jest.fn(() => ({
  collection: jest.fn(() => ({
    findOne: jest.fn(() => ({ test: 1 })),
  })),
}));

module.exports = {
  mockInsertOne,
  mockFind,
  mockFindOne,
};
