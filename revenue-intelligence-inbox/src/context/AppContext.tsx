// ============================================================
// App State Context — React Context + Reducer
// Single source of truth for all application state
// ============================================================

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  StoredRecord,
  ImportResult,
  Route,
  DeliveryEnvelope,
  DashboardFilters,
} from '../types';
import type { CallPayload, MeetingPayload } from '../types';
import { importBatch, addManualRoute, removeRoute, resetRoutes } from '../core/engine';
import {
  getAllRecords,
  saveAllRecords,
  clearAllRecords,
  saveImportResult,
  getAllImportResults,
  clearImportResults,
  resetAll,
} from '../core/storage';

// ---- State ----
interface AppState {
  records: StoredRecord[];
  importResults: Array<ImportResult & { importedAt: string }>;
  lastImportResult: ImportResult | null;
  isLoading: boolean;
  error: string | null;
  filters: DashboardFilters;
  selectedRecordId: string | null; // "source_type:source_id"
  lastExportAt: string | null;
}

const initialState: AppState = {
  records: [],
  importResults: [],
  lastImportResult: null,
  isLoading: true,
  error: null,
  filters: {},
  selectedRecordId: null,
  lastExportAt: null,
};

// ---- Actions ----
type Action =
  | { type: 'LOAD_COMPLETE'; records: StoredRecord[]; importResults: Array<ImportResult & { importedAt: string }> }
  | { type: 'IMPORT_SUCCESS'; records: StoredRecord[]; result: ImportResult }
  | { type: 'IMPORT_ERROR'; error: string }
  | { type: 'ADD_MANUAL_ROUTE'; sourceKey: string; route: Route }
  | { type: 'REMOVE_ROUTE'; sourceKey: string; route: Route }
  | { type: 'RESET_ROUTES'; sourceKey: string }
  | { type: 'SET_FILTER'; filters: Partial<DashboardFilters> }
  | { type: 'CLEAR_FILTER' }
  | { type: 'SELECT_RECORD'; key: string | null }
  | { type: 'RESET_ALL' }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_EXPORT_AT'; at: string };

// ---- Reducer ----
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_COMPLETE':
      return {
        ...state,
        records: action.records,
        importResults: action.importResults,
        isLoading: false,
      };

    case 'IMPORT_SUCCESS':
      return {
        ...state,
        records: action.records,
        lastImportResult: action.result,
        importResults: [
          ...state.importResults,
          { ...action.result, importedAt: new Date().toISOString() },
        ],
        error: null,
      };

    case 'IMPORT_ERROR':
      return { ...state, error: action.error };

    case 'ADD_MANUAL_ROUTE': {
      const now = new Date().toISOString();
      const updated = state.records.map((r) => {
        const key = `${r.source_type}:${r.source_id}`;
        return key === action.sourceKey ? addManualRoute(r, action.route, now) : r;
      });
      return { ...state, records: updated };
    }

    case 'REMOVE_ROUTE': {
      const now = new Date().toISOString();
      const updated = state.records.map((r) => {
        const key = `${r.source_type}:${r.source_id}`;
        return key === action.sourceKey ? removeRoute(r, action.route, now) : r;
      });
      return { ...state, records: updated };
    }

    case 'RESET_ROUTES': {
      const now = new Date().toISOString();
      const updated = state.records.map((r) => {
        const key = `${r.source_type}:${r.source_id}`;
        return key === action.sourceKey ? resetRoutes(r, now) : r;
      });
      return { ...state, records: updated };
    }

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.filters } };

    case 'CLEAR_FILTER':
      return { ...state, filters: {} };

    case 'SELECT_RECORD':
      return { ...state, selectedRecordId: action.key };

    case 'RESET_ALL':
      return { ...initialState, isLoading: false };

    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };

    case 'SET_EXPORT_AT':
      return { ...state, lastExportAt: action.at };

    default:
      return state;
  }
}

