import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography, Grid } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

AnalyticsWidgetSummary.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error']),
  icon: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default function AnalyticsWidgetSummary({
  title,
  leftsubtitle,
  rightsubtitle,
  leftsubtitlecount,
  rightsubtitlecount,

  icon,
  color = 'primary',
}) {
  return (
    <RootStyle
      sx={{
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
      }}
    >
      <IconWrapperStyle
        sx={{
          color: (theme) => theme.palette[color].dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
              theme.palette[color].dark,
              0.24
            )} 100%)`,
        }}
      >
        <Iconify icon={icon} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h4" sx={{ opacity: 0.72, paddingBelow: 5 }}>
        {title}
      </Typography>
      <Grid container spacing={2} style={{ paddingLeft: 40, paddingRight: 30, justifyContent: 'space-between' }}>
        <Grid>
          <Typography variant="h6" sx={{ opacity: 0.72 }}>
            {leftsubtitle}
          </Typography>
          <Typography variant="subtitle">{leftsubtitlecount}</Typography>
        </Grid>
        <Grid>
          <Typography variant="h6" sx={{ opacity: 0.72 }}>
            {rightsubtitle}
          </Typography>
          <Typography variant="subtitle">{rightsubtitlecount}</Typography>
        </Grid>
      </Grid>
    </RootStyle>
  );
}
