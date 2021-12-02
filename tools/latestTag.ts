import {Octokit} from '@octokit/core';

const octokit = new Octokit();

export async function getLatestRepoTag() {
  const tags = await octokit.request('GET /repos/{owner}/{repo}/tags', {
    owner: 'eramdam',
    repo: 'BetterTweetDeck',
  });
  const newestTag = tags.data.shift();

  return newestTag?.name;
}
