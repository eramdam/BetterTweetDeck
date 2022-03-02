/* eslint-disable react/no-unescaped-entities */
import React, {FC, useRef} from 'react';
import MonacoEditor, {monaco} from 'react-monaco-editor';

import {HandlerOf} from '../../../helpers/typeHelpers';
import {Trans} from '../../trans';
import {settingsLink} from '../settingsStyles';

interface SettingsCssEditorProps {
  onErrorChange: HandlerOf<boolean>;
  onChange: HandlerOf<string>;
  value: string;
}

export const SettingsCssEditor: FC<SettingsCssEditorProps> = (props) => {
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const onMonacoMount: MonacoEditor['props']['editorDidMount'] = (editor) => {
    monacoRef.current = editor;
    editor.onDidChangeModelDecorations(() => {
      const model = editor.getModel();
      if (!model) {
        return;
      }
      const owner = model.getLanguageId();
      const markers = monaco.editor.getModelMarkers({owner});
      const hasErrors = markers.some((marker) => marker.severity === monaco.MarkerSeverity.Error);

      props.onErrorChange(hasErrors);
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 0,
        overflow: 'hidden',
        padding: 20,
        paddingBottom: 0,
      }}>
      <p
        style={{
          marginBottom: 20,
          lineHeight: 1.7,
          maxWidth: '990px',
        }}>
        ⚠️ <Trans id="settings_custom_css_warning" /> ⚠️️
        <br />
        <br />
        <Trans id="settings_looking_for_inspiration" />{' '}
        <a
          className={settingsLink}
          href="https://github.com/eramdam/BetterTweetDeck/wiki/Custom-CSS-recipes">
          <Trans id="settings_check_the_collection_of_css_snippets" />
        </a>
        <br />
        <Trans id="settings_css_compress_warning" />
        <br />
        <br />
        <Trans id="settings_backup_warning" />
      </p>
      <div
        style={{
          flexShrink: 1,
          flexGrow: 1,
          position: 'relative',
        }}>
        <div
          style={{
            height: '100%',
          }}>
          <MonacoEditor
            height="700px"
            editorDidMount={onMonacoMount}
            editorWillMount={(monaco) => {
              monaco.editor.defineTheme('vs-dark', {
                base: 'vs-dark',
                colors: {
                  'editor.background': '#0d1118',
                },
                inherit: true,
                rules: [],
              });
            }}
            theme="vs-dark"
            language="css"
            onChange={props.onChange}
            value={props.value}
            options={{
              fontSize: 16,
              minimap: {
                enabled: false,
              },
            }}></MonacoEditor>
        </div>
      </div>
    </div>
  );
};
