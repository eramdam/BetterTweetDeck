import React, {PropsWithChildren} from 'react';

type defaultProps = PropsWithChildren<{}>;

export function SettingsModalWrapper(props: defaultProps) {
  return <div className="btd-settings-modal">{props.children}</div>;
}
export function SettingsHeader(props: defaultProps) {
  return <div className="btd-settings-header">{props.children}</div>;
}
export function SettingsSidebar(props: defaultProps) {
  return <div className="btd-settings-sidebar">{props.children}</div>;
}
export function SettingsContent(props: defaultProps) {
  return <div className="btd-settings-content">{props.children}</div>;
}
export function SettingsFooter(props: defaultProps) {
  return <div className="btd-settings-footer">{props.children}</div>;
}
export function SettingsFooterLabel(props: defaultProps) {
  return <div className="btd-settings-footer-label">{props.children}</div>;
}
