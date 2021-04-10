import {ReactNode} from 'react';
import ReactDOMServer from 'react-dom/server';

export function reactElementToString(element: React.ReactElement | ReactNode) {
  return ReactDOMServer.renderToString(element as any);
}

let id = 0;
export const generateInputId = () => {
  id++;
  return String(id);
};
