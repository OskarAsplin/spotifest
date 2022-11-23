import { useNavigate } from 'react-router-dom';
import { TopLeftBackButton } from '../components/atoms/BackButton/BackButton';

const TopLeftBackButtonContainer = () => {
  const navigate = useNavigate();

  const onClick = () => {
    window.history.back();
    setTimeout(() => navigate('/'), 10);
  };

  return <TopLeftBackButton onClick={onClick} />;
};

export default TopLeftBackButtonContainer;
