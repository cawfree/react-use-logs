import loglevel, { LogLevelDesc } from 'loglevel';

const log = loglevel.getLogger('react-use-logs');

log.setLevel(0 as LogLevelDesc);

export default log;
