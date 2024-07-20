import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const FlexBox = styled(Box)({
  display: 'flex',
});

const CenteredFlexBox = styled(FlexBox)({
  justifyContent: 'center',
  alignItems: 'center',
});

const FullSizeCenteredFlexBox = styled(CenteredFlexBox)({
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});

export { CenteredFlexBox, FlexBox, FullSizeCenteredFlexBox };
