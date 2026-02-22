import cron from 'node-cron';
import fetch from 'node-fetch';
import { Character } from '../models';

export function scheduleUpdates() {
  // every 12 hours at minute 0
  cron.schedule('0 */12 * * *', async () => {
    console.log('Cron: updating characters from API');
    try {
      const res = await fetch('https://rickandmortyapi.com/api/character/?page=1');
      const data = await res.json();
      const results = data.results.slice(0, 15);
      for (const c of results) {
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
      }
      console.log('Cron: characters updated');
    } catch (err) {
      console.error('Cron update failed', err);
    }
  });
}
