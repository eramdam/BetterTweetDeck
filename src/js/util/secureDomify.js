import domify from 'domify';
import dompurify from 'dompurify';

export const purifyConfig = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['autoplay', 'frameborder', 'btd-custom-modal'],
};

export function getAttributeFromNode(selector, node, attribute) {
  const el = node.querySelector(selector);

  if (!el) {
    return '';
  }

  const attr = el.getAttribute(attribute);

  if (!attr) {
    return '';
  }

  return dompurify.sanitize(attr);
}

export function parse(html) {
  const safe = dompurify.sanitize(html, purifyConfig);
  const doc = domify(safe);

  return doc;
}
