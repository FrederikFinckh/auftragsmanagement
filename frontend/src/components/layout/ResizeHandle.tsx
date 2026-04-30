import { Box } from '@mui/material';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  side: 'left' | 'right';
}

// Ziehgriff zum Vergrößern/Verkleinern der Seitenleisten
// 8px breit, col-resize Cursor, dezente Hervorhebung bei Hover
export default function ResizeHandle({ onMouseDown, side }: ResizeHandleProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    // Textauswahl während des Ziehens verhindern
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const handleMouseUp = () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mouseup', handleMouseUp);
    onMouseDown(e);
  };

  return (
    <Box
      onMouseDown={handleMouseDown}
      sx={{
        width: 8,
        cursor: 'col-resize',
        bgcolor: 'transparent',
        alignSelf: 'stretch',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '&:hover': {
          bgcolor: 'action.hover',
          '& .resize-dots': {
            opacity: 0.7,
          },
        },
        '&:active': {
          bgcolor: 'action.selected',
        },
        // Ziehgriff an der inneren Kante der Seitenleiste
        order: side === 'left' ? 1 : 0,
      }}
    >
      {/* Drei vertikale Punkte als visueller Indikator */}
      <Box
        className="resize-dots"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          opacity: 0.15,
          transition: 'opacity 0.2s',
        }}
      >
        <Box sx={{ width: 2.5, height: 2.5, borderRadius: '50%', bgcolor: 'text.secondary' }} />
        <Box sx={{ width: 2.5, height: 2.5, borderRadius: '50%', bgcolor: 'text.secondary' }} />
        <Box sx={{ width: 2.5, height: 2.5, borderRadius: '50%', bgcolor: 'text.secondary' }} />
      </Box>
    </Box>
  );
}
