import { Brightness2, Brightness4 } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import CustomDrawer from '../components/organisms/CustomDrawer/CustomDrawer';
import { setThemeMode } from '../zustand/themeStore';

interface Props {
  open: boolean;
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const AppBarMenuDrawerContainer = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const themeMode = useTheme().palette.mode;

  const onClickAbout = () => {
    if (!window.location.href.endsWith('/about')) navigate({ to: '/about' });
  };
  const onClickBrightness = () =>
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');

  const items = [
    { Icon: <InfoIcon />, label: t('common.about'), onClick: onClickAbout },
    {
      Icon: themeMode === 'light' ? <Brightness2 /> : <Brightness4 />,
      label: t('common.brightness'),
      onClick: onClickBrightness,
    },
  ];

  return <CustomDrawer open={open} onClose={onClose} items={items} />;
};

export default AppBarMenuDrawerContainer;
