import {TweetDeckObject} from '../definitions/tweetdeckTypes';

type MustacheTransformer = (mustacheString: string) => string;

/** Modifies a mustache template in TD.mustaches in place if it exists */
export function modifyMustacheTemplate(
  TweetDeck: TweetDeckObject,
  targetMustache: string,
  transformer: MustacheTransformer
) {
  if (!TweetDeck.mustaches[targetMustache]) {
    return;
  }

  TweetDeck.mustaches[targetMustache] = transformer(TweetDeck.mustaches[targetMustache]);
}

// // const template = `<div class="{{#foo}}{{/foo}}">{{#check}}{{#i18n}}Yes {{myVariable}}{{/i18n}}{{/check}}</div>`;
// const template = `<div class="column-header-links"> {{#withDMComposeButton}} <a
// class="js-action-header-button column-header-link open-compose-dm-link" href="#" data-action="compose-dm"> <i
//   class="js-show-tip icon icon-compose-dm" data-placement="bottom" title="{{_i}}Compose new message{{/i}}"></i>
// </a> {{/withDMComposeButton}} {{#withMarkAllRead}} <a
// class="js-action-header-button column-header-link mark-all-read-link" href="#" data-action="mark-all-read"> <i
//   class="js-show-tip icon icon-mark-read" data-placement="bottom" title="{{_i}}Mark all as read{{/i}}"></i> </a>
// {{/withMarkAllRead}} {{^isTemporary}}

// <a data-testid="optionsToggle" class="js-action-header-button column-header-link column-settings-link" href="#"
// data-action="options"> <i class="icon icon-sliders"></i> </a> {{/isTemporary}} </div>
// </div>`;

// export function stringifyHoganTokens(tokens: readonly Hogan.Token[]): string {
//   return tokens.map((token) => stringifyToken(token)).join('');
// }

// type TokenTransformer = (
//   currentToken: Readonly<Hogan.Token>,
//   previousToken: Readonly<Hogan.Token> | undefined,
//   nextToken: Readonly<Hogan.Token> | undefined
// ) => ReadonlyArray<Hogan.Token> | Readonly<Hogan.Token>;

// interface ModifyTemplateOptions {
//   template: string;
//   transformer: TokenTransformer;
// }

// export function modifyTemplate(opts: ModifyTemplateOptions) {
//   const tokens = Hogan.scan(opts.template).map((t, i, array) => {
//     return opts.transformer(t, array[i - 1], array[i + 1]);
//   });

//   return stringifyHoganTokens(flatten(tokens));
// }

// const modded = modifyTemplate({
//   template,
//   transformer: (token, prevToken) => {
//     if (
//       token.tag === '^' &&
//       token.n === 'isTemporary' &&
//       prevToken &&
//       prevToken.tag === '/' &&
//       prevToken.n === 'withMarkAllRead'
//     ) {
//       return [
//         token,
//         makeStringToken(`<a class="js-action-header-button column-header-link btd-clear-column-link" href="#" data-action="clear">
//         <i class="icon icon-clear-timeline"></i>
//       </a>`),
//       ];
//     }

//     return token;
//   },
// });

// console.log({modded});

// /**
//  * Helpers.
//  */

// function makeStringToken(text: string): Hogan.Token {
//   return {
//     tag: '_t',
//     text,
//   };
// }

// function stringifyToken(token: Hogan.Token) {
//   const {tag} = token;

//   if (tag === '\n') return tag;

//   if (tag === '_t') {
//     return String(token.text);
//   }

//   if (tag === '_v') {
//     return (token.otag || '') + token.n + token.ctag;
//   }

//   const tagSuffix = tag === '>' ? ' ' : '';

//   return token.otag + tag + tagSuffix + token.n + token.ctag;
// }
