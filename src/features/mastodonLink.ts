import mastodon from '../assets/mastodon-icon.svg';
import {onChirpAdded} from '../services/chirpHandler';
import {makeBTDModule, makeBtdUuidSelector} from '../types/btdCommonTypes';

export const mastodonLink = makeBTDModule(({TD, settings}) => {
  onChirpAdded((payload) => {
    const chirpNode = document.querySelector(makeBtdUuidSelector('data-btd-uuid', payload.uuid));

    if (!chirpNode) {
      return;
    }

    if (!settings.mastodonLink) {
      return;
    }

    const searchTargets = [
      payload.chirp.user?.name,
      payload.chirp.user?.location,
      payload.chirp.user?.description,
      payload.chirp.user.entities.url?.urls[0]['display_url'],
    ];

    const match = searchTargets
      .map(
        (text) =>
          /@?\b(?<username>[A-Z0-9._%+-]+)@(?<domain>[A-Z0-9.-]+\.[A-Z]{2,})\b/i.exec(text) ||
          /\b(?<domain>[A-Z0-9.-]+\.[A-Z]{2,})\/@(?<username>[A-Z0-9._%+-]+)\b/i.exec(text)
      )
      .find((_) => _);
    if (!match || !match.groups) {
      return;
    }
    const {username, domain} = match.groups;
    const mastodonURL = `https://${domain}/@${username}`;

    const mastodonLink = document.createElement('a');
    mastodonLink.href = mastodonURL;
    mastodonLink.target = '_blank';
    mastodonLink.rel = 'url';

    const mastodonIcon = document.createElement('img');
    mastodonIcon.src = mastodon;
    mastodonIcon.style.marginInlineStart = '4px';

    mastodonLink.appendChild(mastodonIcon);
    chirpNode.querySelector('.account-link')?.after(mastodonLink);
  });
});
