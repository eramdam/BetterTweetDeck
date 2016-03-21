import Mustache from 'mustache'

const _templates = {
  preview: `
  <div class="js-media media-preview position-rel">
  <div class="js-media-preview-container position-rel {{^isMediaPreviewLarge}}{{^isMediaPreviewCompact}}{{^isMediaPreviewInQuoted}}margin-vm{{/isMediaPreviewInQuoted}}{{/isMediaPreviewCompact}}{{/isMediaPreviewLarge}}  {{#isMediaPreviewSmall}}{{#isPossiblySensitive}}media-size-medium{{/isPossiblySensitive}}{{/isMediaPreviewSmall}} {{#isMediaPreviewCompact}}media-size-medium margin-t--8{{/isMediaPreviewCompact}} {{#isMediaPreviewInQuoted}}margin-tm{{/isMediaPreviewInQuoted}} {{#isAnimatedGif}}is-gif{{/isAnimatedGif}} {{#isVideo}}is-video{{/isVideo}} {{#isMediaPreviewLarge}}margin-tm item-box-full-bleed{{/isMediaPreviewLarge}}">
    {{#isMediaPreviewLarge}}
      <div class="media-caret"></div>
    {{/isMediaPreviewLarge}}
    {{#isAnimatedGif}}
      {{#animatedGif}} {{> media/animated_gif}} {{/animatedGif}}
    {{/isAnimatedGif}} {{^isAnimatedGif}} <a class="js-media-image-link block med-link media-item {{thumbSizeClass}} {{#isPossiblySensitive}}is-invisible{{/isPossiblySensitive}} {{#needsSecureUrl}}js-needs-secure-url{{/needsSecureUrl}} {{^isGalleryView}}is-zoomable{{/isGalleryView}}"
     {{#needsSecureUrl}} data-original-url="{{mediaPreviewSrc}}{{imageSrc}}" {{/needsSecureUrl}} href="{{url}}" rel="mediaPreview" target="_blank" {{^needsSecureUrl}} {{^imageSrc}} style="background-image:url({{mediaPreviewSrc}})" {{/imageSrc}} {{/needsSecureUrl}}
    data-media-entity-id="{{mediaId}}"> {{#isVideo}} {{> media/video_overlay}} {{/isVideo}}  {{#imageSrc}} <img class="{{thumbClass}}" src="{{^needsSecureUrl}}{{imageSrc}}{{/needsSecureUrl}}" alt="Media preview"> {{/imageSrc}} </a> {{/isAnimatedGif}}
    {{> status/media_sensitive}}</div></div>
  `,
  modal: `<div class="js-mediatable ovl-block is-inverted-light">
    <div class="s-padded">
      <div class="js-modal-panel mdl s-full med-fullpanel"> <a href="#" class="mdl-dismiss js-dismiss mdl-dismiss-media mdl-btn-media" rel="dismiss"><i class="icon txt-size--24 icon-close"></i></a>
        <div class="js-embeditem med-embeditem">
          <div class="l-table">
            <div class="l-cell">
              <!-- Insert here  -->
              <div class="med-tray js-mediaembed" style="opacity: 1;">
                <div class="js-media-preview-container position-rel margin-vm">
                  <a class="js-media-image-link block med-link media-item" href="https://t.co/Vztmxfe5nn" rel="mediaPreview" target="_blank" data-media-entity-id="">
                    {{^isVideo}}
                    <img class="media-img" src="{{imageUrl}}" alt="{{AltInfo}}" data-maxwidth="{{maxWidth}}" data-maxheight="{{maxHeight}}" style="max-width: 1024px; max-height: 688px;">
                    {{/isVideo}}
                    {{#isVideo}}
                    <div class="youtube-player">
                      {{&videoEmbed}}
                    </div>
                    {{/isVideo}}
                  </a>
                </div>
                <a href="https://t.co/Vztmxfe5nn" class="med-origlink" rel="url" target="_blank">View original</a>
              </div>
            </div>
          </div>
          <a href="#" class="js-media-gallery-prev link-no-focus mdl-btn-media mdl-media-prev is-hidden"> <i class="icon txt-size--26 icon-arrow-l"></i> </a>
          <a href="#" class="js-media-gallery-next link-no-focus mdl-btn-media mdl-media-next is-hidden"> <i class="icon txt-size--26 icon-arrow-r"></i> </a>
        </div>
        <div id="media-gallery-tray"></div>
        <div class="js-med-tweet med-tweet"></div>
      </div>
    </div>
  </div>`
}

const _data = {
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
    url: 'apple.com'
  },
  modal: {
    imageUrl: undefined,
    isVideo: true,
    videoEmbed: undefined
  }
}

const previewTemplate = (mediaPreviewSrc, sourceLink, size, type = 'picture') => {
  return Mustache.render(_templates.preview, Object.assign(_data.preview, {
    url: sourceLink,
    mediaPreviewSrc,
    isVideo: type === 'video',
    isMediaPreviewLarge: size === 'large',
    isMediaPreviewCompact: size === 'medium',
    isMediaPreviewSmall: size === 'small',
    thumbSizeClass: `media-size-${size}`
  }))
}

const modalTemplate = (imageUrl, type, videoEmbed = null) => {
  return Mustache.render(_templates.preview, Object.assign(_data.modal, {
    imageUrl,
    videoEmbed,
    isVideo: type === 'video'
  }))
}

module.exports = { modalTemplate, previewTemplate }
