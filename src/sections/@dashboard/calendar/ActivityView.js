import PropTypes from 'prop-types';

import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { styled } from '@mui/material/styles';

import { useForm, Controller } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
// @mui
import { Container, Grid, Card, Box, Button, Tooltip, IconButton, DialogActions, Typography } from '@mui/material';
import useSettings from '../../../hooks/useSettings';
// redux
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
import { fData } from '../../../utils/formatNumber';
import _mock from '../../../_mock/_mock';
// components
import Iconify from '../../../components/Iconify';
import { Profile, ProfileCover, ProfileFriends, ProfileGallery, ProfileFollowers } from '../user/profile';

import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from '../../../_mock';
import { randomNumberRange, randomInArray } from '../../../_mock/funcs';

import { FormProvider, RHFTextField, RHFUploadAvatar, RHFCheckbox } from '../../../components/hook-form';
import { ViewCard } from '../user/cards';
// ---------------------------------------------------------------------

const getInitialValues = (event, range) => {
  const _event = {
    title: '',
    description: '',
    textColor: '#1890FF',
    allDay: false,
    start: range ? new Date(range.start) : new Date(),
    end: range ? new Date(range.end) : new Date(),
  };

  if (event || range) {
    return merge({}, _event, event);
  }

  return _event;
};

// ----------------------------------------------------------------------

ActivityView.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
};
export const _userCards = [...Array(1)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: _mock.image.avatar(index),
  cover: _mock.image.cover(index),
  name: _mock.name.fullName(index),
  follower: randomNumberRange(999, 99999),
  following: randomNumberRange(999, 99999),
  totalPost: randomNumberRange(999, 99999),
  position: _mock.role(index),
}));

export default function ActivityView({ event, range, onCancel }) {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  const isCreating = Object.keys(event).length === 0;

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event, range),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const newEvent = {
        title: data.title,
        description: data.description,
        textColor: data.textColor,
        allDay: data.allDay,
        start: data.start,
        end: data.end,
      };
      if (event.id) {
        dispatch(updateEvent(event.id, newEvent));
        enqueueSnackbar('Update success!');
      } else {
        enqueueSnackbar('Create success!');
        dispatch(createEvent(newEvent));
      }
      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!event.id) return;
    try {
      onCancel();
      dispatch(deleteEvent(event.id));
      enqueueSnackbar('Delete success!');
    } catch (error) {
      console.error(error);
    }
  };

  const values = watch();

  const isDateError = isBefore(new Date(values.end), new Date(values.start));
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );
  return (
    <>
      <Box
        sx={{
          marginLeft: 0,
          display: 'grid',
          gap: 1,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(1, 1fr)',
          },
        }}
      >
        {_userCards.map((user) => (
          <ViewCard key={user.id} user={user} />
        ))}
      </Box>

      <DialogActions>
        {!isCreating && (
          <Tooltip title="Delete Event">
            <IconButton onClick={handleDelete}>
              <Iconify icon="eva:trash-2-outline" width={20} height={20} />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
          Add
        </LoadingButton>
      </DialogActions>
    </>
  );
}
