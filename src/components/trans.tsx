import React, {FC} from 'react';

import defaultMessages from '../_locales/en/messages.json';
import {getMessage} from '../helpers/webExtensionHelpers';

interface TransProps {
  id: keyof typeof defaultMessages;
  substitutions?: string;
}

// Stole the name from `js-lingui`
export const Trans: FC<TransProps> = (props) => {
  return <>{getLocalizedMessageInternal(props)}</>;
};

export function getTransString(id: TransProps['id'], substitutions?: TransProps['substitutions']) {
  return getLocalizedMessageInternal({
    id,
    substitutions,
  });
}

function getLocalizedMessageInternal(props: TransProps) {
  const fallback = defaultMessages[props.id]?.message;
  try {
    const localizedMessage = getMessage(props.id, props.substitutions);

    return fallback || props.id;
  } catch (e) {
    return fallback || props.id;
  }
}
