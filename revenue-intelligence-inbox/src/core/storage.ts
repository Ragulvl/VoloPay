// ============================================================
// IndexedDB Persistence Layer
// Stores: records, import results, app settings
// ============================================================

import { openDB, type IDBPDatabase } from 'idb';
import type { StoredRecord, ImportResult } from '../types';

const DB_NAME = 'revenue-intelligence-inbox';
const DB_VERSION = 1;

interface RIISchema {
  records: {
    key: string; // "source_type:source_id"
    value: StoredRecord;
  };
  importResults: {
    key: number; // auto-increment
    value: ImportResult & { importedAt: string };
  };
  settings: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<RIISchema>> | null = null;

function getDB(): Promise<IDBPDatabase<RIISchema>> {
  if (!dbPromise) {
    dbPromise = openDB<RIISchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('records')) {
          db.createObjectStore('records');
        }
        if (!db.objectStoreNames.contains('importResults')) {
          db.createObjectStore('importResults', { autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

export function recordKey(r: { source_type: string; source_id: string }): string {
  return `${r.source_type}:${r.source_id}`;
}

// ---- Records ----
export async function getAllRecords(): Promise<StoredRecord[]> {
  const db = await getDB();
  return db.getAll('records');
}

export async function saveRecord(record: StoredRecord): Promise<void> {
  const db = await getDB();
  await db.put('records', record, recordKey(record));
}

export async function saveAllRecords(records: StoredRecord[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('records', 'readwrite');
  await Promise.all(records.map((r) => tx.store.put(r, recordKey(r))));
  await tx.done;
}

export async function clearAllRecords(): Promise<void> {
  const db = await getDB();
  await db.clear('records');
}

// ---- Import Results ----
export async function saveImportResult(
  result: ImportResult,
  importedAt: string
): Promise<void> {
  const db = await getDB();
  await db.add('importResults', { ...result, importedAt });
}

export async function getAllImportResults(): Promise<
  Array<ImportResult & { importedAt: string }>
> {
  const db = await getDB();
  return db.getAll('importResults');
}

export async function clearImportResults(): Promise<void> {
  const db = await getDB();
  await db.clear('importResults');
}

// ---- Settings ----
export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  return db.get('settings', key) as Promise<T | undefined>;
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB();
  await db.put('settings', value, key);
}

// ---- Full reset ----
export async function resetAll(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['records', 'importResults', 'settings'], 'readwrite');
  await Promise.all([
    tx.objectStore('records').clear(),
    tx.objectStore('importResults').clear(),
    tx.objectStore('settings').clear(),
  ]);
  await tx.done;
}
