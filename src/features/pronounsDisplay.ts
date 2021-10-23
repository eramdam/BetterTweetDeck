import {table} from 'pronouns';

import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
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
    const maybePronouns = extractPronouns(this.description) || extractPronouns(this.location);
    return maybePronouns?.map((l) => l.toLowerCase()).join('/');
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
