import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { connect, flushAll, client } from '../src/utils/redisClient';

dotenv.config();

async function main() {
  try {
    // Intenta conectar a Redis y limpiar
    await connect();
    console.log('Redis available:', client.isOpen());
    await flushAll();
    console.log('Cache flushed (Redis and in-memory).');

    // Llamada GraphQL al servidor local
    const resp = await fetch(process.env.GRAPHQL_URL || 'http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'query { characters { id name } }' })
    });
    const json = await resp.json();
    if (!json || !json.data || !json.data.characters) {
      console.error('GraphQL response unexpected:', JSON.stringify(json));
      process.exit(1);
    }
    console.log('GraphQL characters count:', json.data.characters.length);
    // opcional: listar ids
    console.log('First 5 ids:', json.data.characters.slice(0,5).map((c:any)=>c.id));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
