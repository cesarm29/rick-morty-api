import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Character {
    id: Int!
    name: String!
    status: String
    species: String
    type: String
    gender: String
    origin: String
    image: String
    url: String
  }

  input CharacterFilter {
    status: String
    species: String
    gender: String
    name: String
    origin: String
  }

  type Query {
    characters(filter: CharacterFilter, limit: Int = 50, offset: Int = 0): [Character]
    character(id: Int!): Character
  }
`;
