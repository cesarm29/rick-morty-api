import fs from 'fs';
import path from 'path';
// Viz.js requires CommonJS imports for full.render.js helper
const Viz = require('viz.js');
const { Module, render } = require('viz.js/full.render.js');

const viz = new Viz({ Module, render });

const dot = `digraph erd {
  graph [rankdir=LR];
  node [shape=plaintext];

  Characters [label=<
    <table border="0" cellborder="1" cellspacing="0">
      <tr><td bgcolor="#e8e8f8" colspan="2"><b>Characters</b></td></tr>
      <tr><td align="left">id &nbsp; PK</td><td>INTEGER</td></tr>
      <tr><td align="left">name</td><td>STRING</td></tr>
      <tr><td align="left">status</td><td>STRING</td></tr>
      <tr><td align="left">species</td><td>STRING</td></tr>
      <tr><td align="left">type</td><td>STRING</td></tr>
      <tr><td align="left">gender</td><td>STRING</td></tr>
      <tr><td align="left">origin</td><td>STRING</td></tr>
      <tr><td align="left">image</td><td>STRING</td></tr>
      <tr><td align="left">url</td><td>STRING</td></tr>
    </table>
  >];

}
`;

async function generate() {
  try {
    const svg = await viz.renderString(dot);
    const outPath = path.resolve(process.cwd(), 'erd.svg');
    fs.writeFileSync(outPath, svg, 'utf8');
    console.log('Wrote ERD to', outPath);
  } catch (err) {
    console.error('Error generating ERD:', err);
    process.exit(1);
  }
}

generate();
