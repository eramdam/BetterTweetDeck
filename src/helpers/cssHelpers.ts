import {compile, serialize, stringify} from 'stylis';

const prettier = require('prettier/standalone');

export function prettifyCss(cssString: string): string {
  return prettier.format(cssString, {
    parser: 'css',
    plugins: {
      css: require('prettier/parser-postcss'),
    },
  });
}

export function minifyCss(cssString: string): string {
  console.log('compress', cssString);
  return serialize(compile(cssString), stringify);
}
