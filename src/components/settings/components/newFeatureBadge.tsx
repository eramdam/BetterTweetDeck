import {css, cx} from '@emotion/css';
import React, {FC, useMemo} from 'react';
import semver from 'semver';

import {getExtensionVersion} from '../../../helpers/webExtensionHelpers';

export interface NewFeatureBadgeProps {
  introducedIn: string;
  maxMinorDiff?: number;
}

const currentVersion = semver.coerce(getExtensionVersion());

export const featureBadgeClassname = 'btd-feature-badge';

export const NewFeatureBadge: FC<NewFeatureBadgeProps> = (props) => {
  const featureVersion = semver.coerce(props.introducedIn);
  const maxMinorDiff = props.maxMinorDiff ?? 5;

  const isOutdated = useMemo(() => {
    if (!currentVersion || !featureVersion) {
      return true;
    }

    if (currentVersion.major > featureVersion.major) {
      return true;
    }

    const minorDiff = currentVersion.minor - featureVersion.minor;
    if (minorDiff > maxMinorDiff) {
      return true;
    }

    return false;
  }, [featureVersion, maxMinorDiff]);

  if (isOutdated) {
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
