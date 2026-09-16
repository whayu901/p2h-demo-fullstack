import { useState } from 'react';
import { Paper, Tab, Tabs } from '@mui/material';

import { useAudit } from '../../controllers/useAudit';
import { usePdp } from '../../controllers/usePdp';
import { useSesi } from '../../controllers/useSesi';
import { AuditTab } from '../components/kepatuhan/AuditTab';
import { PdpTab } from '../components/kepatuhan/PdpTab';
import { PageTitleBar } from '../components/PageTitleBar';

type KepatuhanTab = 'audit' | 'pdp';

export function KepatuhanPage(): React.JSX.Element {
  const [tab, setTab] = useState<KepatuhanTab>('audit');
  const sesi = useSesi();
  const audit = useAudit();
  const pdp = usePdp();

  return (
    <>
      <PageTitleBar title="Kepatuhan" subtitle="Jejak audit dan perlindungan data pribadi" />

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_event, value: KepatuhanTab) => setTab(value)}>
          <Tab value="audit" label="Audit" />
          <Tab value="pdp" label="PDP" />
        </Tabs>
      </Paper>

      {tab === 'audit' ? (
        <AuditTab controller={audit} boleh={sesi.boleh('audit:baca')} />
      ) : (
        <PdpTab controller={pdp} boleh={sesi.boleh('pdp:kelola')} />
      )}
    </>
  );
}
