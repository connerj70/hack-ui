import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/contexts/userContext';

const AuthWrapper = (props: any) => {
  const { currentUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, navigate]);

  return currentUser ? props.children : null;
};

export default AuthWrapper
