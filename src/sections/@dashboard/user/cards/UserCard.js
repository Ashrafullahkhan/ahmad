import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Avatar,
  Divider,
  Typography,
  Stack,
  Checkbox,
  MenuItem,
  IconButton,
  CardHeader,
  FormControlLabel,
} from '@mui/material';

// utils
import cssStyles from '../../../../utils/cssStyles';
import { fShortenNumber } from '../../../../utils/formatNumber';
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';
// components
import Image from '../../../../components/Image';
import SocialsButton from '../../../../components/SocialsButton';
import SvgIconStyle from '../../../../components/SvgIconStyle';

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

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default function UserCard({ user, onClick }) {
  const { name, cover, position, follower, totalPost, avatarUrl, following } = user;
  const [open, setOpen] = useState(null);

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

  return (
    <Link to={'/school'} style={{ textDecoration: 'none' }}>
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

          <OverlayStyle />
          <Image src={cover} alt={cover} ratio="16/9" />
          <Box sx={{ float: 'right', zIndex: 9999 }}>
            <IconButton size="large" onClick={handleOpen}>
              <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
            </IconButton>
          </Box>
        </Box>

        <MenuPopover
          open={Boolean(open)}
          anchorEl={open}
          onClose={(e) => handleClose(e)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          arrow="right-top"
          sx={{
            mt: -0.5,
            width: 'auto',
            '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
          }}
        >
          <MenuItem onClick={onClick}>
            <Iconify icon={'eva:edit-fill'} sx={{ ...ICON }} />
            Edit
          </MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem sx={{ color: 'error.main' }}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
            Delete
          </MenuItem>
        </MenuPopover>
        <Typography variant="subtitle1" sx={{ mt: 6 }}>
          {name}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 3 }}>
          {position}
        </Typography>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ py: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div>
            <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
              Estudiantes
            </Typography>
            <Typography variant="subtitle1">{fShortenNumber(follower)}</Typography>
          </div>

          <div>
            <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
              Trabajadores
            </Typography>
            <Typography variant="subtitle1">{fShortenNumber(following)}</Typography>
          </div>

          <div>
            <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
              Actividades
            </Typography>
            <Typography variant="subtitle1">{fShortenNumber(totalPost)}</Typography>
          </div>
        </Box>
      </Card>
    </Link>
  );
}
