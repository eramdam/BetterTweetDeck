import React, {FC, useRef} from 'react';
import MonacoEditor, {monaco} from 'react-monaco-editor';

import {HandlerOf} from '../../../helpers/typeHelpers';

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
      const owner = model.getModeId();
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
        height: '100%',
        marginBottom: 0,
        overflow: 'hidden',
        padding: 20,
        paddingBottom: 0,
      }}>
      <div
        style={{
          marginBottom: 20,
        }}>
        ⚠️ Pasting unknown code in this editor can lead to weird issues if you don&apos;t know what
        you are doing ⚠️️
      </div>
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
            height="300px"
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
              minimap: {
                enabled: false,
              },
            }}></MonacoEditor>
        </div>
      </div>
    </div>
  );
};
