import { useState, useCallback } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { LogLevelContextProps, LogsMiddleware } from '../contexts';
import { useLogLevelContext } from '.';

const executeMiddlewareThunk = (middleware: LogsMiddleware[]) => async (level: string, ...messages: unknown[]) => {
  for await (let layer of middleware) {
    const result = await new Promise(async (resolve) => {
      try { await layer(level, messages, resolve); } catch (e) { resolve(e); }
    });
    if (result instanceof Error) 
      break;
  }
};

export type useLogsResult = {
  [name: string]: (...messages : unknown[]) => void;
};

export default function useLogs(): useLogsResult {
  const { levels, level, middleware, disabled, parentId } = useLogLevelContext();
  const createLogs = useCallback(
    ({ levels, level, middleware, disabled }: LogLevelContextProps) => {
      const executeMiddleware = executeMiddlewareThunk(middleware);
      return levels.reduce(
        (obj, currentLevel) => {
          obj[currentLevel] = (...messages: unknown[]) => {
            if (!disabled && levels.indexOf(currentLevel) >= levels.indexOf(level)) {
              executeMiddleware(currentLevel, messages);
            }
          };
          return obj;
        },
        {},
      )
    },
    []
  );
  const [logs, setLogs] = useState(() =>
    createLogs({ levels, level, middleware, disabled, parentId })
  );
  useDeepCompareEffect(() => {
    setLogs(createLogs({ levels, level, middleware, disabled, parentId }));
  }, [levels, level, middleware, parentId, createLogs, setLogs]);

  return logs;
}