import PropTypes from 'prop-types';
import { capitalCase } from 'change-case';
import { useState, useCallback } from 'react';
// @mui
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';

// form
import {
  Container,
  Tab,
  Box,
  Tabs,
  Stack,
  Button,
  Tooltip,
  Typography,
  InputAdornment,
  IconButton,
  DialogActions,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { _userPayment, _userAddressBook, _userInvoices, _userAbout } from '../../../_mock';

// redux
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
import { fData } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/Iconify';

import {
  AccountGeneral,
  AccountBilling,
  AccountSocialLinks,
  AccountNotifications,
  AccountChangePassword,
} from '../user/account';

import { FormProvider, RHFTextField, RHFUploadAvatar, RHFSwitch } from '../../../components/hook-form';

// ----------------------------------------------------------------------

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

WorkerForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
};

export default function WorkerForm({ event, range, onCancel }) {
  const { enqueueSnackbar } = useSnackbar();

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

  const [currentTab, setCurrentTab] = useState('Nominas');

  const ACCOUNT_TABS = [
    {
      value: 'Nominas',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={1} sx={{ p: 3 }}>
            <RHFTextField name="title" label="Name" />
            <RHFTextField name="title" label="Activity" />
            <RHFTextField name="title" label="Teacher Name" />
            <RHFTextField name="title" label="Email" />
            <RHFTextField name="title" label="Phone Number" />
            <RHFTextField name="title" label="Name" />
          </Stack>

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
        </FormProvider>
      ),
    },
    {
      value: 'Contratos',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: <AccountBilling cards={_userPayment} addressBook={_userAddressBook} invoices={_userInvoices} />,
    },
    {
      value: 'Documents',
      icon: <Iconify icon={'eva:bell-fill'} width={20} height={20} />,
      component: <AccountNotifications />,
    },
    {
      value: 'Leaves',
      icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
      component: <AccountSocialLinks myProfile={_userAbout} />,
    },
  ];

  return (
    <>
      <Tabs
        sx={{ marginLeft: 6 }}
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
      >
        {ACCOUNT_TABS.map((tab) => (
          <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      <Box sx={{ mb: 5 }} />

      {ACCOUNT_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </>
  );
}
