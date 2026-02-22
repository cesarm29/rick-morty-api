import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { sequelize, Character } from '../models';

dotenv.config();

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    const res = await fetch('https://rickandmortyapi.com/api/character/?page=1');
    console.log('Fetch response status:', res.status);
    const data = await res.json();
    if (!data || !data.results) {
      console.error('Unexpected API response:', data);
      process.exit(1);
    }

    const results = data.results.slice(0, 15);
    console.log(`Fetched ${data.results.length} characters, seeding ${results.length}`);

    for (const c of results) {
      try {
        await Character.upsert({
          id: c.id,
          name: c.name,
          status: c.status,
          species: c.species,
          type: c.type,
          gender: c.gender,
          origin: c.origin?.name || null,
          image: c.image,
          url: c.url
        });
        console.log(`Upserted character id=${c.id} name=${c.name}`);
      } catch (err) {
        console.error(`Failed to upsert character id=${c.id}`, err);
      }
    }

    console.log('Seeded characters');
    process.exit(0);
  } catch (err) {
    console.error('Seeder error', err);
    process.exit(1);
  }
}

seed().catch(err => { console.error(err); process.exit(1); });
