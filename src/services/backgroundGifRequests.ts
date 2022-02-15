import {BtdConfig} from '../defineConfig';
import {
  BTDDownloadMediaRequest,
  BTDDownloadMediaRequestResult,
  BTDMakeGifPickerRequest,
  BTDMakeGifPickerRequestResult,
  BTDMessages,
} from '../types/btdMessageTypes';

export type GifsArray = BTDMakeGifPickerRequestResult['payload']['gifs'];
export async function processGifRequest(
  message: BTDMakeGifPickerRequest
): Promise<BTDMakeGifPickerRequestResult | undefined> {
  const {endpoint, source, params} = message.payload;

  if (source === 'giphy') {
    const pathAndQuery = new URL(`https://api.giphy.com/v1/gifs/${endpoint}`);
    pathAndQuery.searchParams.append('api_key', BtdConfig.APIs.giphy);

    Object.keys(params).forEach((k) => {
      pathAndQuery.searchParams.append(k, String(params[k]));
    });

    const res = await fetch(pathAndQuery.toString());
    const resJson = await res.json();
    const formatted: GifsArray = (resJson.data || []).map((i: any) => ({
      preview: {
        url: i.images.fixed_width.url,
        width: Number(i.images.fixed_width.width),
        height: Number(i.images.fixed_width.height),
      },
      url: i.images.original.url,
      source: 'giphy',
    }));

    return {
      ...message,
      name: BTDMessages.GIF_REQUEST_RESULT,
      payload: {
        gifs: formatted,
        pagination: {
          count: resJson.pagination.count,
          offset: resJson.pagination.offset,
          next: '',
        },
      },
    };
  }

  const pathAndQuery = new URL(`https://api.tenor.com/v1/${endpoint}`);
  pathAndQuery.searchParams.append('key', BtdConfig.APIs.tenor);
  pathAndQuery.searchParams.append('limit', '25');
  Object.keys(params).forEach((k) => {
    pathAndQuery.searchParams.append(k, String(params[k]));
  });

  const res = await fetch(pathAndQuery.toString());
  const resJson = await res.json();
  const formatted: GifsArray = (resJson.results || []).map((i: any) => ({
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
      pagination: {
        count: 0,
        offset: 0,
        next: resJson.next,
      },
    },
  };
}

export async function processDownloadMediaRequest(
  message: BTDDownloadMediaRequest
): Promise<BTDDownloadMediaRequestResult | undefined> {
  const url = message.payload;

  const res = await fetch(url);
  const blob = await res.blob();

  return {
    ...message,
    name: BTDMessages.DOWNLOAD_MEDIA_RESULT,
    payload: {
      blob,
      url: url,
    },
  };
}
