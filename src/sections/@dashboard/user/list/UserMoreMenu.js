import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { MenuItem, IconButton, Grid } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';

// ----------------------------------------------------------------------

UserMoreMenu.propTypes = {
  onDelete: PropTypes.func,
  userName: PropTypes.string,
};

export default function UserMoreMenu({ onDelete, userName, onClick }) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <Grid container>
        <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON, padding: 0, margin: 0 }} />
        </MenuItem>

        <MenuItem onClick={onClick}>
          <Iconify icon={'eva:edit-outline'} sx={{ ...ICON, padding: 0, margin: 0 }} />
        </MenuItem>
        <MenuItem onClick={onClick}>
          <Iconify icon={'eva:eye-outline'} sx={{ ...ICON, padding: 0, margin: 0 }} />
        </MenuItem>
      </Grid>
    </>
  );
}
