import React, { useState } from 'react';
import PropTypes from 'prop-types';
import deepmerge from 'deepmerge';
import { nanoid } from 'nanoid/non-secure';

import { LogLevelContext, LogsMiddleware } from '../contexts';
import type { LogLevelContextProps } from '../contexts';
import { useLogLevelContext } from '../hooks';

export type LogLevelProviderProps = {
  children: JSX.Element | JSX.Element[];
  levels: string[] | undefined;
  level: string | undefined;
  middleware: LogsMiddleware[] | undefined;
};

// TODO: Move this to context.
const supportedProps = Object.freeze([
  "levels",
  "level",
  "middleware",
  "disabled",
]) as string[];

// TODO: Proper of level.
function LogLevelProvider({
  children,
  ...extras
}: LogLevelProviderProps): JSX.Element {
  const [id] = useState(nanoid);
  const { middleware: maybeMiddleware, levels: maybeLevels } = extras;
  const value = deepmerge(
    useLogLevelContext(),
    Object.fromEntries(
      Object.entries(extras).filter(
        ([k, v]) => supportedProps.indexOf(k) >= 0 && v !== undefined
      )
    )
  ) as LogLevelContextProps;
  const { levels: maybeDuplicates, parentId, middleware, ...extraValues } = value;
  const levels = maybeDuplicates.filter(
    (e, i, orig) => orig.indexOf(e) === i
  ) as string[];
  const isTopLevel = parentId === null;
  return (
    <LogLevelContext.Provider
      {...extras}
      value={{
        ...extraValues,
        parentId: id,
        middleware: isTopLevel && Array.isArray(maybeMiddleware) ? maybeMiddleware : middleware,
        levels: isTopLevel && Array.isArray(maybeLevels) ? maybeLevels: levels,
      }}
    >
      {children}
    </LogLevelContext.Provider>
  );
}

LogLevelProvider.propTypes = {
  levels: PropTypes.arrayOf(PropTypes.string),
  level: PropTypes.string,
  middleware: PropTypes.arrayOf(PropTypes.func),
  disabled: PropTypes.bool,
};

LogLevelProvider.defaultProps = {
  levels: undefined,
  level: undefined,
  middleware: undefined,
  disabled: false,
};

export default LogLevelProvider;