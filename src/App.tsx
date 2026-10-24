import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { restoreSession } from './app/auth/authThunks';
import { router } from './routes';

const App = () => {
  const dispatch = useAppDispatch();
  const sessionStatus = useAppSelector((state) => state.auth.sessionStatus);

  useEffect(() => {
    if (sessionStatus === 'idle') {
      dispatch(restoreSession());
    }
  }, [dispatch, sessionStatus]);

  return <RouterProvider router={router} />;
};

export default App;
