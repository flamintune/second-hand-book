import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TabBar from './components/TabBar';
import { setRootFontSize } from './utils/viewport';

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
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<LoadingIndicator />}>
          <main className="flex-grow pb-14">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/my-purchases" element={<MyPurchases />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </main>
        </Suspense>
        <TabBar />
      </div>
    </Router>
  );
}

export default App;