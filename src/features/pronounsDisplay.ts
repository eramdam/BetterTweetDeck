import {table} from 'pronouns';

import {makeBTDModule} from '../types/btdCommonTypes';

const separators = ['|', '/'].map((s) => s).join('');
const wrappers = [
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
];

const subjects = table.map((l) => l[0]).join('|');
const objects = table.map((l) => l[1]).join('|');

const openingWrappers = wrappers.map((l) => '\\' + l[0]).join('|');
const closingWrappers = wrappers.map((l) => '\\' + l[1]).join('|');
const pairRegex = new RegExp(
  `(?:${openingWrappers}|)(?:(${subjects})(?:[\\s]+|)[${separators}]+(?:[\\s]{1,3}|)(${objects}))(?:${closingWrappers}|)`,
  'i'
);

export function extractPronouns(string: string): [string, string] | undefined {
  const match = pairRegex.exec(string.toLocaleLowerCase());
  if (!match) {
    return undefined;
  }
  return [match[1], match[2]];
}

export const displayPronouns = makeBTDModule(({TD}) => {
  TD.services.TwitterUser.prototype.getPronouns = function getPronouns() {
    return extractPronouns(this.description) || extractPronouns(this.location);
  };
});
