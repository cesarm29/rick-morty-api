/// <reference types="jest" />
import resolvers from '../graphql/resolvers';

// Mock models and redis client
jest.mock('../models', () => ({
  Character: {
    findAll: jest.fn()
  }
}));

jest.mock('../utils/redisClient', () => ({
  client: {
    get: jest.fn(),
    setEx: jest.fn()
  }
}));

const { Character } = require('../models');
const { client } = require('../utils/redisClient');

describe('characters resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns results from cache when available', async () => {
    const mockData = [{ id: 1, name: 'Rick Sanchez' }];
    (client.get as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

    const res = await (resolvers as any).Query.characters(null, { filter: { name: 'Rick' }, limit: 10, offset: 0 });
    expect(res).toEqual(mockData);
    expect(client.get).toHaveBeenCalled();
    expect(Character.findAll).not.toHaveBeenCalled();
  });

  it('queries DB and caches results when cache miss', async () => {
    const mockData = [{ id: 2, name: 'Morty Smith' }];
    (client.get as jest.Mock).mockResolvedValue(null);
    (Character.findAll as jest.Mock).mockResolvedValue(mockData);

    const res = await (resolvers as any).Query.characters(null, { filter: { name: 'Morty' }, limit: 5, offset: 0 });
    expect(res).toEqual(mockData);
    expect(Character.findAll).toHaveBeenCalled();
    expect(client.setEx).toHaveBeenCalled();
  });
});
