import domify from 'domify';
import escapeHtml from 'escape-html';

export function getAttributeFromNode(selector, node, attribute) {
  const el = node.querySelector(selector);

  if (!el) {
    return '';
  }

  const attr = el.getAttribute(attribute);

  if (!attr) {
    return '';
  }

  return escapeHtml(attr);
}

export function parse(html) {
  return domify(html);
}
