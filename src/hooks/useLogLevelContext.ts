import { useContext } from 'react';

import { LogLevelContext } from '../contexts';
import type { LogLevelContextProps } from '../contexts';

export default function useLogLevelContext(): LogLevelContextProps {
  return useContext(LogLevelContext);
}