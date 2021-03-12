import {RGBA} from 'color-blend/dist/types';
import {RgbaColor, RgbColor} from 'polished/lib/types/color';

function isRgbaColor(src: RgbColor | RgbaColor): src is RgbaColor {
  return (src as any).alpha;
}

export function polishedToColorBlend(color: RgbColor | RgbaColor): RGBA {
  return {
    r: color.red,
    g: color.green,
    b: color.blue,
    a: isRgbaColor(color) ? color.alpha : 1,
  };
}

export function colorBlendToPolished(color: RGBA): RgbaColor {
  return {
    red: color.r,
    green: color.g,
    blue: color.b,
    alpha: color.a,
  };
}
