import { FC, PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props extends PropsWithChildren {
  isAllowed: boolean;
}

const ProtectedRoute: FC<Props> = ({ isAllowed, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAllowed) {
      navigate('/login');
    }
  }, [navigate, isAllowed]);

  return children;
};

export default ProtectedRoute;
