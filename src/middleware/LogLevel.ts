import { loglevel } from '../constants';
import type { LogsMiddleware } from '../contexts';

export default function LogLevel(level: string, messages: string[], next: () => unknown): void {
  if (typeof loglevel[level] === 'function') {
    loglevel[level].call(this, ...messages);
  }
  next();
}
