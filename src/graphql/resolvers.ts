import { IResolvers } from '@graphql-tools/utils';
import { Character } from '../models';
import { client } from '../utils/redisClient';
import { timeIt } from '../decorators/timing';
import { Op } from 'sequelize';

const buildWhere = (filter: any) => {
  const where: any = {};
  if (!filter) return where;
  if (filter.status) where.status = filter.status;
  if (filter.species) where.species = filter.species;
  if (filter.gender) where.gender = filter.gender;
  if (filter.name) where.name = { [Op.iLike]: `%${filter.name}%` };
  if (filter.origin) where.origin = { [Op.iLike]: `%${filter.origin}%` };
  return where;
};

class ResolversClass {
  @timeIt
  public async characters(_: any, args: any) {
    const key = `characters:${JSON.stringify(args.filter || {})}:limit=${args.limit}:offset=${args.offset}`;
    const cached = await client.get(key);
    if (cached) return JSON.parse(cached);

    const where = buildWhere(args.filter);
    const results = await Character.findAll({ where, limit: args.limit, offset: args.offset });
    await client.setEx(key, 3600, JSON.stringify(results));
    return results;
  }

  @timeIt
  public async character(_: any, args: any) {
    const key = `character:${args.id}`;
    const cached = await client.get(key);
    if (cached) return JSON.parse(cached);
    const result = await Character.findByPk(args.id);
    if (result) await client.setEx(key, 3600, JSON.stringify(result));
    return result;
  }
}

const instance = new ResolversClass();

const resolvers: IResolvers = {
  Query: {
    characters: instance.characters.bind(instance),
    character: instance.character.bind(instance)
  }
};

export default resolvers;
