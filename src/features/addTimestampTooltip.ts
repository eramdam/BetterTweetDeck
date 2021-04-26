import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const addTimestampTooltip = makeBTDModule(({TD}) => {
  modifyMustacheTemplate(TD, 'status/tweet_timestamp.mustache', (string) => {
    return string
      .replace('js-timestamp', 'js-timestamp js-show-tip')
      .replace(
        'data-time',
        '{{/created}} data-original-title="{{createdPrettyFull}}" {{#created}} data-time'
      );
  });
});
