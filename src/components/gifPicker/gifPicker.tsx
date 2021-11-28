import createEmotion from '@emotion/css/create-instance';
import React, {CSSProperties, forwardRef, ReactNode} from 'react';

import {Handler, HandlerOf} from '../../helpers/typeHelpers';

interface GifPickerProps {
  onSearchInput: HandlerOf<string>;
  onCloseClick: Handler;
  children: ReactNode;
  style: CSSProperties;
}
const container = document.head.appendChild(document.createElement('style'));
const {cx, css} = createEmotion({
  key: 'btd-giphy',
  container: container,
});
export const BTDGifPicker = forwardRef<HTMLDivElement, GifPickerProps>((props, ref) => {
  const d = new Date();
  const fool = d.getDate() === 1 && d.getMonth() === 3;
  const GIFText = fool ? 'JIFs' : 'GIFs';
  return (
    <div
      ref={ref}
      className={cx(
        'btd-giphy-zone',
        css`
          display: block;
          background: white;
          border-radius: 6px;
          width: 300px;
          height: 530px;
          position: absolute;
          overflow: hidden;

          display: flex;
          flex-direction: column;
          box-shadow: 0 0px 2px rgba(0, 0, 0, 0.4), 0 1px 15px rgba(0, 0, 0, 0.4);

          html.dark & {
            background: #15202b;
          }
        `
      )}
      style={props.style}>
      <header
        className={css`
          display: grid;
          align-items: center;
          grid-auto-flow: column;
          grid-template-columns: 40px 1fr;
          padding: 6px;
        `}>
        <i
          onClick={props.onCloseClick}
          className={cx(
            'js-compose-close is-actionable icon icon-close',
            css`
              margin-top: -8px;
            `
          )}></i>
        <input
          type="search"
          className={css`
            box-sizing: border-box;
            color: #111;
          `}
          autoFocus
          placeholder={`Search for ${GIFText}...`}
          onInput={(e) => {
            props.onSearchInput((e.target as HTMLInputElement).value);
          }}
        />
      </header>
      <div
        className={cx(
          `scroll-v scroll-styled-v`,
          css`
            flex: 1;
            flex-shrink: 1;
            font-size: 0;
          `
        )}>
        <div
          className={css`
            column-count: 2;
            column-gap: 0;

            .btd-giphy-block-wrapper {
              overflow: hidden;

              &:hover {
                opacity: 0.6;
              }
            }

            .btd-giphy-block {
              width: 100%;
              height: auto;
              cursor: pointer;
            }
          `}>
          {props.children}
        </div>
      </div>
    </div>
  );
});
