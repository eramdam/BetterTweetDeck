import {config} from 'node-config-ts';

import {
  BTDGifDownloadRequestEvent,
  BTDGifDownloadRequestResultEvent,
  BTDMakeGifPickerRequestEvent,
  BTDMakeGifPickerRequestResultEvent,
  BTDMessages,
} from '../types/betterTweetDeck/btdMessageTypes';

export type GifsArray = BTDMakeGifPickerRequestResultEvent['payload']['gifs'];
export async function processGifRequest(
  message: BTDMakeGifPickerRequestEvent
): Promise<BTDMakeGifPickerRequestResultEvent | undefined> {
  const {endpoint, source, params} = message.payload;

  if (source === 'giphy') {
    const pathAndQuery = new URL(`https://api.giphy.com/v1/gifs/${endpoint}`);
    pathAndQuery.searchParams.append('api_key', config.Client.APIs.giphy);

    Object.keys(params).forEach((k) => {
      pathAndQuery.searchParams.append(k, params[k]);
    });

    const res = await fetch(pathAndQuery.toString()).then((r) => r.json());
    const formatted: GifsArray = (res.data || []).map((i: any) => ({
      preview: {
        url: i.images.preview_gif.url,
        width: Number(i.images.preview_gif.width),
        height: Number(i.images.preview_gif.height),
      },
      url: i.images.original.url,
      source: 'giphy',
    }));

    return {
      ...message,
      name: BTDMessages.GIF_REQUEST_RESULT,
      payload: {
        gifs: formatted,
      },
    };
  }

  const pathAndQuery = new URL(`https://api.tenor.com/v1/${endpoint}`);
  pathAndQuery.searchParams.append('key', config.Client.APIs.tenor);
  Object.keys(params).forEach((k) => {
    pathAndQuery.searchParams.append(k, params[k]);
  });

  const res = await fetch(pathAndQuery.toString()).then((r) => r.json());
  const formatted: GifsArray = (res.results || []).map((i: any) => ({
    preview: {
      url: i.media[0].tinygif.url,
      width: Number(i.media[0].tinygif.dims[0]),
      height: Number(i.media[0].tinygif.dims[1]),
    },
    url: i.media[0].gif.url,
    source: 'tenor',
  }));

  return {
    ...message,
    name: BTDMessages.GIF_REQUEST_RESULT,
    payload: {
      gifs: formatted,
    },
  };
}

export async function processDownloadGifRequest(
  message: BTDGifDownloadRequestEvent
): Promise<BTDGifDownloadRequestResultEvent | undefined> {
  const url = message.payload;

  const blob = await fetch(url).then((res) => res.blob());
  const gifFile = new File([blob], 'awesome-gif.gif', {
    type: 'image/gif',
  });

  return {
    ...message,
    name: BTDMessages.DOWNLOAD_GIF_RESULT,
    payload: gifFile,
  };
}
