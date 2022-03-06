import { Container, Grid, Typography } from '@mui/material';

import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { AnalyticsWidgetSummary } from '../../sections/@dashboard/general/analytics';

export default function Schooldashboard() {
  const { themeStretch } = useSettings();
  return (
    <Page title="General: Analytics">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Cambridge Secondary High School
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <AnalyticsWidgetSummary
              title="Kids"
              leftsubtitle="Total kids"
              rightsubtitle="Register Kids"
              leftsubtitlecount={2000}
              rightsubtitlecount={4000}
              icon={'ant-design:android-filled'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <AnalyticsWidgetSummary
              title="Parents"
              leftsubtitle="Male Kids"
              rightsubtitle="Female Kids"
              leftsubtitlecount={9000}
              rightsubtitlecount={80000}
              color="warning"
              icon={'ant-design:windows-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <AnalyticsWidgetSummary
              title="Activities"
              leftsubtitle="Total Activities"
              leftsubtitlecount="3000"
              color="error"
              icon={'ant-design:bug-filled'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <AnalyticsWidgetSummary
              title="Workers"
              leftsubtitle="Total Workers"
              leftsubtitlecount={4000}
              color="info"
              icon={'ant-design:apple-filled'}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
