import {css, cx} from '@emotion/css';
import React, {FC} from 'react';
import semver from 'semver';

import {getExtensionVersion} from '../../../helpers/browserHelpers';

export interface NewFeatureBadgeProps {
  introducedIn: string;
}

const currentVersion = semver.coerce(getExtensionVersion());

export const featureBadgeClassname = 'btd-feature-badge';

export const NewFeatureBadge: FC<NewFeatureBadgeProps> = (props) => {
  const cleanVersion = semver.coerce(props.introducedIn);

  if (!currentVersion || !cleanVersion) {
    return null;
  }

  if (currentVersion.major > cleanVersion.major || currentVersion.minor > cleanVersion.minor) {
    return null;
  }

  return (
    <span
      className={cx(
        css`
          display: inline-block;
          background: var(--twitter-blue);
          color: white;
          border-radius: 4px;
          font-size: 10px;
          text-transform: uppercase;
          font-weight: bold;
          padding: 1px 4px 2px 4px;
        `,
        featureBadgeClassname
      )}>
      NEW
    </span>
  );
};
