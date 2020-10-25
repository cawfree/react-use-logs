import React, { useState } from "react";
import PropTypes from "prop-types";
import deepmerge from "deepmerge";
import { nanoid } from "nanoid/non-secure";

import { loglevel } from '../constants';
import { LogLevelContext, LogsMiddleware } from "../contexts";
import type { LogLevelContextProps } from "../contexts";
import { useLogLevelContext } from "../hooks";

export type LogLevelProviderProps = {
  children: JSX.Element | JSX.Element[];
  levels: string[] | undefined;
  level: string | undefined;
  middleware: LogsMiddleware[] | undefined;
  strict: boolean;
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
  strict: maybeStrict,
  ...extras
}: LogLevelProviderProps): JSX.Element {
  const [id] = useState(nanoid);
  const { middleware: maybeMiddleware, levels: maybeLevels } = extras;
  const context = useLogLevelContext();
  const { disabled: parentIsDisabled, level: parentLevel, strict: parentIsStrict } = context;
  const value = deepmerge(
    context,
    Object.fromEntries(
      Object.entries(extras).filter(
        ([k, v]) => supportedProps.indexOf(k) >= 0 && v !== undefined
      )
    )
  ) as LogLevelContextProps;
  const {
    levels: maybeDuplicates,
    parentId,
    middleware,
    disabled: maybeDisabled,
    level: maybeLevel,
    ...extraValues
  } = value;
  const inheritedLevels = maybeDuplicates.filter(
    (e, i, orig) => orig.indexOf(e) === i
  ) as string[];
  const isTopLevel = parentId === null;

  const strict = maybeStrict !== undefined ? !!maybeStrict : parentIsStrict;
  const levels = isTopLevel && Array.isArray(maybeLevels) ? maybeLevels : inheritedLevels;
  const selectedLevel = levels.indexOf(maybeLevel) < 0 ? levels[0] : maybeLevel;

  if (selectedLevel !== maybeLevel) {
    loglevel.error(
      `react-use-logs: Encountered "${maybeLevel}", expected one of ${levels.join(',')}. Falling back to ${selectedLevel}.`
    );
  }
  const level = levels.indexOf(parentLevel) > levels.indexOf(maybeLevel) ? parentLevel : maybeLevel;
  return (
    <LogLevelContext.Provider
      {...extras}
      value={{
        ...extraValues,
        parentId: id,
        levels,
        middleware:
          isTopLevel && Array.isArray(maybeMiddleware)
            ? maybeMiddleware
            : middleware,
        disabled: !strict ? maybeDisabled : (parentIsDisabled || maybeDisabled),
        level: !strict ? maybeLevel : level,
        strict,
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
  strict: PropTypes.bool,
};

LogLevelProvider.defaultProps = {
  levels: undefined,
  level: undefined,
  middleware: undefined,
  disabled: undefined,
  strict: undefined,
};

export default LogLevelProvider;
