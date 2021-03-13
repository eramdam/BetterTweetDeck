import {css, cx} from '@emotion/css';
import React, {FC} from 'react';
import semver from 'semver';

import {getExtensionVersion} from '../../../helpers/webExtensionHelpers';

interface NewFeatureBadgeProps {
  introducedWith: string;
}

const currentVersion = semver.coerce(getExtensionVersion());

export const NewFeatureBadge: FC<NewFeatureBadgeProps> = (props) => {
  const cleanVersion = semver.coerce(props.introducedWith);

  if (!currentVersion || !cleanVersion) {
    return null;
  }

  if (currentVersion.major > cleanVersion.major || currentVersion.minor > cleanVersion.minor) {
    return null;
  }

  return (
    <span
      className={cx(css`
        background: var(--twitter-blue);
        color: white;
        border-radius: 4px;
        font-size: 11px;
        text-transform: uppercase;
        font-weight: bold;
        padding: 3px 5px;
      `)}>
      NEW
    </span>
  );
};
