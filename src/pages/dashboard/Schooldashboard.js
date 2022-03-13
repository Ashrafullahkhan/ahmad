import { Container, Grid, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { BookingWidgetSummary } from '../../sections/@dashboard/general/booking';
import { BookingIllustration, CheckInIllustration, CheckOutIllustration } from '../../assets';

export default function Schooldashboard() {
  const { themeStretch } = useSettings();
  return (
    <Page title="General: Analytics">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={10} sm={10} md={11}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Cambridge Secondary High School
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <Link style={{ textDecoration: 'none', color: 'white' }} to="/school/kids">
              <BookingWidgetSummary title="Total Kids" total={714000} icon={<BookingIllustration />} />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Link style={{ textDecoration: 'none', color: 'white' }} to="/school/workers">
              <BookingWidgetSummary title="Total Workers" total={311000} icon={<CheckInIllustration />} />
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Link style={{ textDecoration: 'none', color: 'white' }} to="/school/activity">
              <BookingWidgetSummary title="Activities" total={311000} icon={<CheckInIllustration />} />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Link style={{ textDecoration: 'none', color: 'white' }} to="/school/kids">
              <BookingWidgetSummary title="Parents" total={4000} icon={<CheckOutIllustration />} />
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
