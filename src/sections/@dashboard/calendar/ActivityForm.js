import PropTypes from 'prop-types';
import * as React from 'react';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';

import { useCallback, useEffect, useMemo } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
// form
import { useForm, Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
// @mui
import { Box, Stack, Button, Tooltip, TextField, Typography, IconButton, DialogActions, Grid } from '@mui/material';

// redux
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
import { fData } from '../../../utils/formatNumber';

// components
import Iconify from '../../../components/Iconify';

import {
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
  RHFUploadMultiFile,
  RHFEditor,
  RHFUploadAvatar,
  RHFCheckbox,
} from '../../../components/hook-form';

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

ActivityForm.propTypes = {
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
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function ActivityForm({ event, range, onCancel, isEdit, currentProduct }) {
  const [personName, setPersonName] = React.useState([]);
  const [category, setCategoryName] = React.useState([]);
  const [school, setSchoolName] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const isCreating = Object.keys(event).length === 0;

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000),
  });

  const NewProductSchema = Yup.object().shape({
    images: Yup.array().min(1, 'Images is required'),
  });

  const defaultValues = useMemo(
    () => ({
      images: currentProduct?.images || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );
  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const handleChangeSchool = (event) => {
    const {
      target: { value },
    } = event;
    setSchoolName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const handleChangeCategory = (event) => {
    const {
      target: { value },
    } = event;
    setCategoryName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
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

  const handleDropMulti = useCallback(
    (acceptedFiles) => {
      setValue(
        'images',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'cover',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={1} sx={{ p: 3 }}>
        <RHFTextField name="title" label="Name" />

        <RHFTextField name="description" label="Description" multiline rows={4} />

        <InputLabel id="demo-multiple-checkbox-label">Activity Type</InputLabel>
        <Select
          size="small"
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          value={personName}
          onChange={handleChange}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
        <InputLabel id="demo">Category</InputLabel>
        <Select
          size="small"
          labelId="demo"
          id="demo"
          value={category}
          onChange={handleChangeCategory}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
        <InputLabel id="demo">Select School</InputLabel>
        <Select
          size="small"
          labelId="demo"
          id="demo"
          value={school}
          onChange={handleChangeSchool}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>

        <Grid container style={{ gap: 20 }}>
          <Grid item md={6} lg={5} xs={12}>
            <RHFTextField name="duration" label="Activity Year" />
          </Grid>
          <Grid item md={6} lg={6} xs={12}>
            <RHFTextField name="price" label="Price" />
          </Grid>
          <Grid item md={6} lg={5} xs={12}>
            <Controller
              name="start"
              size="small"
              control={control}
              render={({ field }) => (
                <MobileDateTimePicker
                  {...field}
                  label="Start date"
                  inputFormat="dd/MM/yyyy hh:mm a"
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              )}
            />
          </Grid>
          <Grid item md={6} lg={6} xs={12}>
            <Controller
              size="small"
              name="end"
              control={control}
              render={({ field }) => (
                <MobileDateTimePicker
                  {...field}
                  label="End date"
                  inputFormat="dd/MM/yyyy hh:mm a"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!isDateError}
                      helperText={isDateError && 'End date must be later than start date'}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item>
            <LabelStyle>Content</LabelStyle>
            <RHFEditor name="content" />
          </Grid>
          <Grid item>
            <LabelStyle>Cover</LabelStyle>
            <RHFUploadSingleFile name="cover" onDrop={handleDrop} />
          </Grid>
          <Grid item>
            <LabelStyle>Images</LabelStyle>
            <RHFUploadMultiFile
              name="images"
              showPreview
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDropMulti}
              onRemove={handleRemove}
              onRemoveAll={handleRemoveAll}
            />
          </Grid>
        </Grid>
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
  );
}
