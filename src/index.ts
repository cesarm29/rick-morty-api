import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import { sequelize, Character } from './models';
import { Op } from 'sequelize';
import { connect as connectRedis } from './utils/redisClient';
import requestLogger from './middleware/logger';
import { typeDefs } from './graphql/schema';
import resolvers from './graphql/resolvers';
import { scheduleUpdates } from './cron/updateCharacters';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

dotenv.config();

const app = express();
app.use(express.json());
app.use(requestLogger);

async function start() {
  await sequelize.authenticate();
  await connectRedis();

  const server = new ApolloServer({ typeDefs, resolvers } as any);
  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  // Swagger UI for API documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // simple health route
  app.get('/health', (_req, res) => res.status(200).send('OK'));

  // REST-style endpoints that read directly from the DB (bypass cache)
  app.get('/characters', async (req, res) => {
    try {
      const { limit = '50', offset = '0' } = req.query as any;
      const parsedLimit = parseInt(limit, 10) || 50;
      const parsedOffset = parseInt(offset, 10) || 0;

      const q: any = req.query || {};
      const where: any = {};
      if (q.status) where.status = q.status;
      if (q.species) where.species = q.species;
      if (q.gender) where.gender = q.gender;
      if (q.name) where.name = { [Op.iLike]: `%${q.name}%` };
      if (q.origin) where.origin = { [Op.iLike]: `%${q.origin}%` };

      const results = await Character.findAll({ where, limit: parsedLimit, offset: parsedOffset });
      res.json(results);
    } catch (err: any) {
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  app.get('/character/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'id must be an integer' });
      const data = await Character.findByPk(id);
      if (!data) return res.status(404).send('Not found');
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}${server.graphqlPath}`);
  });

  console.log('Using DATABASE_URL:', process.env.DATABASE_URL || '(default from config)');

  // Debug routes to inspect DB contents
  app.get('/debug/count', async (_req, res) => {
    try {
      const cnt = await Character.count();
      res.json({ count: cnt });
    } catch (err: any) {
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  app.get('/debug/list', async (_req, res) => {
    try {
      const rows = await Character.findAll({ limit: 50 });
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  // Flush cache (Redis + in-memory fallback)
  app.post('/debug/flush-cache', async (_req, res) => {
    try {
      // import flushAll lazily to avoid circular imports at module load time
      const { flushAll } = await import('./utils/redisClient');
      await flushAll();
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  // optional cron
  scheduleUpdates();
}

start().catch(err => { console.error(err); process.exit(1); });
