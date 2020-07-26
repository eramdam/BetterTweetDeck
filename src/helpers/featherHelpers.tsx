import feather from 'feather-icons';
import React, {AllHTMLAttributes, DOMAttributes, FC} from 'react';

function getFeatherIconProps(iconName: string): DOMAttributes<HTMLElement> {
  return {
    dangerouslySetInnerHTML: {
      __html: feather.icons[iconName].toSvg(),
    },
  };
}

interface FeatherIconProps extends AllHTMLAttributes<HTMLSpanElement> {
  name: string;
}
export const FeatherIcon: FC<FeatherIconProps> = ({name, ...domProps}) => {
  return <span {...getFeatherIconProps(name)} {...domProps}></span>;
};
