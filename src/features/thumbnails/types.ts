import * as t from 'io-ts';
export enum BTDUrlProviderResultTypeEnum {
  IMAGE = 'image',
  VIDEO = 'video',
  ERROR = 'error',
}

const RBTDUrlProviderImageResult = t.type({
  type: t.literal(BTDUrlProviderResultTypeEnum.IMAGE),
  thumbnailUrl: t.string,
  fullscreenImageUrl: t.string,
  url: t.string,
});

const RBTDUrlProviderVideoResult = t.type({
  type: t.literal(BTDUrlProviderResultTypeEnum.VIDEO),
  thumbnailUrl: t.string,
  html: t.string,
  url: t.string,
});

const RBTDUrlProviderErrorResult = t.type({
  type: t.literal(BTDUrlProviderResultTypeEnum.ERROR),
  error: t.any,
});

export const RBTDFetchResult = t.taggedUnion('type', [
  RBTDUrlProviderImageResult,
  RBTDUrlProviderVideoResult,
  RBTDUrlProviderErrorResult,
]);

export interface BTDUrlProviderImageResult extends t.TypeOf<typeof RBTDUrlProviderImageResult> {}
export interface BTDUrlProviderVideoResult extends t.TypeOf<typeof RBTDUrlProviderVideoResult> {}
export interface BTDUrlProviderErrorResult extends t.TypeOf<typeof RBTDUrlProviderErrorResult> {}

export type BTDFetchResult =
  | BTDUrlProviderImageResult
  | BTDUrlProviderVideoResult
  | BTDUrlProviderErrorResult;

export interface BTDThumbnailProvider {
  readonly name: string;
  readonly settingsKey: string;
  readonly matchUrl: (url: string) => boolean;
  readonly fetchData: (url: string) => Promise<BTDFetchResult>;
}
