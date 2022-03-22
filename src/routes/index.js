import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import Testing2 from '../pages/dashboard/Testing2';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },
    {
      path: '/school',
      element: <Testing2 />,
      children: [
        { element: <Navigate to="/school/dashboard" replace />, index: true },
        { path: 'dashboard', element: <Schooldashboard /> },
        { path: 'workers', element: <SchoolWorkers /> },
        { path: 'activity', element: <SchoolActivities /> },
        { path: 'kids', element: <SchoolKids /> },
      ],
    },
    // Dashboard Routes
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'mainschool', element: <MainSchool /> },

        { path: 'newyear', element: <NewYear /> },
        { path: 'search', element: <Search /> },

        { path: 'category', element: <Category /> },
        { path: 'workers', element: <Workers /> },

        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfile /> },

            { path: 'account', element: <UserAccount /> },
          ],
        },

        {
          path: 'chat',
          children: [
            { element: <Navigate to="/dashboard/chat/lucian.obrien" replace />, index: true },
            { path: 'new', element: <Chat /> },
            { path: ':conversationKey', element: <Chat /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: (
        <GuestGuard>
          <Login />
        </GuestGuard>
      ),
      children: [{ element: <HomePage />, index: true }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));
// Dashboard
const MainSchool = Loadable(lazy(() => import('../pages/dashboard/MainSchool')));

const NewYear = Loadable(lazy(() => import('../pages/dashboard/NewYear')));
const Schooldashboard = Loadable(lazy(() => import('../pages/dashboard/Schooldashboard')));
const SchoolWorkers = Loadable(lazy(() => import('../pages/dashboard/SchoolWorkers')));
const SchoolActivities = Loadable(lazy(() => import('../pages/dashboard/SchoolActivities')));
const SchoolKids = Loadable(lazy(() => import('../pages/dashboard/SchoolKids')));

const Search = Loadable(lazy(() => import('../pages/dashboard/Search')));
const Category = Loadable(lazy(() => import('../pages/dashboard/Category')));
const Workers = Loadable(lazy(() => import('../pages/dashboard/Workers')));

const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));

const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));

const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));

// Main
const HomePage = Loadable(lazy(() => import('../pages/Home')));

const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
