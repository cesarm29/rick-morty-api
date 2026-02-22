import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface CharacterAttributes {
  id: number;
  name: string;
  status: string | null;
  species: string | null;
  type: string | null;
  gender: string | null;
  origin: string | null;
  image: string | null;
  url: string | null;
}

type CharacterCreationAttributes = Optional<CharacterAttributes, 'id'>;

class Character extends Model<CharacterAttributes, CharacterCreationAttributes> implements CharacterAttributes {
  public id!: number;
  public name!: string;
  public status!: string | null;
  public species!: string | null;
  public type!: string | null;
  public gender!: string | null;
  public origin!: string | null;
  public image!: string | null;
  public url!: string | null;
}

export default function (sequelize: Sequelize) {
  Character.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING },
      status: { type: DataTypes.STRING },
      species: { type: DataTypes.STRING },
      type: { type: DataTypes.STRING },
      gender: { type: DataTypes.STRING },
      origin: { type: DataTypes.STRING },
      image: { type: DataTypes.STRING },
      url: { type: DataTypes.STRING }
    },
    { sequelize, tableName: 'Characters', timestamps: false }
  );

  return Character;
}
