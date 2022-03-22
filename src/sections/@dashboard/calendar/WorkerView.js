import PropTypes from 'prop-types';
import * as React from 'react';
import { capitalCase } from 'change-case';
import { useState, useCallback, useRef } from 'react';

// @mui
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';

import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';

// form
import {
  Container,
  Tab,
  Box,
  Divider,
  Tabs,
  Stack,
  Button,
  Tooltip,
  Grid,
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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
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

WorkerView.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
};
const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];
export default function WorkerView({ event, range, onCancel }) {
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const fileInputRef = useRef(null);
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
          <Stack spacing={1} sx={{ p: 3, paddingLeft: 8 }}>
            <input style={{ width: '300px' }} ref={fileInputRef} type="file" />
          </Stack>
        </FormProvider>
      ),
    },
    {
      value: 'Contratos',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: (
        <Grid sx={{ marginLeft: 10, width: 400 }}>
          <FormControl sx={{ m: 1, width: 400 }}>
            <InputLabel id="demo-multiple-checkbox-label">Select Documents Type</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput label="Select Documents Type" />}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
            <input style={{ marginTop: 15 }} ref={fileInputRef} type="file" />
          </FormControl>
        </Grid>
      ),
    },
    {
      value: 'Documents',
      icon: <Iconify icon={'eva:bell-fill'} width={20} height={20} />,
      component: <p style={{ marginLeft: 10 }}>required Info</p>,
    },
    {
      value: 'Leaves',
      icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
      component: <p style={{ marginLeft: 10 }}>required Info</p>,
    },
  ];

  return (
    <>
      <Grid container>
        <Grid sx={{ margin: 4 }} item sm={2} lg={3} md={2}>
          <Typography variant="subtitle1" sx={{ mb: 0.75 }}>
            Worker Name
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 0.75 }}>
            Email
          </Typography>
        </Grid>
        <Grid sx={{ margin: 4 }} item sm={2} lg={3} md={2}>
          <Typography variant="subtitle1" sx={{ mb: 0.75 }}>
            Jhon
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 0.75 }}>
            Jhon@gmail.com
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ borderStyle: 'dashed' }} />
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
