import { Box, Typography } from '@mui/material';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

/** One anchor-navigable section of an object page. */
export function Section({ id, title, children }: SectionProps): React.JSX.Element {
  return (
    <Box id={id} sx={{ scrollMarginTop: 56, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
