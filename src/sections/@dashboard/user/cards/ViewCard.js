import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// @mui

import { capitalCase, sentenceCase } from 'change-case';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Avatar,
  Divider,
  Typography,
  Tab,
  TableRow,
  TableContainer,
  TableBody,
  TableCell,
  Table,
  TablePagination,
  Tabs,
  Stack,
  Checkbox,
  MenuItem,
  IconButton,
  CardHeader,
  FormControlLabel,
} from '@mui/material';
import Page from '../../../../components/Page';
import Label from '../../../../components/Label';

import Scrollbar from '../../../../components/Scrollbar';
import SearchNotFound from '../../../../components/SearchNotFound';
import useSettings from '../../../../hooks/useSettings';
import useResponsive from '../../../../hooks/useResponsive';
import { DialogAnimate } from '../../../../components/animate';
import { useDispatch, useSelector } from '../../../../redux/store';
// utils
import { _userList } from '../../../../_mock';
// components
import cssStyles from '../../../../utils/cssStyles';
import { fShortenNumber } from '../../../../utils/formatNumber';
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';
// components
import Image from '../../../../components/Image';
import SocialsButton from '../../../../components/SocialsButton';
import SvgIconStyle from '../../../../components/SvgIconStyle';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../list';
import {
  openModal,
  closeModal,
  openViewModal,
  closeViewModal,
  updateEvent,
  selectEvent,
  selectRange,
} from '../../../../redux/slices/calendar';
// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 8,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
}));

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'name', label: 'Nombre', alignRight: false },
  { id: 'company', label: ' Actividades', alignRight: false },
  { id: 'role', label: 'Nombre tutor', alignRight: false },
  { id: 'isVerified', label: 'Email,', alignRight: false },
  { id: 'status', label: 'Teléfono', alignRight: false },
  { id: '' },
];
ViewCard.propTypes = {
  user: PropTypes.object.isRequired,
};
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
const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }
  return null;
};

export default function ViewCard({ user, onClick }) {
  const { name, cover, position, follower, totalPost, avatarUrl, following } = user;
  const [open, setOpen] = useState(null);

  const dispatch = useDispatch();
  const theme = useTheme();

  const isDesktop = useResponsive('up', 'sm');

  const selectedEvent = useSelector(selectedEventSelector);

  const { isOpenModal, selectedRange, isOpenViewModal } = useSelector((state) => state.calendar);
  const [userList, setUserList] = useState(_userList);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && Boolean(filterName);

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
  const handleAddView = () => {
    dispatch(openViewModal());
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
  const handleCloseViewModal = () => {
    dispatch(closeViewModal());
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

  const ACCOUNT_TABS = [
    {
      value: 'Kids Registered',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: (
        <Card>
          <UserListToolbar
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
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(status === 'banned' && 'error') || 'success'}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell>

                        <UserMoreMenu onClick={handleAddEvent} onDelete={() => handleDeleteUser(id)} userName={name} />
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
      ),
    },
    {
      value: 'Kids Assistance',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: <p>working</p>,
    },
  ];
  const handleOpen = (event) => {
    event.preventDefault();
    setOpen(event.currentTarget);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };
  const [currentTab, setCurrentTab] = useState('Kids Registered');

  return (
    <Card sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        />

        <Image src={cover} alt={cover} ratio="40/9" />
      </Box>

      <Box sx={{ py: 2, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div>
          <Typography variant="subtitle1" component="div" sx={{ mb: 0.75 }}>
            Activity Name
          </Typography>
          <Typography variant="caption">Cooking</Typography>
        </div>

        <div>
          <Typography variant="subtitle1" component="div" sx={{ mb: 0.75 }}>
            Discreption
          </Typography>
          <Typography variant="caption">here will show all the Discreption given by admin</Typography>
        </div>
      </Box>
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
    </Card>
  );
}
