import {table} from 'pronouns';

import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

// Trying to match `e` would cause too many false positives.
const cleanedTable = table.filter((l) => l[0] !== 'e');

const pairSeparator = ['/', '|'].join('');

const subjects = cleanedTable.map((l) => l[0]).join('|');
const objects = cleanedTable.map((l) => l[1]).join('|');
const possessive = cleanedTable.map((l) => l[2]).join('|');

const spaceSurroundedSeparator = `(?:[\\s]{1,3}|)[${pairSeparator}]+(?:[\\s]{1,3}|)`;
const firstPartOfPair = `${subjects}`;
const secondPartOfPair = `${possessive}|${objects}|${subjects}`;

const pairRegex = new RegExp(
  `\\b(${firstPartOfPair})${spaceSurroundedSeparator}\\b(${secondPartOfPair})(?:${spaceSurroundedSeparator}\\b(${secondPartOfPair})|)(?:${spaceSurroundedSeparator}\\b(${secondPartOfPair})|)`,
  'gi'
);

const soloSeparators = ['/', '|', ';'].join('');
const soloSubjects = cleanedTable.map((l) => l[0]).join('|');
const soloRegex = new RegExp(
  `(?:[${soloSeparators}]+|)[\\s]{1,3}(${soloSubjects})(?:[${soloSeparators}]+|$)`,
  'i'
);

const maxPronounsToDisplay = 4;
function countPronounsInGroups(pronounGroups: string[][]) {
  return pronounGroups.map((l) => l.length).reduce((a, b) => a + b, 0);
}
export function stringifyPronounResults(pronounGroups: string[][]) {
  let pronounGroupsToShow = pronounGroups;

  while (countPronounsInGroups(pronounGroupsToShow) > maxPronounsToDisplay) {
    pronounGroupsToShow.pop();
  }

  return pronounGroups.map((l) => l.join('/')).join(' ');
}

export function extractPronouns(string: string) {
  const pairMatches = Array.from(string.toLowerCase().matchAll(pairRegex));

  function formatMatches(m: RegExpMatchArray[]) {
    return m.slice(0, 3).map((match) => {
      const [, ...groups] = match;
      return groups.filter(Boolean);
    });
  }

  if (pairMatches.length === 0) {
    const soloMatches = string.toLowerCase().match(soloRegex);
    const soloSubject = soloMatches ? soloMatches[1] : undefined;
    if (!soloSubject) {
      return undefined;
    }
    const matchingPronouns = table.find((l) => l[0] === soloSubject);
    const matchingObject = matchingPronouns ? matchingPronouns[1] : undefined;

    return soloSubject && matchingObject ? [[soloSubject, matchingObject]] : undefined;
  }

  return formatMatches(pairMatches);
}

export const displayPronouns = makeBTDModule(({TD}) => {
  TD.services.TwitterUser.prototype.getPronouns = function getPronouns(): string | undefined {
    const maybePronouns = extractPronouns(this.description) || extractPronouns(this.location);
    if (!maybePronouns) {
      return undefined;
    }

    return stringifyPronounResults(maybePronouns);
  };

  modifyMustacheTemplate(TD, 'status/tweet_single.mustache', (string) => {
    return string
      .replace(
        `{{#getMainTweet}} <div class="nbfc txt-size-variable--12 txt-ellipsis">`,
        `{{#getMainTweet}} <div class="pronouns-wrapper nbfc txt-size-variable--12 txt-ellipsis flex"> {{#getMainUser}} {{#getPronouns}} <span class="btd-profile-label txt-mute pronouns txt-size-variable--12" target="_blank">{{getPronouns}}</span> {{/getPronouns}} {{/getMainUser}}`
      )
      .replace(
        `{{/getMainTweet}} {{/isInThread}}`,
        `{{/getMainTweet}} {{/isInThread}} <div class="pronouns-wrapper nbfc txt-size-variable--12 txt-ellipsis flex"> {{#getMainUser}} {{#getPronouns}} <span class="btd-profile-label txt-mute pronouns txt-size-variable--12" target="_blank">{{getPronouns}}</span> {{/getPronouns}} {{/getMainUser}} </div>`
      );
  });

  modifyMustacheTemplate(TD, 'status/tweet_detail.mustache', (string) => {
    return string
      .replace(
        `<div class="txt-size-variable--12 margin-b--2">`,
        `<div class="pronouns-wrapper txt-size-variable--12 margin-b--2 flex"> {{#getMainUser}} {{#getPronouns}} <span class="btd-profile-label txt-mute pronouns txt-size-variable--12" target="_blank">{{getPronouns}}</span> {{/getPronouns}} {{/getMainUser}}`
      )
      .replace(
        `<div class="thread margin-t--4"></div> {{/indentedChirp}}`,
        `<div class="thread margin-t--4"></div> {{/indentedChirp}} {{#getMainUser}} {{#getPronouns}} <div class="pronouns-wrapper txt-size-variable--12 margin-b--2 flex"> <span class="btd-profile-label txt-mute pronouns txt-size-variable--12" target="_blank">{{getPronouns}}</span></div> {{/getPronouns}} {{/getMainUser}}`
      );
  });
});
