import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import Box from '@mui/material/Box';

import routes from '..';
import { getPageHeight } from './utils';

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function Pages() {
  return (
    <Box sx={{ height: (theme) => getPageHeight(theme) }}>
      <Routes>
        {Object.values(routes).map(({ protect, path, component: Component }) => {
          if (protect) {
            return (
              <Route key={path} path={path} element={<ProtectedRoute />}>
                <Route key={path} path={path} element={<Component />} />
              </Route>
            );
          }
          return <Route key={path} path={path} element={<Component />} />;
        })}
      </Routes>
    </Box>
  );
}

export default Pages;
