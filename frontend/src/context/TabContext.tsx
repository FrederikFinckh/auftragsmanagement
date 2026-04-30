import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Auftrag } from '../types/auftrag';

// Tab-Datenstrukturen
export interface AuftragTab {
  auftragId: number;
  auftragsnummer: string;
}

export interface InstanzTab {
  instanzId: number;
  nummer: number;
}

// Context-Typ
interface TabContextType {
  // Auftrag-Tabs (obere Zeile)
  auftragTabs: AuftragTab[];
  aktiverAuftragTabId: number | null;
  openAuftragTab: (auftrag: Auftrag) => void;
  closeAuftragTab: (auftragId: number) => void;
  setAktiverAuftragTab: (auftragId: number) => void;

  // Instanz-Tabs (untere Zeile, pro Auftrag)
  instanzTabs: Map<number, InstanzTab[]>;
  aktiverInstanzTabId: Map<number, number | null>;
  openInstanzTab: (auftragId: number, instanzId: number, nummer: number) => void;
  closeInstanzTab: (auftragId: number, instanzId: number) => void;
  setAktiverInstanzTab: (auftragId: number, instanzId: number | null) => void;

  // Hilfsfunktion: Aktuelle Instanz-Tabs für den aktiven Auftrag
  aktuelleInstanzTabs: InstanzTab[];
  aktuelleAktiverInstanzTabId: number | null;
}

const TabContext = createContext<TabContextType | null>(null);

// Hook für den Tab-Context
export function useTabContext() {
  const ctx = useContext(TabContext);
  if (!ctx) {
    throw new Error('useTabContext muss innerhalb eines TabProviders verwendet werden');
  }
  return ctx;
}

// Provider-Komponente
export function TabProvider({ children }: { children: ReactNode }) {
  // Auftrag-Tabs
  const [auftragTabs, setAuftragTabs] = useState<AuftragTab[]>([]);
  const [aktiverAuftragTabId, setAktiverAuftragTabId] = useState<number | null>(null);

  // Instanz-Tabs (Map: auftragId → InstanzTab[])
  const [instanzTabs, setInstanzTabs] = useState<Map<number, InstanzTab[]>>(new Map());
  const [aktiverInstanzTabId, setAktiverInstanzTabIdMap] = useState<Map<number, number | null>>(new Map());

  // Auftrag-Tab öffnen
  const openAuftragTab = useCallback((auftrag: Auftrag) => {
    setAuftragTabs((prev) => {
      const exists = prev.some((t) => t.auftragId === auftrag.id);
      if (exists) return prev;
      return [...prev, { auftragId: auftrag.id, auftragsnummer: auftrag.auftragsnummer }];
    });
    setAktiverAuftragTabId(auftrag.id);
  }, []);

  // Auftrag-Tab schließen
  const closeAuftragTab = useCallback((auftragId: number) => {
    setAuftragTabs((prev) => {
      const idx = prev.findIndex((t) => t.auftragId === auftragId);
      if (idx === -1) return prev;

      const next = prev.filter((t) => t.auftragId !== auftragId);

      // Wenn der geschlossene Tab aktiv war, den vorherigen oder nächsten aktivieren
      setAktiverAuftragTabId((currentActive) => {
        if (currentActive !== auftragId) return currentActive;
        if (next.length === 0) return null;
        // Nachbar-Tab aktivieren
        const newIdx = Math.min(idx, next.length - 1);
        return next[newIdx].auftragId;
      });

      return next;
    });

    // Instanz-Tabs für diesen Auftrag entfernen
    setInstanzTabs((prev) => {
      const next = new Map(prev);
      next.delete(auftragId);
      return next;
    });
    setAktiverInstanzTabIdMap((prev) => {
      const next = new Map(prev);
      next.delete(auftragId);
      return next;
    });
  }, []);

  // Aktiven Auftrag-Tab setzen
  const setAktiverAuftragTab = useCallback((auftragId: number) => {
    setAktiverAuftragTabId(auftragId);
  }, []);

  // Instanz-Tab öffnen
  const openInstanzTab = useCallback((auftragId: number, instanzId: number, nummer: number) => {
    setInstanzTabs((prev) => {
      const current = prev.get(auftragId) || [];
      const exists = current.some((t) => t.instanzId === instanzId);
      if (exists) return prev;
      const next = new Map(prev);
      next.set(auftragId, [...current, { instanzId, nummer }]);
      return next;
    });
    setAktiverInstanzTabIdMap((prev) => {
      const next = new Map(prev);
      next.set(auftragId, instanzId);
      return next;
    });
  }, []);

  // Instanz-Tab schließen
  const closeInstanzTab = useCallback((auftragId: number, instanzId: number) => {
    setInstanzTabs((prev) => {
      const current = prev.get(auftragId) || [];
      const idx = current.findIndex((t) => t.instanzId === instanzId);
      if (idx === -1) return prev;

      const nextTabs = current.filter((t) => t.instanzId !== instanzId);
      const next = new Map(prev);
      next.set(auftragId, nextTabs);
      return next;
    });

    // Wenn der geschlossene Tab aktiv war, auf Übersicht (null) oder Nachbar setzen
    setAktiverInstanzTabIdMap((prev) => {
      const currentActive = prev.get(auftragId);
      if (currentActive !== instanzId) return prev;

      const currentTabs = instanzTabs.get(auftragId) || [];
      const idx = currentTabs.findIndex((t) => t.instanzId === instanzId);
      const remaining = currentTabs.filter((t) => t.instanzId !== instanzId);

      const next = new Map(prev);
      if (remaining.length === 0) {
        next.set(auftragId, null); // Zurück zur Übersicht
      } else {
        const newIdx = Math.min(idx, remaining.length - 1);
        next.set(auftragId, remaining[newIdx].instanzId);
      }
      return next;
    });
  }, [instanzTabs]);

  // Aktiven Instanz-Tab setzen (null = Übersicht)
  const setAktiverInstanzTab = useCallback((auftragId: number, instanzId: number | null) => {
    setAktiverInstanzTabIdMap((prev) => {
      const next = new Map(prev);
      next.set(auftragId, instanzId);
      return next;
    });
  }, []);

  // Abgeleitete Werte für den aktiven Auftrag
  const aktuelleInstanzTabs = aktiverAuftragTabId !== null
    ? (instanzTabs.get(aktiverAuftragTabId) || [])
    : [];

  const aktuelleAktiverInstanzTabId = aktiverAuftragTabId !== null
    ? (aktiverInstanzTabId.get(aktiverAuftragTabId) || null)
    : null;

  return (
    <TabContext.Provider
      value={{
        auftragTabs,
        aktiverAuftragTabId,
        openAuftragTab,
        closeAuftragTab,
        setAktiverAuftragTab,
        instanzTabs,
        aktiverInstanzTabId,
        openInstanzTab,
        closeInstanzTab,
        setAktiverInstanzTab,
        aktuelleInstanzTabs,
        aktuelleAktiverInstanzTabId,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}
