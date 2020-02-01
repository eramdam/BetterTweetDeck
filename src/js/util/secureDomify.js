import dompurify from 'dompurify';

export const purifyConfig = {
  ADD_TAGS: ['iframe', 'link', 'meta', 'head'],
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

  return dompurify.sanitize(attr, {
    FORBID_TAGS: ['link', 'style'],
  });
}

export function parse(html, wholeDocument = true) {
  const result = dompurify.sanitize(html.replace(/property=/g, 'data-property='), {
    ADD_TAGS: ['meta', 'head', 'iframe', 'html', 'head', 'body'],
    ADD_ATTR: [...purifyConfig.ADD_ATTR, 'content'],
    RETURN_DOM: true,
    WHOLE_DOCUMENT: wholeDocument,
  });

  if (!wholeDocument) {
    return result.querySelector('body > *:first-child');
  }

  return result;
}
