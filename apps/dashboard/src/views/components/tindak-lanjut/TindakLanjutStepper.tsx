import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Box, Stack, Typography } from '@mui/material';

import type { TindakLanjutStep, TindakLanjutStepState } from '../../../controllers/tindakLanjutSteps';

function StepIcon({ state }: { state: TindakLanjutStepState }): React.JSX.Element {
  if (state === 'done') {
    return <CheckCircleIcon fontSize="small" color="success" />;
  }
  if (state === 'active') {
    return <RadioButtonCheckedIcon fontSize="small" color="primary" />;
  }
  return <RadioButtonUncheckedIcon fontSize="small" sx={{ color: state === 'skipped' ? 'text.disabled' : 'action.disabled' }} />;
}

interface TindakLanjutStepperProps {
  steps: readonly TindakLanjutStep[];
}

/** Compact horizontal stepper/timeline for the P2H follow-up chain. */
export function TindakLanjutStepper({ steps }: TindakLanjutStepperProps): React.JSX.Element {
  return (
    <Stack direction="row" sx={{ width: '100%', alignItems: 'flex-start' }}>
      {steps.map((step, index) => (
        <Box key={step.label} sx={{ display: 'flex', alignItems: 'center', flex: index < steps.length - 1 ? 1 : '0 0 auto' }}>
          <Stack spacing={0.5} sx={{ minWidth: 104, alignItems: 'center' }}>
            <StepIcon state={step.state} />
            <Typography
              variant="caption"
              align="center"
              sx={{
                color:
                  step.state === 'active'
                    ? 'primary.main'
                    : step.state === 'done'
                      ? 'success.main'
                      : step.state === 'skipped'
                        ? 'text.disabled'
                        : 'text.secondary',
                fontWeight: step.state === 'active' ? 600 : 400,
              }}
            >
              {step.label}
            </Typography>
          </Stack>
          {index < steps.length - 1 ? (
            <Box sx={{ flex: 1, height: 2, bgcolor: step.state === 'done' ? 'success.main' : 'divider', mx: 1, mt: '-20px' }} />
          ) : null}
        </Box>
      ))}
    </Stack>
  );
}
