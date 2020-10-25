import loglevel, { LogLevelDesc } from 'loglevel';

import type { LogsMiddleware } from '../contexts';

const log = loglevel.getLogger('react-use-logs');
log.setLevel(0 as LogLevelDesc);

export default function LogLevel(level: string, messages: string[], next: () => unknown): void {
  if (typeof log[level] === 'function') {
    log[level].apply(this, ...messages);
  }
  next();
}