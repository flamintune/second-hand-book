import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import TabBar from './components/TabBar';
import { setRootFontSize } from './utils/viewport';
import AuthPage from './pages/AuthPage';
import DeclarationOfUse from './pages/DeclarationOfUse';
import Setting from './pages/Setting';
import AddProduct from './pages/AddProduct';
import BookSearch from './pages/BookSearch';
import { UserProvider } from './contexts/UserContext';

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

const AppContent: React.FC = () => {
  const location = useLocation();
  const tabBarPages = ["/home","/my-purchases","/sell","/profile"];
  const showTabBar = tabBarPages.includes(location.pathname);

  const token = localStorage.getItem('token');
  if (!token && location.pathname !== '/login' && location.pathname !== '/declaration') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow">
        <Suspense fallback={<LoadingIndicator />}>
          <Routes>
            <Route path="/declaration" element={<DeclarationOfUse />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/book-search" element={<BookSearch />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/my-purchases" element={<MyPurchases />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/profile" element={<Profile />} />
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
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;