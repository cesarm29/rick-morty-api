import { Sequelize } from 'sequelize';
import CharacterModel from './character';

let configData: any;
try {
	// Prefer the root sequelize config used by migrations (config/config.js)
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	configData = require('../../config/config.js');
} catch (err) {
	// Fallback to the TS config in src/config
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	configData = require('../config/config').default;
}

const env = process.env.NODE_ENV || 'development';
const cfg: any = configData[env];

const sequelize = new Sequelize(cfg.url, { dialect: cfg.dialect });

const Character = CharacterModel(sequelize);

export { sequelize, Character };
