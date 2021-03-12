import {encode, isBlurhashValid} from 'blurhash';
import {normal} from 'color-blend';
import _ from 'lodash';
import {hsl, hslToColorString, parseToHsl, parseToRgb, rgb, rgba, saturate} from 'polished';

import {polishedToColorBlend} from './colorHelpers';
const digitCharacters = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '#',
  '$',
  '%',
  '*',
  '+',
  ',',
  '-',
  '.',
  ':',
  ';',
  '=',
  '?',
  '@',
  '[',
  ']',
  '^',
  '_',
  '{',
  '|',
  '}',
  '~',
];

export const decode83 = (str: String) => {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    const digit = digitCharacters.indexOf(c);
    value = value * 83 + digit;
  }
  return value;
};

const loadImage = async (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);
    img.src = src;
  });

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d')!;
const getImageData = (image: HTMLImageElement) => {
  canvas.width = image.width;
  canvas.height = image.height;

  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
};

const blurHashCache = new Map<string, string>();

const decodeRGB = (int: number) => ({
  r: Math.max(0, int >> 16),
  g: Math.max(0, (int >> 8) & 255),
  b: Math.max(0, int & 255),
});

const sRGBToLinear = (value: number) => {
  let v = value / 255;
  if (v <= 0.04045) {
    return v / 12.92;
  } else {
    return Math.pow((v + 0.055) / 1.055, 2.4);
  }
};

const linearTosRGB = (value: number) => {
  let v = Math.max(0, Math.min(1, value));
  if (v <= 0.0031308) {
    return Math.round(v * 12.92 * 255 + 0.5);
  } else {
    return Math.round((1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255 + 0.5);
  }
};

const decodeDC = (value: number): [number, number, number] => {
  const intR = value >> 16;
  const intG = (value >> 8) & 255;
  const intB = value & 255;
  return [sRGBToLinear(intR), sRGBToLinear(intG), sRGBToLinear(intB)];
};

const sign = (n: number) => (n < 0 ? -1 : 1);

const signPow = (val: number, exp: number) => sign(val) * Math.pow(Math.abs(val), exp);

const decodeAC = (value: number, maximumValue: number): [number, number, number] => {
  const quantR = Math.floor(value / (19 * 19));
  const quantG = Math.floor(value / 19) % 19;
  const quantB = value % 19;

  return [
    signPow((quantR - 9) / 9, 2.0) * maximumValue,
    signPow((quantG - 9) / 9, 2.0) * maximumValue,
    signPow((quantB - 9) / 9, 2.0) * maximumValue,
  ];
};

async function encodeImageToBlurhash(imageSrc: string) {
  if (blurHashCache.get(imageSrc)) {
    return blurHashCache.get(imageSrc);
  }
  const newImage = await loadImage(imageSrc);
  const imageData = getImageData(newImage);

  const blurhash = encode(imageData.data, imageData.width, imageData.height, 4, 5);
  blurHashCache.set(imageSrc, blurhash);
  return blurhash;
}

export async function getOverlayBackgroundForImage(imageSrc: string) {
  const blurhash = (await encodeImageToBlurhash(imageSrc)) || '';

  if (!isBlurhashValid(blurhash)) {
    return undefined;
  }

  const sizeFlag = decode83(blurhash[0]);
  const numY = Math.floor(sizeFlag / 9) + 1;
  const numX = (sizeFlag % 9) + 1;
  const quantisedMaximumValue = decode83(blurhash[1]);
  const maximumValue = (quantisedMaximumValue + 1) / 166;

  const punch = 4;

  const colors: number[][] = new Array(numX * numY);

  for (let i = 0; i < colors.length; i++) {
    if (i === 0) {
      const value = decode83(blurhash.substring(2, 6));
      colors[i] = decodeDC(value).map((c) => linearTosRGB(c));
    } else {
      const value = decode83(blurhash.substring(4 + i * 2, 6 + i * 2));
      colors[i] = decodeAC(value, maximumValue * punch).map((c) => linearTosRGB(c));
    }
  }

  const chosenColors = _(colors)
    .map((c) => parseToHsl(rgb(...(c as [number, number, number]))))
    .orderBy(
      [(c) => c.saturation, (c) => c.saturation + c.lightness, (c) => Math.abs(c.hue - 180)],
      ['desc', 'desc', 'asc']
    )
    .value();

  const chosenColor = chosenColors[0];

  console.log(
    chosenColors.map((c) => hslToColorString(c)),
    chosenColors
  );

  const amountToIncreaseSaturationBy = chosenColor.saturation < 0.01 ? 0.05 : 0.4;
  const finalColor = parseToRgb(saturate(amountToIncreaseSaturationBy, hsl(chosenColor)));

  const finalRgba = normal(polishedToColorBlend(finalColor), {
    r: 0,
    g: 0,
    b: 0,
    a: 0.1,
  });

  return rgba({
    red: finalRgba.r,
    green: finalRgba.g,
    blue: finalRgba.b,
    alpha: 0.95,
  });
}
