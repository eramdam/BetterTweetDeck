import Mustache from 'mustache';
/* eslint max-len: 0*/
const templates = {
  preview: `
  <div class="js-media media-preview position-rel">
  <div {{#needsProvider}} data-btd-provider="{{provider}}" {{/needsProvider}} class="js-media-preview-container position-rel {{^isMediaPreviewLarge}}{{^isMediaPreviewCompact}}{{^isMediaPreviewInQuoted}}margin-vm{{/isMediaPreviewInQuoted}}{{/isMediaPreviewCompact}}{{/isMediaPreviewLarge}}  {{#isMediaPreviewSmall}}{{#isPossiblySensitive}}media-size-medium{{/isPossiblySensitive}}{{/isMediaPreviewSmall}} {{#isMediaPreviewCompact}}media-size-medium margin-t--8{{/isMediaPreviewCompact}} {{#isMediaPreviewInQuoted}}margin-tm{{/isMediaPreviewInQuoted}} {{#isAnimatedGif}}is-gif{{/isAnimatedGif}} {{#isVideo}}is-video{{/isVideo}} {{#isMediaPreviewLarge}}margin-tm item-box-full-bleed{{/isMediaPreviewLarge}}">
    {{#isMediaPreviewLarge}}
      <div class="media-caret"></div>
    {{/isMediaPreviewLarge}}
    {{#isAnimatedGif}}
      {{#animatedGif}} {{> media/animated_gif}} {{/animatedGif}}
    {{/isAnimatedGif}} {{^isAnimatedGif}}
    <a class="js-media-image-link block med-link media-item {{thumbSizeClass}} {{#isPossiblySensitive}}is-invisible{{/isPossiblySensitive}} {{#needsSecureUrl}}js-needs-secure-url{{/needsSecureUrl}} {{^isGalleryView}}is-zoomable{{/isGalleryView}}"
     {{#needsSecureUrl}} data-original-url="{{mediaPreviewSrc}}{{imageSrc}}" {{/needsSecureUrl}} href="{{url}}" target="_blank" {{^needsSecureUrl}} {{^imageSrc}} style="background-image:url('{{mediaPreviewSrc}}')" {{/imageSrc}} {{/needsSecureUrl}}
    data-media-entity-id="{{mediaId}}"> {{#isVideo}} {{> media/video_overlay}} {{/isVideo}}  {{#imageSrc}} <img class="{{thumbClass}}" src="{{^needsSecureUrl}}{{imageSrc}}{{/needsSecureUrl}}" alt="Media preview"> {{/imageSrc}} </a> {{/isAnimatedGif}}
    {{> status/media_sensitive}}</div></div>
  `,
  modal: `<div class="js-mediatable ovl-block is-inverted-light" btd-custom-modal>
    <div class="s-padded">
      <div class="js-modal-panel mdl s-full med-fullpanel"> <a href="#" class="mdl-dismiss js-dismiss mdl-dismiss-media mdl-btn-media" rel="dismiss"><i class="icon txt-size--24 icon-close"></i></a>
        <div class="js-embeditem med-embeditem">
          <div class="l-table">
            <div class="l-cell">
              <!-- Insert here  -->
              <div class="med-tray js-mediaembed" style="opacity: 1;">
                <div class="js-media-preview-container position-rel margin-vm">
                  <a class="js-media-image-link block med-link media-item" href="{{imageUrl}}" rel="mediaPreview" target="_blank" data-media-entity-id="">
                    {{^isVideo}}
                    <img class="media-img" src="{{imageUrl}}" alt="{{AltInfo}}" data-btdsetmax>
                    {{/isVideo}}
                    {{#isVideo}}
                    <div class="youtube-player -{{provider}}">
                      {{&videoEmbed}}
                    </div>
                    {{/isVideo}}
                  </a>
                </div>
                {{#hasGIFDownload}}
                <a href="#" class="med-flaglink" data-btd-dl-gif rel="url" target="_blank">Download as .GIF</a>
                {{/hasGIFDownload}}
                <a href="{{originalUrl}}" class="med-origlink" rel="url" target="_blank">View original</a>
              </div>
            </div>
          </div>
        </div>
        <div id="media-gallery-tray"></div>
        <div class="js-med-tweet med-tweet">{{&tweetEmbed}}</div>
      </div>
    </div>
  </div>`,
  newModal: `<div class="js-mediatable ovl-block is-inverted-light" btd-custom-modal>
    <div class="s-padded">
      <div class="js-modal-panel mdl s-full med-fullpanel"> <a href="#" class="mdl-dismiss js-dismiss mdl-dismiss-media mdl-btn-media" rel="dismiss"><i class="icon txt-size--24 icon-close"></i></a>
        <div class="js-embeditem med-embeditem btd-embed-container">
          <div class="btd-embed-and-links">
            {{^isVideo}}
            <img class="media-img" src="{{imageUrl}}" alt="{{AltInfo}}" data-btdsetmax>
            {{/isVideo}}
            {{#isVideo}}
              {{&videoEmbed}}
            {{/isVideo}}
          </div>
          
        </div>
        <div id="media-gallery-tray"></div>
        <div class="js-med-tweet med-tweet">{{&tweetEmbed}}</div>
      </div>
    </div>
  </div>`,
};

const defaultData = {
  preview: {
    animatedGif: null,
    imageSrc: null,
    isAnimatedGif: false,
    isGalleryView: true,
    isMediaPreviewInQuoted: false,
    isMediaPreviewLarge: false,
    isMediaPreviewCompact: true,
    isMediaPreviewSmall: false,
    isPossiblySensitive: false,
    isVideo: false,
    mediaId: 0,
    mediaPreviewSrc: 'foo',
    needsSecureUrl: false,
    thumbSizeClass: 'HUGE',
    url: 'apple.com',
  },
  modal: {
    imageUrl: undefined,
    isVideo: true,
    originalUrl: undefined,
    videoEmbed: undefined,
  },
};

const previewTemplate = ({ mediaPreviewSrc, sourceLink, size, type = 'picture', provider = 'default' }) => {
  const safeURL = mediaPreviewSrc;

  if (type === 'image' && !mediaPreviewSrc.includes('imgur.com') && mediaPreviewSrc) {
    const parsed = new URL(mediaPreviewSrc);
    mediaPreviewSrc = parsed.searchParams.get('url');

    if (!mediaPreviewSrc.includes('https')) {
      mediaPreviewSrc = safeURL;
    }
  }

  return Mustache.render(templates.preview, Object.assign(defaultData.preview, {
    url: sourceLink,
    mediaPreviewSrc,
    isVideo: type !== 'image',
    isMediaPreviewLarge: size === 'large',
    isMediaPreviewCompact: size === 'medium',
    isMediaPreviewSmall: size === 'small',
    thumbSizeClass: `media-size-${size || 'medium'}`,
    needsProvider: !['default', 'universal'].includes(provider),
    provider: (provider || '').toLowerCase(),
  }));
};

const modalTemplate = ({ imageUrl, originalUrl, type, videoEmbed = null, provider = 'default', hasGIFDownload = false }) => {
  if (type === 'image') {
    const parsed = new URL(imageUrl);
    imageUrl = parsed.searchParams.get('url');
  }

  return Mustache.render(type === 'image' ? templates.newModal : templates.modal, Object.assign(defaultData.modal, {
    imageUrl,
    videoEmbed,
    originalUrl,
    isVideo: type !== 'image',
    provider: (provider || '').toLowerCase(),
    hasGIFDownload,
  }));
};

module.exports = { modalTemplate, previewTemplate };
