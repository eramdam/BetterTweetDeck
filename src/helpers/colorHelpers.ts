import convert from 'color-convert';
import {rgba} from 'polished';

import {TweetDeckChirp, TweetMediaEntityPalette} from '../types/tweetdeckTypes';

export function getBackgroundColorForMediaInChirp(chirp: TweetDeckChirp, mediaUrl: string) {
  const palette = getPaletteForMediaInChirp(chirp, mediaUrl);

  if (!palette) {
    return undefined;
  }

  return getBackgroundColorFromPalette(palette);
}

function getBackgroundColorFromPalette(palette: TweetMediaEntityPalette) {
  if (palette.length === 0) {
    return undefined;
  }

  const basePick = pickColor(palette);
  const tweakedPick = tweakHsv(basePick);

  return rgba(tweakedPick.rgb.red, tweakedPick.rgb.green, tweakedPick.rgb.blue, 0.96);
}

export function getMediaEntityForMediaUrl(chirp: TweetDeckChirp, mediaUrl: string) {
  return chirp.entities.media.find((e) => {
    const mediaFileId = new URL(e.media_url_https).pathname.split('/').pop()?.split('.')[0];
    if (!mediaFileId) {
      return false;
    }
    return mediaUrl.includes(mediaFileId);
  });
}

function getPaletteForMediaInChirp(chirp: TweetDeckChirp, mediaUrl: string) {
  const entityForMedia = getMediaEntityForMediaUrl(chirp, mediaUrl);

  return entityForMedia?.ext_media_color?.palette;
}

interface Rgb {
  red: number;
  green: number;
  blue: number;
}
interface CustomHsv {
  hue: number;
  saturation: number;
  value: number;
}

const rgbToCustomHsv = ({red, green, blue}: Rgb) => {
  const [baseHue, baseSaturation, baseValue] = convert.rgb.hsv([red, green, blue]);
  return {
    hue: baseHue / 360,
    saturation: baseSaturation / 100,
    value: baseValue / 100,
  };
};

const customHsvToRgb = ({hue, saturation, value}: CustomHsv) => {
  const [red, green, blue] = convert.hsv.rgb([hue * 360, saturation * 100, value * 100]);
  return {
    red,
    green,
    blue,
  };
};

const pickColor = (palette: TweetMediaEntityPalette) => {
  const withHsv = palette.map((color) => {
    return {
      ...color,
      hsv: rgbToCustomHsv(color.rgb),
    };
  });

  return withHsv.find((c) => filterHsv(c.hsv)) || withHsv[0];
};

const tweakHsv = (paletteColor: {rgb: Rgb; hsv: CustomHsv}) => {
  const newHsv = paletteColor.hsv;
  if (newHsv.hue >= 11 / 360 && newHsv.hue < 0.125) {
    newHsv.hue = 5 / 360;
  }
  newHsv.saturation = Math.min(Math.max(newHsv.saturation, 0), 0.85);
  newHsv.value = Math.min(Math.max(newHsv.value, 0.15), 0.25);

  return {
    hsv: newHsv,
    rgb: customHsvToRgb(newHsv),
  };
};

const filterHsv = (h: CustomHsv) => h.saturation > 0.15 && h.value > 0.1;
