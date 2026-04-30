import { Box } from '@mui/material';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  side: 'left' | 'right';
}

// Ziehgriff zum Vergrößern/Verkleinern der Seitenleisten
export default function ResizeHandle({ onMouseDown, side }: ResizeHandleProps) {
  return (
    <Box
      onMouseDown={onMouseDown}
      sx={{
        width: 8,
        cursor: 'col-resize',
        bgcolor: 'transparent',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        alignSelf: 'stretch',
        flexShrink: 0,
        // Ziehgriff an der inneren Kante der Seitenleiste
        order: side === 'left' ? 1 : 0,
      }}
    />
  );
}
