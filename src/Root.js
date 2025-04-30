import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth } from './redux/slices/authSlice';
import { Outlet } from 'react-router-dom';

function Root() {
  const dispatch = useDispatch();
  const { isInitialized, isLoading, isAuthenticated } = useSelector((state) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    console.log('Root: Dispatching initializeAuth');
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!isInitialized || isLoading) {
    console.log('Root: Waiting for auth initialization');
    return <div className="loading-spinner">Loading...</div>;
  }

  console.log('Root: Rendering Outlet, isAuthenticated:', isAuthenticated);

  return <Outlet />;
}

export default Root;