import createEmotion from '@emotion/css/create-instance';
import {darken, lighten, transparentize} from 'polished';

import {makeBTDModule} from '../types/btdCommonTypes';

export const applyCustomAccentColor = makeBTDModule(() => {
  const container = document.head;
  const {css} = createEmotion({
    key: 'btd',
    container,
  });

  const baseColor = `#FF00FF`;
  const colors = {
    base: baseColor,
    alpha100: transparentize(0.9, baseColor),
    dark100: darken(0.05, baseColor),
    dark200: darken(0.1, baseColor),
    dark300: darken(0.15, baseColor),
    dark400: darken(0.2, baseColor),

    light100: lighten(0.05, baseColor),
    light200: lighten(0.1, baseColor),
    light300: lighten(0.15, baseColor),
    light400: lighten(0.2, baseColor),
    light500: lighten(0.3, baseColor),
    light600: lighten(0.4, baseColor),
    light700: lighten(0.45, baseColor),
    light800: lighten(0.5, baseColor),
    light900: lighten(0.55, baseColor),
    light1000: lighten(0.6, baseColor),
    light1100: lighten(0.65, baseColor),
  };

  Object.entries(colors).forEach(([key, color]) => {
    document.documentElement.style.setProperty(`--btd-color-${key}`, color);
  });

  document.body.classList.add(css`
    /* Compose button */
    header[role=banner] .css-18t94o4.css-1dbjc4n.r-42olwf.r-sdzlij.r-1phboty.r-rs99b7.r-1ny4l3l.r-o7ynqc.r-6416eg.r-lrvibr.r-13qz1uu[aria-label][role='button'],
    header[role=banner] .css-1dbjc4n.r-42olwf.r-sdzlij.r-1phboty.r-rs99b7.r-icoktb.r-1ny4l3l.r-o7ynqc.r-6416eg.r-lrvibr.r-13qz1uu[aria-label][role='button'],

    /* Play button for videos */
    [aria-label][data-testid='playButton'],
    /* See new tweets / scroll to top button */
    section > div > div > div[role=status] div[role=button][aria-label],
    /* Retry button in column */
    .css-18t94o4.css-1dbjc4n.r-42olwf.r-sdzlij.r-1phboty.r-rs99b7.r-1vsu8ta.r-18qmn74.r-1ny4l3l.r-1orpq53.r-o7ynqc.r-6416eg.r-lrvibr[role="button"],
    
    /* Play button on card */
    div[id^="id_"][data-testid="card.wrapper"] [aria-label]:not([aria-label=""]),
    
    /* Tweet button in composer */
    header[role='banner'] > div > div.css-1dbjc4n [style] [data-testid='tweetButtonInline'],
    /* Tweet button under tweet detail */
    [data-skyla-entity-type="tweet"] [data-testid='tweetButtonInline'] {
      background-color: var(--btd-color-base) !important;

      &:hover {
        background-color: var(--btd-color-dark100) !important;
      }
    }

    /* Emoji picker categories */
    #layers
      [role='dialog']
      > div
      > div
      > div
      > div
      > div.css-1dbjc4n.r-14lw9ot.r-1867qdf.r-cqilzk.r-1udh08x.r-1c85bru
      > div
      > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-19qrga8.r-t60dpp
      > div
      > div {
      &:hover > div:first-child {
        background-color: var(--btd-color-alpha100) !important;
      }

      & > div:not(.r-6bppsq) + div {
        background-color: var(--btd-color-base) !important;
      }
    }

    /* Emoji picker skin tone selector */
    #layers
      [role='dialog']
      #emoji_picker_categories_dom_id
      + div
      [aria-checked='true'][role='button']
      > div {
      box-shadow: var(--btd-color-base) 0px 0px 0px 2px;
    }

    /* Tab underline */
    [role='tab'][aria-selected] {
      .css-1dbjc4n.r-1kihuf0.r-sdzlij.r-1p0dtai.r-xoduu5.r-hdaws3.r-s8bhmr.r-u8s1d.r-13qz1uu {
        background-color: var(--btd-color-base) !important;
      }
    }

    [aria-describedby='conversation-controls-details']
      [tabindex][role='menuitem']
      > div:first-child {
      background-color: var(--btd-color-base) !important;
    }

    [aria-labelledby][role='radiogroup']
      > label
      .css-1dbjc4n.r-1awozwy.r-vhj8yc.r-qxtw8h.r-1phboty.r-d045u9.r-1tl9yi8.r-1777fci.r-ig0lrl:not(:empty) {
      background-color: var(--btd-color-base) !important;
      border-color: var(--btd-color-base) !important;
    }

    /* Loader */
    .css-1dbjc4n.r-17bb2tj.r-1muvv40.r-127358a.r-1ldzwu0 > svg {
      & > circle {
        stroke: var(--btd-color-base) !important;
      }
    }

    /* Composer buttons */
    header[role='banner'] > div > div.css-1dbjc4n [style] div[aria-label][role='button'],
    header[role='banner']
      > div
      > div.css-1dbjc4n
      [style]
      div[tabindex='0'][role='button']:not([aria-label]),
      /* Remove button in search suggestions */
    form[role=search] [role=listbox] [data-testid="typeaheadRecentSearchesItem"] [data-testid="UserCell"] div[aria-label][role=button] {
      & .r-jwli3a {
        color: white !important;
      }
      &:hover {
        background-color: var(--btd-color-alpha100) !important;
      }
      & > div {
        color: var(--btd-color-light300) !important;

        svg {
          color: currentColor !important;
        }
      }
    }

    /* DM composer buttons */
    section div[data-viewportview] + aside[aria-label][role='complementary'] div[aria-label],
    [data-testid='DMDrawer']
      div[data-viewportview]
      + aside[aria-label][role='complementary']
      div[aria-label] {
      &:hover {
        background-color: var(--btd-color-alpha100) !important;
      }
      & > div[dir='auto'],
      svg {
        color: var(--btd-color-base) !important;
      }
    }

    /* "You can reply.." icon */
    article[aria-labelledby^='id_'] [role='button'] > div > div > div:first-child > div {
      background-color: var(--btd-color-base) !important;
    }

    /* Conversation control box in tweet detail */
    article[aria-labelledby^='id_']
      > div
      > div
      > div
      > div:last-child
      > div:last-child
      > div.css-1dbjc4n.r-1xfd6ze.r-6koalj.r-18u37iz.r-1orpq53.r-1w50u8q.r-13qz1uu {
      background-color: var(--btd-color-light700) !important;

      & > div > div:first-child {
        background-color: var(--btd-color-base) !important;
      }
    }

    /* Links inside tweets */
    article a[dir][role='link'][target='_blank'][rel][href^='http'],
  
    /* Mentions in tweets */
    article [dir][id^="id_"] > div a[role='link'][href^='http'],
    article div[dir][id^="id_"]:not([data-testid]) > span > .css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0,
    article div[dir][id^="id_"]:not([data-testid]) > a[aria-label][role=link],

    /* User link */
    a[dir][data-testid="UserUrl"][target='_blank'][rel][href^='http'],
    /* Links in description */
    [data-testid="UserDescription"] a[target='_blank'][rel][href^='http'],
    
    /* "Show this thread" */
    article > div > a:last-child[role='link'][href^='http'] > div > div div[dir],
    /* "Show this thread" in QT */
    article[aria-labelledby^="id_"] [aria-labelledby^="id_"][id^="id_"] [id^="id_"] > div:last-child [lang]+div {
      color: var(--btd-color-base) !important;
    }

    /* Search input */
    form[role='search'][aria-label] > div > div:first-child > div:first-child:focus-within,
    /* Emoji search input */
    #layers [role='dialog'] div[role='combobox'] > div:focus-within,
    /* Gif search input */
    #layers [role=dialog] [aria-modal=true][aria-labelledby="modal-header"][role=dialog] > div > div > div > div > div > div > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-sdzlij.r-1phboty.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-1pi2tsx.r-1777fci.r-1ii58gl:focus-within,
    /* DM text input */
    section div[data-viewportview]+ aside .css-1dbjc4n.r-y47klf.r-1phboty.r-d045u9.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-1777fci.r-1ii58gl.r-13qz1uu,
    [data-testid='DMDrawer'] div[data-viewportview]+ aside .css-1dbjc4n.r-y47klf.r-1phboty.r-d045u9.r-eqz5dr.r-16y2uox.r-1wbh5a2.r-1777fci.r-1ii58gl.r-13qz1uu {
      border-color: var(--btd-color-base) !important;
      caret-color: var(--btd-color-base) !important;
    }

    /* Poll choices */
    [data-testid='attachments'] label.css-1dbjc4n.r-z2wwpe.r-rs99b7.r-18u37iz:focus-within {
      box-shadow: var(--btd-color-base) 0 0 0 1px !important;
      border-color: var(--btd-color-base) !important;

      div > div:first-child > div[dir='auto'] {
        color: var(--btd-color-base) !important;
      }
    }

    /* DMs cards */
    [data-testid='messageEntry'] [dir] + [role='link'] {
      border-color: var(--btd-color-base) !important;
    }

    /* DM link inside card */
    [data-testid='messageEntry'] [dir] + [role='link'] [lang] + [dir] {
      color: var(--btd-color-base) !important;
    }

    /* DM seen indicator */
    [data-testid='messageEntry'] + div div[role='button'] > div > div[dir] {
      color: var(--btd-color-base) !important;
    }

    /* DM sent message bubble */
    [data-testid='messageEntry'] div[role='presentation'].r-zmljjp {
      background-color: var(--btd-color-base) !important;
    }
  `);
});
