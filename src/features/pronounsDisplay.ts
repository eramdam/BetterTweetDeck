import {orderBy, uniq} from 'lodash';

import * as pronouns from '../assets/pronouns.json';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {UrlEntity} from '../types/tweetdeckTypes';

const {table} = pronouns;

// Trying to match `e` would cause too many false positives.
const cleanedTable = table.filter((l) => l[0] !== 'e');

const pairSeparatorsPart = ['/', '|'].join('');
// she, he, they, it...
const subjects = cleanedTable.map((l) => l[0]).concat('any');
// her, him, them, it...
const objects = cleanedTable.map((l) => l[1]).concat('all');
// her, his, their, its...
const possessive = cleanedTable.map((l) => l[2]);

// Build parts of our regexes
const subjectsRegexPart = subjects.join('|');
const objectsRegexPart = objects.join('|');
const possessiveRegexPart = possessive.join('|');

// Matches ` / `, ` | ` and so on
const spaceSurroundedSeparator = `(?:[\\s]{1,3}|)[${pairSeparatorsPart}]+(?:[\\s]{1,3}|)`;
// Matches subjects only
const firstPartOfPair = `${subjectsRegexPart}`;
// Matches possesives, objects and subjects
const secondPartOfPair = `${possessiveRegexPart}|${objectsRegexPart}|${subjectsRegexPart}`;

// Matches `she/her`, etc
const pairRegex = new RegExp(
  `\\b(${firstPartOfPair})${spaceSurroundedSeparator}\\b(${secondPartOfPair})\\b(?:${spaceSurroundedSeparator}\\b(${secondPartOfPair})\\b|)(?:${spaceSurroundedSeparator}\\b(${secondPartOfPair})\\b|)`,
  'gi'
);
// Matches `her/she`, etc
const invertedPairRegex = new RegExp(
  `\\b(${secondPartOfPair})${spaceSurroundedSeparator}\\b(${firstPartOfPair})\\b(?:${spaceSurroundedSeparator}\\b(${firstPartOfPair})\\b|)(?:${spaceSurroundedSeparator}\\b(${firstPartOfPair})\\b|)`,
  'gi'
);

const openingWrapper = ['(', '[', '{'].map((w) => `\\${w}`).join('');
const closingWrapper = [')', ']', '}'].map((w) => `\\${w}`).join('');
const soloSeparators = ['/', '|', ';', ','].join('');

// Some neopronouns by themselves are too "risky" to match as solo pronouns so I'm playing it safe
const soloSubjectsAllowlist = ['he', 'she', 'they'];
const soloSubjects = cleanedTable
  .filter((l) => soloSubjectsAllowlist.includes(l[0]))
  .map((l) => l[0])
  .join('|');
const soloRegex = new RegExp(
  `(?:\\W\\s|[${openingWrapper}]|,\\s|^|[^\\p{L}\\p{M}_\\s.${soloSeparators}])(${soloSubjects})(?:\\s[${soloSeparators}]|[${closingWrapper}]|,\\s|$|\\s?[^\\p{L}\\p{M}_\\s.'"])`,
  'ui'
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

function parseRegularPair(string: string) {
  return Array.from(string.toLowerCase().matchAll(pairRegex));
}

function parseInvertedPair(string: string) {
  return Array.from(string.toLowerCase().matchAll(invertedPairRegex));
}

// Formats a regex match into a tuple of pronouns
function formatMatches(m: RegExpMatchArray[]): string[][] {
  return m.slice(0, 3).map((match) => {
    const [, ...groups] = match;

    return orderBy(
      groups.filter(Boolean),
      [
        // We want to put subject pronouns first so `her/she` becomes `she/her`
        (p) => {
          return subjects.includes(p);
        },
      ],
      'desc'
    );
  });
}

export function extractPronouns(string: string) {
  if (
    string.toLowerCase().includes('pronouns: any') ||
    string.toLowerCase().includes('any pronouns')
  ) {
    return [['any pronouns']];
  }

  // Make sure to reset the regexes
  pairRegex.lastIndex = 0;
  invertedPairRegex.lastIndex = 0;
  soloRegex.lastIndex = 0;

  // Try to match `she/her`
  const regularPairMatches = parseRegularPair(string);
  // Try to match `her/she`
  const invertedPairMatches = parseInvertedPair(string);

  const pairMatches = regularPairMatches.length > 0 ? regularPairMatches : invertedPairMatches;
  const filteredMatches = pairMatches.filter((singleMatch) => {
    return uniq(singleMatch[0].split('').filter((c) => ['/', '|'].includes(c))).length === 1;
  });

  // If we filtered because of multi
  if (pairMatches.length > 0 && filteredMatches.length !== pairMatches.length) {
    return undefined;
  }

  // If we don't match a pair, try to match a pronoun by itself
  if (pairMatches.length === 0 && filteredMatches.length === pairMatches.length) {
    const soloMatches = string.match(soloRegex);

    const soloSubject = soloMatches ? soloMatches[1] : undefined;
    if (!soloSubject || !soloMatches) {
      return undefined;
    }

    // Try to find the corresponding line in the pronouns table
    const matchingPronouns = table.find((l) => l[0] === soloSubject);
    // Find the corresponding object pronoun
    const matchingObject = matchingPronouns ? matchingPronouns[1] : undefined;

    // Return a tuple of pronoun if we match something
    return soloSubject && matchingObject ? [[soloSubject, matchingObject]] : undefined;
  }

  // Properly format our matches
  return formatMatches(pairMatches);
}

// Removes urls from bio to prevent false positives with .tld and such
function removeUrlsFromBio(bio: string, entities: UrlEntity): string {
  let newBio = bio;
  const urlsInBio = entities.urls.map((u) => u.url);

  urlsInBio.forEach((url) => {
    newBio = newBio.replace(url, '');
  });

  return newBio;
}

export const displayPronouns = makeBTDModule(({TD, settings}) => {
  if (!settings.extractAndShowPronouns) {
    return;
  }

  TD.services.TwitterUser.prototype.getPronouns = function getPronouns(): string | undefined {
    const cleanBio = removeUrlsFromBio(this.description, this.entities.description);
    const maybePronouns =
      extractPronouns(cleanBio) || extractPronouns(this.location) || extractPronouns(this.name);

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
