import React, {FC} from 'react';

import defaultMessages from '../_locales/en/messages.json';
import {getMessage} from '../helpers/webExtensionHelpers';

interface TransProps {
  id: keyof typeof defaultMessages;
  substitutions?: string;
}

// Stole the name from `lingui`
export const Trans: FC<TransProps> = (props) => {
  return <>{getLocalizedMessage(props)}</>;
};

export function getLocalizedMessage(props: TransProps) {
  const fallback = defaultMessages[props.id]?.message;
  try {
    const localizedMessage = getMessage(props.id, props.substitutions);

    return localizedMessage;
  } catch (e) {
    return fallback || props.id;
  }
}
