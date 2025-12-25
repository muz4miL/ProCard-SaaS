import { lazy } from 'react';

import { Navigate } from 'react-router-dom';

// === AUTHENTICATION ===
const Logout = lazy(() => import('@/pages/Logout.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));

// === CORE PAGES ===
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const About = lazy(() => import('@/pages/About'));

// === SETTINGS ===
const Settings = lazy(() => import('@/pages/Settings/Settings'));

// === PROCARD SAAS - CARD MANAGEMENT ===
const CardList = lazy(() => import('@/pages/Card/CardList'));
const CardCreate = lazy(() => import('@/pages/Card/CardCreate'));
const CardEdit = lazy(() => import('@/pages/Card/CardEdit'));
const CardPreview = lazy(() => import('@/pages/Card/CardPreview'));
const PublicCardView = lazy(() => import('@/pages/Card/PublicCardView'));

let routes = {
  expense: [],
  default: [
    {
      path: '/login',
      element: <Navigate to="/" />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/about',
      element: <About />,
    },

    // === MAIN ROUTES ===
    {
      path: '/',
      element: <Dashboard />,
    },

    // === CARD MANAGEMENT (ProCard SaaS) ===
    {
      path: '/cards',
      element: <CardList />,
    },
    {
      path: '/cards/create',
      element: <CardCreate />,
    },
    {
      path: '/cards/edit/:id',
      element: <CardEdit />,
    },
    {
      path: '/cards/:id/preview',
      element: <CardPreview />,
    },
    // === PUBLIC CARD VIEW (No Auth Required) ===
    {
      path: '/cards/v/:slug',
      element: <PublicCardView />,
    },

    // === SETTINGS ===
    {
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/settings/edit/:settingsKey',
      element: <Settings />,
    },

    // === USER ===
    {
      path: '/profile',
      element: <Profile />,
    },

    // === 404 ===
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default routes;
