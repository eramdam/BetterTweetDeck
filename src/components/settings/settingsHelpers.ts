import ReactDOMServer from 'react-dom/server';

export function reactElementToString(element: React.ReactElement) {
  return ReactDOMServer.renderToString(element);
}

let id = 0;
export const generateInputId = () => {
  id++;
  return String(id);
};
