import {css} from '@emotion/css';
import {Octokit} from '@octokit/core';
import React, {FC, useEffect, useState} from 'react';
import {PromiseType} from 'utility-types';

import {Trans} from '../../trans';
import {settingsRegularText} from '../settingsStyles';

const octokit = new Octokit();

export const SettingsCredits: FC = () => {
  const [contributors, setContributors] = useState<
    PromiseType<ReturnType<typeof getGithubContributors>>
  >([]);

  useEffect(() => {
    getGithubContributors().then(setContributors);
  }, []);

  return (
    <div className={settingsRegularText}>
      <div>
        <h3>
          <Trans id="settings_author" />
        </h3>
        <p>
          <a href="https://erambert.me">Damien Erambert</a>
        </p>
        <h3>Special thanks</h3>
        <p>
          <ul>
            <li>
              <a href="https://twitter.com/shadowbIood/status/1590462560515473409">@shadowblood</a>{' '}
              for the &quote;nerd checkmark&quote;
            </li>
            <li>
              <a href="https://twitter.com/JoshQuake/status/1590634793393614849">@JoshQuake</a> for
              the &quote;clown checkmark&quote;
            </li>
          </ul>
        </p>
        <h3>
          <Trans id="settings_contributors" />
        </h3>
        <ul
          className={css`
            column-count: 3;
          `}>
          {contributors.map((c) => {
            const commitsLinks = `https://github.com/eramdam/BetterTweetDeck/commits?author=${c.username}`;

            return (
              <li
                key={c.username}
                className={css`
                  small {
                    margin-left: 0.4em;
                  }
                  small a {
                    color: var(--settings-modal-muted-text);
                    font-style: normal;

                    &:hover {
                      color: var(--settings-modal-text);
                    }
                  }
                `}>
                <a href={c.url}>{c.username}</a>
                <small>
                  <a href={commitsLinks}>{c.contributions} commits</a>
                </small>
              </li>
            );
          })}
        </ul>
        <h3>
          <Trans id="settings_links" />
        </h3>
        <ul>
          <li>
            <a href="https://better.tw/chrome">Chrome Web Store</a>
          </li>
          <li>
            <a href="https://better.tw/edge">Microsoft Edge Addons</a>
          </li>
          <li>
            <a href="https://better.tw/firefox">Firefox Add-ons</a>
          </li>
          <li>
            <a href="https://apps.apple.com/us/app/better-tdeck-for-tweetdeck/id1549421502">
              Mac App Store
            </a>
          </li>
          <li>
            <a href="https://github.com/eramdam/BetterTweetDeck/issues">
              <Trans id="settings_bugs_or_suggestions" />
            </a>
          </li>
          <li>
            <a href="https://github.com/eramdam/BetterTweetDeck">
              <Trans id="settings_source_on_github" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

async function getGithubContributors() {
  const response = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
    owner: 'eramdam',
    repo: 'BetterTweetDeck',
  });

  return response.data
    .filter((c) => {
      return c.login !== 'eramdam' && c.type !== 'Bot';
    })
    .map((c) => {
      return {
        contributions: c.contributions,
        username: c.login,
        url: c.html_url,
      };
    })
    .sort((c) => -c.contributions);
}
