import { useNavigate } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';

import type { P2HGeoPoint, P5MGeoPoint } from '../../../controllers/useGeoMap';
import { formatDate } from '../../format';
import { IntegrityChip } from '../IntegrityChip';
import { ObjectStatus } from '../ObjectStatus';

interface DetailLinkButtonProps {
  to: string;
}

/** Popup action that navigates client-side via react-router instead of a full reload. */
function DetailLinkButton({ to }: DetailLinkButtonProps): React.JSX.Element {
  const navigate = useNavigate();
  return (
    <Button size="small" variant="text" onClick={() => navigate(to)} sx={{ alignSelf: 'flex-start', px: 0, minWidth: 0 }}>
      Lihat detail
    </Button>
  );
}

interface P2HPopupContentProps {
  point: P2HGeoPoint;
}

/** Compact Fiori-style popup content shown when a P2H marker is clicked. */
export function P2HPopupContent({ point }: P2HPopupContentProps): React.JSX.Element {
  return (
    <Stack spacing={0.5} sx={{ minWidth: 200 }}>
      <Typography sx={{ fontWeight: 600 }}>{point.unitLabel}</Typography>
      <Typography variant="body2" color="text.secondary">
        {formatDate(point.tanggal)} · {point.namaOperator}
      </Typography>
      <ObjectStatus status={point.statusKelayakan} />
      <IntegrityChip integritas={point.integritas} />
      <Typography variant="body2">{point.jumlahTemuan} temuan</Typography>
      <DetailLinkButton to={`/p2h/${point.id}`} />
    </Stack>
  );
}

interface P5MPopupContentProps {
  point: P5MGeoPoint;
}

/** Compact Fiori-style popup content shown when a P5M marker is clicked. */
export function P5MPopupContent({ point }: P5MPopupContentProps): React.JSX.Element {
  return (
    <Stack spacing={0.5} sx={{ minWidth: 200 }}>
      <Typography sx={{ fontWeight: 600 }}>{point.topik}</Typography>
      <Typography variant="body2" color="text.secondary">
        {formatDate(point.tanggal)} · {point.jamMulai}
      </Typography>
      <Typography variant="body2">Pemimpin: {point.namaPemimpin}</Typography>
      <Typography variant="body2">
        Peserta hadir: {point.jumlahHadir} dari {point.jumlahPeserta}
      </Typography>
      <IntegrityChip integritas={point.integritas} />
      <DetailLinkButton to={`/p5m/${point.id}`} />
    </Stack>
  );
}
