import { useState } from 'react';
import { Paper, Tab, Tabs } from '@mui/material';

export interface AnchorSection {
  id: string;
  label: string;
}

interface AnchorTabsProps {
  sections: readonly AnchorSection[];
}

/**
 * Fiori-style anchor navigation: every section is rendered on the same page,
 * and clicking a tab scrolls smoothly to it instead of switching routes.
 */
export function AnchorTabs({ sections }: AnchorTabsProps): React.JSX.Element {
  const [active, setActive] = useState(0);

  function handleChange(index: number): void {
    setActive(index);
    document.getElementById(sections[index].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <Paper sx={{ position: 'sticky', top: 0, zIndex: 1, mb: 2 }}>
      <Tabs
        value={active}
        onChange={(_event, value: number) => handleChange(value)}
        variant="scrollable"
        scrollButtons={false}
      >
        {sections.map((section) => (
          <Tab key={section.id} label={section.label} />
        ))}
      </Tabs>
    </Paper>
  );
}
