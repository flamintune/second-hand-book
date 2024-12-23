import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import TabBar from './components/TabBar';
import { setRootFontSize } from './utils/viewport';
import AuthPage from './pages/AuthPage';
import DeclarationOfUse from './pages/DeclarationOfUse';
import Setting from './pages/Setting';
import AddProduct from './pages/AddProduct';
import BookSearch from './pages/BookSearch';

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'));
const MyPurchases = lazy(() => import('./pages/MyPurchases'));
const Sell = lazy(() => import('./pages/Sell'));
const Profile = lazy(() => import('./pages/Profile'));

// 加载指示器组件
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

setRootFontSize();

// 受保护的路由组件
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

// 公共路由组件（登录页面专用）
const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/home" replace />;
  }
  return element;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const tabBarPages = ["/home","/my-purchases","/sell","/profile"];
  const showTabBar = tabBarPages.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow">
        <Suspense fallback={<LoadingIndicator />}>
          <Routes>
            {/* 公共路由 */}
            <Route path="/declaration" element={<DeclarationOfUse />} />
            <Route path="/login" element={<PublicRoute element={<AuthPage />} />} />
            
            {/* 受保护的路由 */}
            <Route path="/setting" element={<ProtectedRoute element={<Setting />} />} />
            <Route path="/add-product" element={<ProtectedRoute element={<AddProduct />} />} />
            <Route path="/book-search" element={<ProtectedRoute element={<BookSearch />} />} />
            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/my-purchases" element={<ProtectedRoute element={<MyPurchases />} />} />
            <Route path="/sell" element={<ProtectedRoute element={<Sell />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            
            {/* 默认路由 */}
            <Route path="/*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </main>
      {showTabBar && (
        <footer className="mt-auto">
          <TabBar />
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;