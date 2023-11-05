import { useNavigate } from '@tanstack/react-router';
import { TopLeftBackButton } from '../components/atoms/BackButton/BackButton';

const TopLeftBackButtonContainer = () => {
  const navigate = useNavigate();

  const onClick = () => {
    window.history.back();
    setTimeout(() => navigate({ to: '/' }), 10);
  };

  return <TopLeftBackButton onClick={onClick} />;
};

export default TopLeftBackButtonContainer;
