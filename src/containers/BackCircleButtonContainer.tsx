import { useNavigate } from 'react-router-dom';
import BackCircleButton from '../components/atoms/BackCircleButton/BackCircleButton';

const BackCircleButtonContainer = () => {
  const navigate = useNavigate();

  const onClick = () => {
    window.history.back();
    setTimeout(() => navigate('/'), 10);
  };

  return <BackCircleButton onClick={onClick} />;
};

export default BackCircleButtonContainer;
