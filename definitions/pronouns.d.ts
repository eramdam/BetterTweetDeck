// https://github.com/katacarbix/pronouns.js/pull/11/
declare module 'pronouns' {
  export type Pronoun = [
    subject: string,
    object: string,
    determiner: string,
    possessive: string,
    reflexive: string
  ];
  export type PartialPronoun = [string, string?, string?, string?, string?];

  export interface Pronouns {
    pronouns: Pronoun[];
    examples: Pronoun[];

    subject: string;
    object: string;
    determiner: string;
    possessive: string;
    reflexive: string;

    sub: string;
    obj: string;
    det: string;
    pos: string;
    ref: string;

    constructor(input: string): void;

    generateForms(i: number): void;
    generateExamples(): void;
    toString(): string;
    toUrl(): string;
    add(input: string): void;
  }

  export default function (input: string, log?: boolean): Pronouns;

  export function complete(input: string): string[];

  export const table: Pronoun[];

  interface Util {
    logging: boolean;
    tableFrontFilter: (q: PartialPronoun, table: Pronoun[]) => Pronoun[];
    tableEndFilter: (q: PartialPronoun, table: Pronoun[]) => Pronoun[];
    tableLookup: (q: PartialPronoun, table: Pronoun[]) => Pronoun | undefined;
    shortestUnambiguousForwardPath: (table: Pronoun[], row: PartialPronoun) => PartialPronoun;
    shortestUnambiguousEllipsesPath: (table: Pronoun[], row: PartialPronoun) => PartialPronoun;
    shortestUnambiguousPath: (table: Pronoun[], row: PartialPronoun) => PartialPronoun;
    abbreviate: (table: Pronoun[]) => string[][];
    sanitizeSet: (p: PartialPronoun[], table: Pronoun[]) => Pronoun[];
    expandString: (str: string, table: Pronoun[]) => Pronoun[];
    arrFormat: <T extends any>(x: T | T[]) => T[];
    capitalize: (str: string) => string;
    rowsEqual: (a: PartialPronoun, b: Pronoun) => boolean;
  }

  export const util: Util;

  export const abbreviated: string[][];
}