// ---- Context ----
interface AppContextValue {
  state: AppState;
  importData: (json: string) => Promise<void>;
  addRoute: (sourceKey: string, route: Route) => void;
  removeRouteAction: (sourceKey: string, route: Route) => void;
  resetRoutesAction: (sourceKey: string) => void;
  setFilter: (filters: Partial<DashboardFilters>) => void;
  clearFilter: () => void;
  selectRecord: (key: string | null) => void;
  resetApp: () => Promise<void>;
  setExportAt: (at: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load persisted data on mount
  useEffect(() => {
    (async () => {
      try {
        const [records, importResults] = await Promise.all([
          getAllRecords(),
          getAllImportResults(),
        ]);
        dispatch({ type: 'LOAD_COMPLETE', records, importResults });
      } catch (err) {
        console.error('Failed to load from IndexedDB', err);
        dispatch({ type: 'LOAD_COMPLETE', records: [], importResults: [] });
      }
    })();
  }, []);

  // Persist records whenever they change
  useEffect(() => {
    if (!state.isLoading) {
      saveAllRecords(state.records).catch(console.error);
    }
  }, [state.records, state.isLoading]);

  const importData = useCallback(async (json: string) => {
    try {
      let envelope: DeliveryEnvelope;
      try {
        envelope = JSON.parse(json) as DeliveryEnvelope;
      } catch {
        dispatch({ type: 'IMPORT_ERROR', error: 'Invalid JSON: could not parse file' });
        return;
      }

      if (!envelope.batch_id || typeof envelope.revision !== 'number' || !Array.isArray(envelope.records)) {
        dispatch({
          type: 'IMPORT_ERROR',
          error: 'Invalid envelope: missing batch_id, revision, or records array',
        });
        return;
      }

      const now = new Date().toISOString();
      const { records: updatedRecords, result } = importBatch(
        envelope,
        state.records,
        now
      );

      dispatch({ type: 'IMPORT_SUCCESS', records: updatedRecords, result });
      await saveImportResult(result, now);
    } catch (err) {
      dispatch({
        type: 'IMPORT_ERROR',
        error: `Import failed: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }, [state.records]);

  const addRoute = useCallback((sourceKey: string, route: Route) => {
    dispatch({ type: 'ADD_MANUAL_ROUTE', sourceKey, route });
  }, []);

  const removeRouteAction = useCallback((sourceKey: string, route: Route) => {
    dispatch({ type: 'REMOVE_ROUTE', sourceKey, route });
  }, []);

  const resetRoutesAction = useCallback((sourceKey: string) => {
    dispatch({ type: 'RESET_ROUTES', sourceKey });
  }, []);

  const setFilter = useCallback((filters: Partial<DashboardFilters>) => {
    dispatch({ type: 'SET_FILTER', filters });
  }, []);

  const clearFilter = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTER' });
  }, []);

  const selectRecord = useCallback((key: string | null) => {
    dispatch({ type: 'SELECT_RECORD', key });
  }, []);

  const resetApp = useCallback(async () => {
    await resetAll();
    dispatch({ type: 'RESET_ALL' });
  }, []);

  const setExportAt = useCallback((at: string) => {
    dispatch({ type: 'SET_EXPORT_AT', at });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        importData,
        addRoute,
        removeRouteAction,
        resetRoutesAction,
        setFilter,
        clearFilter,
        selectRecord,
        resetApp,
        setExportAt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ---- Selector helpers ----
export function getPersonList(records: StoredRecord[]): Array<{ email: string; type: 'rep' | 'organizer'; name: string | null }> {
  const map = new Map<string, { email: string; type: 'rep' | 'organizer'; name: string | null }>();
  for (const r of records) {
    if (r.source_type === 'call') {
      const p = r.payload as CallPayload;
      if (p.rep_email && !map.has(`rep:${p.rep_email}`)) {
        map.set(`rep:${p.rep_email}`, { email: p.rep_email, type: 'rep', name: p.rep_name });
      }
    } else {
      const p = r.payload as MeetingPayload;
      if (p.organizer_email && !map.has(`org:${p.organizer_email}`)) {
        map.set(`org:${p.organizer_email}`, { email: p.organizer_email, type: 'organizer', name: null });
      }
    }
  }
  return Array.from(map.values());
}
