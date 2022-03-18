import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Chip, Typography, Stack, Button } from '@mui/material';
// utils
import getColorName from '../../../../utils/getColorName';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
});

const WrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'stretch',
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.divider}`,
}));

const LabelStyle = styled((props) => <Typography component="span" variant="subtitle2" {...props} />)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderRight: `solid 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

function labelPriceRange(range) {
  if (range === 'below') {
    return 'Below $25';
  }
  if (range === 'between') {
    return 'Between $25 - $75';
  }
  return 'Above $75';
}

ShopTagFiltered.propTypes = {
  filters: PropTypes.object,
  isShowReset: PropTypes.bool,
  onRemoveGender: PropTypes.func,
  onRemoveCategory: PropTypes.func,
  onRemoveColor: PropTypes.func,
  onRemovePrice: PropTypes.func,
  onRemoveRating: PropTypes.func,
  onResetAll: PropTypes.func,
};

export default function ShopTagFiltered({
  filters,
  isShowReset,
  onRemoveGender,

  onResetAll,
}) {
  const theme = useTheme();

  const { gender } = filters;

  return (
    <RootStyle>
      {gender.length > 0 && (
        <WrapperStyle>
          <LabelStyle>Columns</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            {gender.map((_gender) => (
              <Chip
                key={_gender}
                label={_gender}
                size="small"
                onDelete={() => onRemoveGender(_gender)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </WrapperStyle>
      )}

      {isShowReset && (
        <Button color="error" size="small" onClick={onResetAll} startIcon={<Iconify icon={'ic:round-clear-all'} />}>
          Clear All
        </Button>
      )}
    </RootStyle>
  );
}
