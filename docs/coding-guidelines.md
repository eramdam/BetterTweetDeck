**Table of Contents**

- [Coding guidelines](#coding-guidelines)
  - [General guidelines](#general-guidelines)
  - [TypeScript](#typescript)
    - [Naming conventions](#naming-conventions)
      - [Avoid abbreviations](#avoid-abbreviations)
      - [Types](#types)
    - [Avoid `default` exports](#avoid-default-exports)
    - [Use `async/await`](#use-asyncawait)
    - [Use enums](#use-enums)

# Coding guidelines

## General guidelines

I won't discuss the formatting style because ESLint and Prettier will take care of that when you commit your changes.

However, I will go over a few "best practices" I try to stick to when writing code for Better TweetDeck:

- Comment your code. Don't write comments on every line, but if you write code that is a bit complex/weird, leave a comment.
- Keep it simple. There's no need to be overly clever; the most straightforward solution might be the best one.
- Do not abbreviate variable and function names. TypeScript has excellent completion, so take advantage of it.
- TypeScript allows us to use modern features of JavaScript, so don't feel shy about using them!

## TypeScript

### Naming conventions

#### Avoid abbreviations

TypeScript gives use good autocompletion, meaning typing the full name of symbols is rarely needed. You can therefore avoid abbreviations that make the code harder to read.

```ts
// Bad
class HttpSvc {}

// Good
class HttpService {}
```

#### Types

In order to tell them apart from Js variables, types names should use PascalCase, avoid any prefix/suffix denoting the kind of the type such as `I` for interfaces.

```ts
// Bad
interface myObject {}
interface ImyObject {}
type fooType = {};
enum actionsEnum {}

// Good
interface MyObject {}
type Foo = {};
enum Actions {}
```

### Avoid `default` exports

To make refactoring and auto importing easier, always use named exports.

```ts
// Bad
import Stuff from './stuff';

// Good
import {Stuff} from './stuff;
```

### Use `async/await`

`async/await` really simplifies writing asynchronous code. It sometimes gets more verbose, but it really makes it easier to reason above async code.

```ts
// Bad
function myRequest() {
  return new Promise((resolve) => resolve(1));
}

myRequest().then((res) => console.log({res}));

// Better
async function myRequest() {
  return 1;
}

const result = await myRequest();
```

### Use enums

Enums are a very nice feature of TypeScript. I tend to use them instead of string literals for constants that are re-used or given by an API.

```ts
// Bad
const action = api.action;

switch (action) {
  case 'foo': {}
  case 'bar': {}
  default: {}
}

// Better
enum Actions {
  FOO = 'foo'
  BAR = 'bar'
}
const action = api.action;

switch (action) {
  case Actions.FOO: {}
  case Actions.BAR: {}
  default: {}
}
```
