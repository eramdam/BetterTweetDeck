import ReactDOMServer from 'react-dom/server';

export function reactElementToString(element: React.ReactElement) {
  return ReactDOMServer.renderToString(element);
}
