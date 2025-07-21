import { TransactionLogEntry } from './types';

const logs: TransactionLogEntry[] = [];

export function addLog(entry: TransactionLogEntry) {
  logs.push(entry);
}

export function getLogs(): TransactionLogEntry[] {
  return logs;
} 