import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
// @mui
import { Container, Box, Button, Grid, DialogTitle, Typography } from '@mui/material';
import { useDispatch, useSelector } from '../../redux/store';
import { openModal, closeModal, updateEvent, selectEvent, selectRange } from '../../redux/slices/calendar';
import Iconify from '../../components/Iconify';
// routes

// hooks

import useResponsive from '../../hooks/useResponsive';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userCards } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { DialogAnimate } from '../../components/animate';

// sections
import { UserCard } from '../../sections/@dashboard/user/cards';
import { SchoolForm } from '../../sections/@dashboard/calendar';
// ----------------------------------------------------------------------
const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }
  return null;
};

export default function GeneralApp() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  const isDesktop = useResponsive('up', 'sm');

  const selectedEvent = useSelector(selectedEventSelector);

  const { isOpenModal, selectedRange } = useSelector((state) => state.calendar);

  const handleAddEvent = (e) => {
    e.preventDefault();
    dispatch(openModal());
  };
  const handleSelectEvent = (arg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <Page title="User: Cards">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Grid container spacing={3}>
          <Grid sx={{ marginBottom: 5 }} item xs={7} md={8}>
            <Typography variant="h3">Listado colegios</Typography>
          </Grid>

          <Grid item xs={5} md={4}>
            <Button
              style={{ float: 'right' }}
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
              onClick={handleAddEvent}
            >
              Nuevo colegio
            </Button>
          </Grid>
        </Grid>
        <DialogAnimate maxWidht={'md'} open={isOpenModal} onClose={handleCloseModal}>
          <DialogTitle>{selectedEvent ? 'Edit School' : 'Add School'}</DialogTitle>

          <SchoolForm event={selectedEvent || {}} range={selectedRange} onCancel={handleCloseModal} />
        </DialogAnimate>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {_userCards.map((user) => (
            <UserCard onClick={(e) => handleAddEvent(e)} key={user.id} user={user} />
          ))}
        </Box>
      </Container>
    </Page>
  );
}
