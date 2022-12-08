import { Brightness2, Brightness4 } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { PaletteMode } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CustomDrawer from '../components/organisms/CustomDrawer/CustomDrawer';

interface Props {
  open: boolean;
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
  setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}

const AppBarMenuDrawerContainer = ({ open, onClose, setThemeMode }: Props) => {
  const { t } = useTranslation();
  const themeMode = useTheme().palette.mode;
  const navigate = useNavigate();

  const onClickAbout = () => {
    if (!window.location.href.endsWith('/about')) navigate('/about');
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
