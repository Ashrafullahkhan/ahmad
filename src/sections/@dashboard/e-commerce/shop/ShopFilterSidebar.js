import PropTypes from 'prop-types';
// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
// @types
import { NAVBAR } from '../../../../config';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { ColorManyPicker } from '../../../../components/color-utils';
import { RHFMultiCheckbox, RHFRadioGroup } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];

// ----------------------------------------------------------------------

const onSelected = (selected, item) =>
  selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item];

ShopFilterSidebar.propTypes = {
  isOpen: PropTypes.bool,
  onResetAll: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default function ShopFilterSidebar({ filter, isOpen, onResetAll, onOpen, onClose }) {
  const { control } = useFormContext();

  return (
    <>
      <Button disableRipple color="inherit" endIcon={<Iconify icon={'ic:round-filter-list'} />} onClick={onOpen}>
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: { width: NAVBAR.BASE_WIDTH },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon={'eva:close-fill'} width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Select Columns</Typography>
              <RHFMultiCheckbox name="gender" options={filter} sx={{ width: 1 }} />
            </Stack>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={onResetAll}
            startIcon={<Iconify icon={'ic:round-clear-all'} />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
