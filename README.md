# react-use-logs
⚛️ 🖨️ A hierarchy sensitive, middleware-defined `console.log` for [**React**](https://reactjs.org) and [**React Native**](https://reactnative.dev). ✨

### Table of Contents
  - [1.0 Getting Started](#-getting-started)
  - 2.0 Usage
    - 2.1 Basic Example
    - 2.2 Middleware
      - 2.2.1 Nested Middleware
    - 2.3 Custom Types
    - 2.4 Filtering Logs
      - 2.4.1 Strict Mode
  - 3.0 License


### 🔥 Features
  - 🔋 Batteries included.
  - 🦄 Declare custom log types.
  - 👪 Supports JSX-scoped filtering and functionality.

## 🚀 Getting Started

Using [**Yarn**](https://yarnpkg.com):

```sh
yarn add react-use-logs
```

## ✏️ Usage

### 👶 2.1 Basic Example
By default, `react-use-logs` exports a [`useLogs()`](./src/hooks/useLogs.ts) [**hook**](https://reactjs.org/docs/hooks-intro.html), which works pretty much just like your standard `window.console` object:

```javascript
import { useLogs } from "react-use-logs";

export default () => {
  const logs = useLogs();
  return <div onPress={() => logs.debug("Normal", "Old", { console: true })} />
};
```

### 🏹 2.2 Middleware
It's possible to define custom handlers for particular calls to `useLogs()`. First, wrap your application in a [`<LogsProvider />`](./src/providers/LogLevelProvider):

```javascript
import React from 'react';
import LogsProvider from 'react-use-logs';

export default () => (
  <LogsProvider>
    {/* TODO: awesome app here */}
  </LogsProvider>
);
```

Once this is done, you can pass a custom `middleware` prop, which is an array that accepts [**Middleware**](./src/contexts/LogLevelContext.ts) functions which take the following form:

```javascript
function someMiddleware(level: string, messages: string[], next: () => void) {
  // Do something with the message.
  alert(...messages);
  // Allow the next middleware in the chain to execute:
  next();
}
```

Next, you can use the middleware as follows:

```javascript
import React from 'react';
import LogsProvider from 'react-use-logs';

import { someMiddleware, someOtherMiddleware } from './middleware';

export default () => (
  <LogsProvider middleware={[someMiddleware, someOtherMiddleware]}>
    {/* TODO: awesome app here */}
  </LogsProvider>
);
```
At this point any call to `logs.debug`, for example, will instead get passed through the middleware chain.

> **Notice**: By default, a `LogsProvider` will use the default builtin logging mechanism, the `LogLevel` middleware. This is based on [`loglevel`](https://github.com/pimterry/loglevel). However, if you override the `middleware` prop for a root-level `LogsProvider`, this will _not_ be included by default. You can reintroduce the standard console behaviour by including the `LogLevel` middleware exported by the library.

#### 👪 2.2.1 Nested Middleware

It's also possible to declare specific middleware for different parts of the DOM tree. This is achieved by nesting a child `LogsProvider`, and declaring an additional `middleware` prop. The middleware supplied here will be _appended_ to the global middleware.

```javascript
import React from 'react';
import LogsProvider, { LogLevel } from 'react-use-logs';

import { someMiddleware, someOtherMiddleware } from './middleware';

export default () => (
  <LogsProvider middleware={[LogLevel, someMiddleware]}>
    <LogsProvider middleware={[someOtherMiddleware]}>
      {/* TODO: some special logging route here */}
    </LogsProvider>
    {/* TODO: awesome app here */}
  </LogsProvider>
);
```

### 🦄 2.3 Custom Types
By default, `react-use-logs` uses the existing [window.console](https://developer.mozilla.org/en-US/docs/Web/API/Window/console) export format, i.e:

```javascript
import { useLogs } from "react-use-logs";

const logs = useLogs();
logs.trace("");
logs.debug("");
logs.info("");
logs.warn("");
logs.error("");
```

By using a custom [`LogsProvider`](./src/providers/LogLevelProvider.ts), you can specify an additional `levels` prop to declare custom log levels:

```javascript
import React from 'react';
import LogsProvider from 'react-use-logs';

export default () => (
  <LogsProvider levels={["good", "bad", "ugly"]}>
    {/* TODO: awesome app here */}
  </LogsProvider>
);
```

This will result in `useLogs` returning an object like so:

```javascript
import { useLogs } from "react-use-logs";

const logs = useLogs();
logs.good("");
logs.bad("");
logs.ugly("");
```

> **Notice** Similar to `middleware`, for a root-level `LogsProvider` a defined `levels` prop will override the original default levels. For nested providers, the contents of the `levels` will be _appended_ to the inherited ones.

### 2.4 🤫 Filtering Logs

You can specify a `level` prop to a `LogsProvider` to declare the minimum actionable level, which obeys prioritized order. In the example below, it is only possible for `warn` and `error` events to be executed; all other invocations will be _ignored_.

```javascript
import React from 'react';
import LogsProvider from 'react-use-logs';

export default () => (
  <LogsProvider level="warn">
    {/* TODO: silent app here */}
  </LogsProvider>
);
```

In addition, you can disable logging altogether for any child component by passing a `disabled` prop:

```javascript
import React from 'react';
import LogsProvider from 'react-use-logs';

export default () => (
  <LogsProvider disabled>
    {/* TODO: silent app here */}
  </LogsProvider>
);
```

#### 💢 2.4.1 Strict Mode

By default, `LogsProvider`s operate in **Strict Mode**. This has the following effect:
  - A `disabled` `LogsProvider` will disable logging for **all** children in the tree.
  - The selected `level` of the `LogsProvider` will serve as the minimum log level for nested children.

Although deterministic, this is not useful for debugging. This is because it is sometimes useful to temporarily activate logging for select portion of a silenced log tree. To enable nested `LogProvider`s to ignore a parent's configuration, you can disable strict mode by passing a `strict={false}` prop:

```javascript
<>
  <Logs disabled strict={false}>
    {/* because the parent is not strict, we can enable the child tree */}
    <Logs disabled={false}>
    </Logs>
  </Logs>
  <Logs level="warn" strict={false}>
    {/* because the parent is not strict, we can log more granular information */}
    <Logs level="trace">
    </Logs>
  </Logs>
</>
```

## ✌️ License
[**MIT**](./LICENSE)
