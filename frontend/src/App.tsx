import { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';
import LeftSidebar from './components/layout/LeftSidebar';
import RightSidebar from './components/layout/RightSidebar';
import ResizeHandle from './components/layout/ResizeHandle';
import MitteBereich from './components/mitte/MitteBereich';
import { TabProvider } from './context/TabContext';

// Minimale und maximale Seitenleistenbreite
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 600;
const DEFAULT_SIDEBAR_WIDTH = 350;

function App() {
  // Seitenleisten-Zustand
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [leftWidth, setLeftWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [rightWidth, setRightWidth] = useState(DEFAULT_SIDEBAR_WIDTH);

  // Ziehen der linken Seitenleiste
  const handleLeftResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, startWidth + delta));
      setLeftWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [leftWidth]);

  // Ziehen der rechten Seitenleiste
  const handleRightResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = startX - moveEvent.clientX;
      const newWidth = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, startWidth + delta));
      setRightWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [rightWidth]);

  return (
    <TabProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Kopfleiste */}
        <AppHeader />

        {/* Hauptzeile: Seitenleisten + Mittelbereich */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Linke Seitenleiste */}
          {leftOpen && (
            <>
              <Box sx={{ width: leftWidth, flexShrink: 0, overflow: 'hidden' }}>
                <LeftSidebar />
              </Box>
              <ResizeHandle side="left" onMouseDown={handleLeftResize} />
            </>
          )}

          {/* Mittelbereich – Tab-Arbeitsbereich */}
          <MitteBereich />

          {/* Rechte Seitenleiste */}
          {rightOpen && (
            <>
              <ResizeHandle side="right" onMouseDown={handleRightResize} />
              <Box sx={{ width: rightWidth, flexShrink: 0, overflow: 'hidden' }}>
                <RightSidebar />
              </Box>
            </>
          )}
        </Box>

        {/* Fußleiste */}
        <AppFooter
          leftOpen={leftOpen}
          rightOpen={rightOpen}
          onToggleLeft={() => setLeftOpen((prev) => !prev)}
          onToggleRight={() => setRightOpen((prev) => !prev)}
        />
      </Box>
    </TabProvider>
  );
}

export default App;
