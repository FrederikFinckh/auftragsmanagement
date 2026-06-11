import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Auftrag } from '../types/auftrag';
import type { Materialnummer } from '../types/material';

// Tab-Datenstrukturen
export interface AuftragTab {
  type: 'auftrag';
  auftragId: number;
  auftragsnummer: string;
}

export interface MaterialTabData {
  type: 'material';
  tabId: string;
  materialId: number | null;
  mode: 'create' | 'edit' | 'copy';
  nummer: string;
}

export interface InstanzTab {
  instanzId: number;
  nummer: number;
}

// Vereinigter Tab-Typ für die obere Zeile
export type TopTab = AuftragTab | MaterialTabData;

// Context-Typ
interface TabContextType {
  // Obere Tab-Zeile (Auftrag + Material gemischt)
  topTabs: TopTab[];
  aktiverTopTabId: string | null;
  openAuftragTab: (auftrag: Auftrag) => void;
  openMaterialTab: (mode: 'create' | 'edit' | 'copy', material?: Materialnummer) => void;
  closeTopTab: (tabId: string) => void;
  setAktiverTopTab: (tabId: string) => void;

  // Instanz-Tabs (untere Zeile, pro Auftrag)
  instanzTabs: Map<number, InstanzTab[]>;
  aktiverInstanzTabId: Map<number, number | null>;
  openInstanzTab: (auftragId: number, instanzId: number, nummer: number) => void;
  closeInstanzTab: (auftragId: number, instanzId: number) => void;
  setAktiverInstanzTab: (auftragId: number, instanzId: number | null) => void;

  // Hilfsfunktionen
  aktuelleInstanzTabs: InstanzTab[];
  aktuelleAktiverInstanzTabId: number | null;
  aktiverAuftragTabId: number | null;
  isMaterialTabActive: boolean;
  aktiveMaterialTab: MaterialTabData | null;

  // Benachrichtigung bei Material-Änderungen
  materialSavedVersion: number;
  notifyMaterialSaved: () => void;
}

const TabContext = createContext<TabContextType | null>(null);

export function useTabContext() {
  const ctx = useContext(TabContext);
  if (!ctx) {
    throw new Error('useTabContext muss innerhalb eines TabProviders verwendet werden');
  }
  return ctx;
}

let materialTabCounter = 0;

function generateMaterialTabId(): string {
  materialTabCounter += 1;
  return `material-${materialTabCounter}`;
}

