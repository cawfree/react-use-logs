import { createContext } from 'react';

import { LogLevelContext } from '.';

import { LogLevel } from '../middleware';


export type LogsMiddleware = (level: string, messages: unknown[], next: () => void) => unknown;

export const defaultLevels = Object.freeze([
  "trace",
  "debug",
  "info",
  "warn",
  "error",
]) as string[];

export const [defaultLevel] = defaultLevels;

export const defaultMiddleware = Object.freeze([LogLevel]) as LogsMiddleware[];

export type LogLevelContextProps = {
  readonly levels: string[];
  readonly level: string;
  readonly middleware: LogsMiddleware[];
  readonly disabled: boolean;
  readonly parentId: string | null;
  readonly strict: boolean;
};

export const defaultContext = Object.freeze({
  levels: defaultLevels,
  level: defaultLevel,
  middleware: defaultMiddleware,
  disabled: false,
  parentId: null,
  strict: true,
}) as LogLevelContextProps;

export default createContext(defaultContext);