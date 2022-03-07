// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'Dashboard', path: PATH_DASHBOARD.school.dashboard, icon: ICONS.dashboard },
      { title: 'Workers', path: PATH_DASHBOARD.school.workers, icon: ICONS.dashboard },
      { title: 'Acitivity', path: PATH_DASHBOARD.school.activity, icon: ICONS.ecommerce },
      { title: 'Kids', path: PATH_DASHBOARD.school.kids, icon: ICONS.chat },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
];

export default navConfig;
