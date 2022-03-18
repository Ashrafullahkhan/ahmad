import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';

import orderBy from 'lodash/orderBy';
// form
import { useForm } from 'react-hook-form';
// @mui
import { useTheme } from '@mui/material/styles';

import {
  Grid,
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  Switch,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  DialogTitle,
  Stack,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import { openModal, closeModal, updateEvent, selectEvent, selectRange } from '../../redux/slices/calendar';
import { DialogAnimate } from '../../components/animate';
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts, filterProducts } from '../../redux/slices/product';
import { WorkerForm } from '../../sections/@dashboard/calendar';

// _mock_
import { _userList } from '../../_mock';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';
// components
import {
  ShopTagFiltered,
  ShopProductSort,
  ShopProductList,
  ShopFilterSidebar,
  ShopProductSearch,
} from '../../sections/@dashboard/e-commerce/shop';
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user/list';

// ----------------------------------------------------------------------
export const FILTER_GENDER_OPTIONS = ['Verified', 'Status', 'Role', 'School'];
const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------
const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }
  return null;
};
export default function Workers() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { themeStretch } = useSettings();

  const selectedEvent = useSelector(selectedEventSelector);

  const { isOpenModal, selectedRange } = useSelector((state) => state.calendar);

  const [userList, setUserList] = useState(_userList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openFilter, setOpenFilter] = useState(false);

  const { products, sortBy, filters } = useSelector((state) => state.product);

  const filteredProducts = applyFilter(products, sortBy, filters);

  const defaultValues = {
    gender: filters.gender,
    category: filters.category,
    colors: filters.colors,
    priceRange: filters.priceRange,
    rating: filters.rating,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();

  const isDefault =
    !values.priceRange &&
    !values.rating &&
    values.gender.length === 0 &&
    values.colors.length === 0 &&
    values.category === 'All';

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterProducts(values));
  }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    reset();
    handleCloseFilter();
  };

  const handleRemoveGender = (value) => {
    const newValue = filters.gender.filter((item) => item !== value);
    setValue('gender', newValue);
  };

  const handleRemoveCategory = () => {
    setValue('category', 'All');
  };

  const handleRemoveColor = (value) => {
    const newValue = filters.colors.filter((item) => item !== value);
    setValue('colors', newValue);
  };

  const handleRemovePrice = () => {
    setValue('priceRange', '');
  };

  const handleRemoveRating = () => {
    setValue('rating', '');
  };

  const handleAddEvent = () => {
    dispatch(openModal());
  };
  const handleSelectEvent = (arg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = userList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteUser = (userId) => {
    const deleteUser = userList.filter((user) => user.id !== userId);
    setSelected([]);
    setUserList(deleteUser);
  };

  const handleDeleteMultiUser = (selected) => {
    const deleteUsers = userList.filter((user) => !selected.includes(user.name));
    setSelected([]);
    setUserList(deleteUsers);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Grid container sx={{ marginBottom: 5 }}>
          <Grid item xs={7} md={8}>
            <Typography variant="h3">Workers</Typography>
          </Grid>

          <Grid item xs={5} md={4}>
            <Button
              style={{ float: 'right' }}
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
              onClick={handleAddEvent}
            >
              Add New
            </Button>
          </Grid>
        </Grid>

        <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
          <DialogTitle>{selectedEvent ? 'Edit Worker' : 'Add Worker'}</DialogTitle>

          <WorkerForm event={selectedEvent || {}} range={selectedRange} onCancel={handleCloseModal} />
        </DialogAnimate>
        <Stack sx={{ mb: 1 }}>
          {!isDefault && (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>{filteredProducts.length}</strong>
                &nbsp;Details found
              </Typography>

              <ShopTagFiltered
                filters={filters}
                isShowReset={!isDefault && !openFilter}
                onRemoveGender={handleRemoveGender}
                onResetAll={handleResetFilter}
              />
            </>
          )}
        </Stack>
        <Card>
          <UserListToolbar
            tablename={
              <FormProvider methods={methods}>
                <ShopFilterSidebar
                  filter={FILTER_GENDER_OPTIONS}
                  onResetAll={handleResetFilter}
                  isOpen={openFilter}
                  onOpen={handleOpenFilter}
                  onClose={handleCloseFilter}
                />
              </FormProvider>
            }
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onDeleteUsers={() => handleDeleteMultiUser(selected)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, role, status, company, avatarUrl, isVerified } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onClick={() => handleClick(name)} />
                        </TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{company}</TableCell>
                        <TableCell align="left">{role}</TableCell>
                        <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="left">
                          <Switch defaultChecked size="small" />
                        </TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            onDelete={() => handleDeleteUser(id)}
                            userName={name}
                            onClick={handleAddEvent}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------
function applyFilter(products, sortBy, filters) {
  // SORT BY
  if (sortBy === 'featured') {
    products = orderBy(products, ['sold'], ['desc']);
  }
  if (sortBy === 'newest') {
    products = orderBy(products, ['createdAt'], ['desc']);
  }
  if (sortBy === 'priceDesc') {
    products = orderBy(products, ['price'], ['desc']);
  }
  if (sortBy === 'priceAsc') {
    products = orderBy(products, ['price'], ['asc']);
  }
  // FILTER PRODUCTS
  if (filters.gender.length > 0) {
    products = products.filter((product) => filters.gender.includes(product.gender));
  }
  if (filters.category !== 'All') {
    products = products.filter((product) => product.category === filters.category);
  }
  if (filters.colors.length > 0) {
    products = products.filter((product) => product.colors.some((color) => filters.colors.includes(color)));
  }
  if (filters.priceRange) {
    products = products.filter((product) => {
      if (filters.priceRange === 'below') {
        return product.price < 25;
      }
      if (filters.priceRange === 'between') {
        return product.price >= 25 && product.price <= 75;
      }
      return product.price > 75;
    });
  }
  if (filters.rating) {
    products = products.filter((product) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return product.totalRating > convertRating(filters.rating);
    });
  }
  return products;
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
