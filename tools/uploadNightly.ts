import {MessageAttachment, WebhookClient} from 'discord.js';
import * as glob from 'glob';
import * as path from 'path';

import {getLatestRepoTag} from './latestTag';

const GITHUB_SHA = (process.env.GITHUB_SHA || '').substr(0, 7);
const NIGHTLY_DISCORD_WEBHOOK_ID = process.env.NIGHTLY_DISCORD_WEBHOOK_ID || '';
const NIGHTLY_DISCORD_WEBHOOK_TOKEN = process.env.NIGHTLY_DISCORD_WEBHOOK_TOKEN || '';
const BTD_NIGHTLY_ROLE_ID = process.env.NIGHTLY_DISCORD_ROLE_ID || '';

(async () => {
  const webhookClient = new WebhookClient({
    id: NIGHTLY_DISCORD_WEBHOOK_ID,
    token: NIGHTLY_DISCORD_WEBHOOK_TOKEN,
  });

  const xpiFile = glob.sync('+(web-ext-artifacts|artifacts)/*.xpi')[0];

  if (!xpiFile || !BTD_NIGHTLY_ROLE_ID) {
    process.exit(0);
  }

  const xpiFilename = path.basename(xpiFile);
  const versionString = xpiFilename
    .replace('better_tweetdeck-', '')
    .replace('-an+fx', '')
    .replace('.xpi', '');

  const nightlyBuild = new MessageAttachment(xpiFile, `Better TweetDeck ${versionString}.xpi`);
  const latestTag = await getLatestRepoTag();

  webhookClient.send({
    content: `
    <@&${BTD_NIGHTLY_ROLE_ID}> Built version ${versionString} against [${GITHUB_SHA}](<https://github.com/eramdam/BetterTweetDeck/commit/${GITHUB_SHA}>)
    
    [Changes compared to ${latestTag}](<https://github.com/eramdam/BetterTweetDeck/compare/${latestTag}...main>)
    `.trim(),
    files: [nightlyBuild],
  });
})();
