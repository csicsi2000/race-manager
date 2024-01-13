import { uniqueNamesGenerator, adjectives, colors, animals, type Config  } from 'unique-names-generator';

const customConfig: Config= {
  dictionaries: [colors, animals],
  separator: " ",
  style: 'capital'
}; // Red_Big_Donkey


export function getUniqueName() { return uniqueNamesGenerator(customConfig);}