export function TabProvider({ children }: { children: ReactNode }) {
  const [topTabs, setTopTabs] = useState<TopTab[]>([]);
  const [aktiverTopTabId, setAktiverTopTabId] = useState<string | null>(null);

  const [instanzTabs, setInstanzTabs] = useState<Map<number, InstanzTab[]>>(new Map());
  const [aktiverInstanzTabId, setAktiverInstanzTabIdMap] = useState<Map<number, number | null>>(new Map());

  const [materialSavedVersion, setMaterialSavedVersion] = useState(0);
  const notifyMaterialSaved = useCallback(() => {
    setMaterialSavedVersion((v) => v + 1);
  }, []);

  // Auftrag-Tab öffnen
  const openAuftragTab = useCallback((auftrag: Auftrag) => {
    const tabId = `auftrag-${auftrag.id}`;
    setTopTabs((prev) => {
      const exists = prev.some((t) => t.type === 'auftrag' && t.auftragId === auftrag.id);
      if (exists) return prev;
      const newTab: AuftragTab = { type: 'auftrag', auftragId: auftrag.id, auftragsnummer: auftrag.auftragsnummer };
      return [...prev, newTab];
    });
    setAktiverTopTabId(tabId);
  }, []);

  // Material-Tab öffnen
  const openMaterialTab = useCallback((mode: 'create' | 'edit' | 'copy', material?: Materialnummer) => {
    if (mode === 'edit' && material) {
      const tabId = `material-edit-${material.id}`;
      setTopTabs((prev) => {
        const exists = prev.some((t) => t.type === 'material' && t.tabId === tabId);
        if (exists) return prev;
        const newTab: MaterialTabData = {
          type: 'material',
          tabId,
          materialId: material.id,
          mode: 'edit',
          nummer: material.nummer,
        };
        return [...prev, newTab];
      });
      setAktiverTopTabId(tabId);
    } else {
      const tabId = generateMaterialTabId();
      const newTab: MaterialTabData = {
        type: 'material',
        tabId,
        materialId: mode === 'copy' && material ? material.id : null,
        mode: mode === 'copy' ? 'copy' : 'create',
        nummer: mode === 'copy' && material ? material.nummer : '',
      };
      setTopTabs((prev) => [...prev, newTab]);
      setAktiverTopTabId(tabId);
    }
  }, []);

  // Tab schließen (obere Zeile)
  const closeTopTab = useCallback((tabId: string) => {
    setTopTabs((prev) => {
      const idx = prev.findIndex((t) =>
        t.type === 'auftrag' ? `auftrag-${t.auftragId}` === tabId : t.tabId === tabId
      );
      if (idx === -1) return prev;

      const closed = prev[idx];
      const next = prev.filter((t) =>
        t.type === 'auftrag' ? `auftrag-${t.auftragId}` !== tabId : t.tabId !== tabId
      );

      setAktiverTopTabId((currentActive) => {
        if (currentActive !== tabId) return currentActive;
        if (next.length === 0) return null;
        const newIdx = Math.min(idx, next.length - 1);
        const neighbor = next[newIdx];
        return neighbor.type === 'auftrag' ? `auftrag-${neighbor.auftragId}` : neighbor.tabId;
      });

      // Wenn Auftrag-Tab geschlossen: Instanz-Tabs aufräumen
      if (closed.type === 'auftrag') {
        const auftragId = closed.auftragId;
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
      }

      return next;
    });
  }, []);

  // Aktiven Top-Tab setzen
  const setAktiverTopTab = useCallback((tabId: string) => {
    setAktiverTopTabId(tabId);
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

    setAktiverInstanzTabIdMap((prev) => {
      const currentActive = prev.get(auftragId);
      if (currentActive !== instanzId) return prev;

      const currentTabs = instanzTabs.get(auftragId) || [];
      const idx = currentTabs.findIndex((t) => t.instanzId === instanzId);
      const remaining = currentTabs.filter((t) => t.instanzId !== instanzId);

      const next = new Map(prev);
      if (remaining.length === 0) {
        next.set(auftragId, null);
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

  // Abgeleitete Werte
  const aktiverAuftragTab = topTabs.find(
    (t) => t.type === 'auftrag' && `auftrag-${t.auftragId}` === aktiverTopTabId
  ) as AuftragTab | undefined;

  const aktiverAuftragTabId = aktiverAuftragTab?.auftragId ?? null;

  const isMaterialTabActive = topTabs.some(
    (t) => t.type === 'material' && t.tabId === aktiverTopTabId
  );

  const aktiveMaterialTab = topTabs.find(
    (t) => t.type === 'material' && t.tabId === aktiverTopTabId
  ) as MaterialTabData | undefined ?? null;

  const aktuelleInstanzTabs = aktiverAuftragTabId !== null
    ? (instanzTabs.get(aktiverAuftragTabId) || [])
    : [];

  const aktuelleAktiverInstanzTabId = aktiverAuftragTabId !== null
    ? (aktiverInstanzTabId.get(aktiverAuftragTabId) || null)
    : null;

  return (
    <TabContext.Provider
      value={{
        topTabs,
        aktiverTopTabId,
        openAuftragTab,
        openMaterialTab,
        closeTopTab,
        setAktiverTopTab,
        instanzTabs,
        aktiverInstanzTabId,
        openInstanzTab,
        closeInstanzTab,
        setAktiverInstanzTab,
        aktuelleInstanzTabs,
        aktuelleAktiverInstanzTabId,
        aktiverAuftragTabId,
        isMaterialTabActive,
        aktiveMaterialTab,
        materialSavedVersion,
        notifyMaterialSaved,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}
