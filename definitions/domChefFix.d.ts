declare namespace JSX {
  interface Element extends SVGElement, HTMLElement, DocumentFragment {}
  type BaseIntrinsicElement = IntrinsicElements['div'];
  type LabelIntrinsicElement = IntrinsicElements['label'];
  interface IntrinsicElements {
    'has-rgh': BaseIntrinsicElement;
    label: LabelIntrinsicElement & {for?: string};
    'include-fragment': BaseIntrinsicElement & {src?: string};
    'details-menu': BaseIntrinsicElement & {src?: string; preload?: boolean};
    'time-ago': BaseIntrinsicElement & {datetime: string; format?: string};
    'relative-time': BaseIntrinsicElement & {datetime: string};
    'details-dialog': BaseIntrinsicElement & {tabindex: string};
  }

  interface IntrinsicAttributes extends BaseIntrinsicElement {
    width?: number;
    height?: number;
  }
}
