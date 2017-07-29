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

const unsafeElements = ['script', 'style'];

export function parse(html) {
  const doc = domify(html);

  [...doc.querySelectorAll('*')].forEach((node) => {
    if (unsafeElements.includes(node.nodeName.toLowerCase())) {
      node.remove();
    }
  });

  return doc;
}
