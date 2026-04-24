import { createHashRouter, Navigate, Outlet } from 'react-router-dom';
import App from './App';
import { DrillingProgressPage } from './pages/DrillingProgressPage';
import { TremiePlacementPage } from './pages/TremiePlacementPage';

function RootLayout() {
  return (
    <App>
      <Outlet />
    </App>
  );
}

export function getRouteDefinitions() {
  return [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/drilling-progress" replace />,
        },
        {
          path: '/drilling-progress',
          element: <DrillingProgressPage />,
        },
        {
          path: '/tremie-placement',
          element: <TremiePlacementPage />,
        },
      ],
    },
  ];
}

export function createAppRouter() {
  return createHashRouter(getRouteDefinitions());
}

export const appRouter = createAppRouter();
