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
  {
    subheader: 'Schools',
    items: [
      // MANAGEMENT : USER
      {
        title: 'Schools',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'School One', path: PATH_DASHBOARD.school.dashboard },
          { title: 'School Two', path: PATH_DASHBOARD.school.dashboard },
          { title: 'School Three', path: PATH_DASHBOARD.school.dashboard },
        ],
      },
    ],
  },
  {
    subheader: 'general',
    items: [
      { title: 'Schools', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Search', path: PATH_DASHBOARD.general.search, icon: ICONS.ecommerce },
      { title: 'workers', path: PATH_DASHBOARD.general.workers, icon: ICONS.analytics },
      { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
      { title: 'app-config', path: PATH_DASHBOARD.general.category, icon: ICONS.analytics },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------

  // APP
  // ----------------------------------------------------------------------
];

export default navConfig;
