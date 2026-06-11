import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Auftrag } from '../types/auftrag';
import type { Materialnummer } from '../types/material';

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

export interface InstanzTabData {
  type: 'instanz';
  tabId: string;
  instanzId: number;
  nummer: number;
  auftragsnummer: string;
  auftragId: number;
}

export type TopTab = AuftragTab | MaterialTabData | InstanzTabData;

interface TabContextType {
  topTabs: TopTab[];
  aktiverTopTabId: string | null;
  openAuftragTab: (auftrag: Auftrag) => void;
  openInstanzTab: (auftrag: Auftrag, instanzId: number, nummer: number) => void;
  openMaterialTab: (mode: 'create' | 'edit' | 'copy', material?: Materialnummer) => void;
  closeTopTab: (tabId: string) => void;
  setAktiverTopTab: (tabId: string) => void;
  aktiverInstanzTabId: number | null;
  isMaterialTabActive: boolean;
  aktiveMaterialTab: MaterialTabData | null;
  materialSavedVersion: number;
  notifyMaterialSaved: () => void;
  instanzChangedVersion: number;
  notifyInstanzChanged: () => void;
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

  const [materialSavedVersion, setMaterialSavedVersion] = useState(0);
  const notifyMaterialSaved = useCallback(() => {
    setMaterialSavedVersion((v) => v + 1);
  }, []);

  const [instanzChangedVersion, setInstanzChangedVersion] = useState(0);
  const notifyInstanzChanged = useCallback(() => {
    setInstanzChangedVersion((v) => v + 1);
  }, []);

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

  const openInstanzTab = useCallback((auftrag: Auftrag, instanzId: number, nummer: number) => {
    const tabId = `instanz-${instanzId}`;
    setTopTabs((prev) => {
      const exists = prev.some((t) => t.type === 'instanz' && t.instanzId === instanzId);
      if (exists) return prev;
      const auftragExists = prev.some((t) => t.type === 'auftrag' && t.auftragId === auftrag.id);
      const newTab: InstanzTabData = {
        type: 'instanz',
        tabId,
        instanzId,
        nummer,
        auftragsnummer: auftrag.auftragsnummer,
        auftragId: auftrag.id,
      };
      if (auftragExists) {
        return [...prev, newTab];
      }
      const auftragTab: AuftragTab = { type: 'auftrag', auftragId: auftrag.id, auftragsnummer: auftrag.auftragsnummer };
      return [...prev, auftragTab, newTab];
    });
    setAktiverTopTabId(tabId);
  }, []);

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

  const closeTopTab = useCallback((tabId: string) => {
    setTopTabs((prev) => {
      const idx = prev.findIndex((t) =>
        t.type === 'auftrag' ? `auftrag-${t.auftragId}` === tabId :
        t.type === 'instanz' ? t.tabId === tabId :
        t.tabId === tabId
      );
      if (idx === -1) return prev;

      const next = prev.filter((t) =>
        t.type === 'auftrag' ? `auftrag-${t.auftragId}` !== tabId :
        t.type === 'instanz' ? t.tabId !== tabId :
        t.tabId !== tabId
      );

      setAktiverTopTabId((currentActive) => {
        if (currentActive !== tabId) return currentActive;
        if (next.length === 0) return null;
        const newIdx = Math.min(idx, next.length - 1);
        const neighbor = next[newIdx];
        return neighbor.type === 'auftrag' ? `auftrag-${neighbor.auftragId}` : neighbor.tabId;
      });

      return next;
    });
  }, []);

  const setAktiverTopTab = useCallback((tabId: string) => {
    setAktiverTopTabId(tabId);
  }, []);

  const aktiverTopTab = topTabs.find((t) =>
    t.type === 'auftrag' ? `auftrag-${t.auftragId}` === aktiverTopTabId :
    t.type === 'instanz' ? t.tabId === aktiverTopTabId :
    t.tabId === aktiverTopTabId
  );

  const aktiverInstanzTabId = aktiverTopTab?.type === 'instanz' ? aktiverTopTab.instanzId : null;

  const isMaterialTabActive = aktiverTopTab?.type === 'material';

  const aktiveMaterialTab = (aktiverTopTab?.type === 'material' ? aktiverTopTab : null) as MaterialTabData | null;

  return (
    <TabContext.Provider
      value={{
        topTabs,
        aktiverTopTabId,
        openAuftragTab,
        openInstanzTab,
        openMaterialTab,
        closeTopTab,
        setAktiverTopTab,
        aktiverInstanzTabId,
        isMaterialTabActive,
        aktiveMaterialTab,
        materialSavedVersion,
        notifyMaterialSaved,
        instanzChangedVersion,
        notifyInstanzChanged,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}
