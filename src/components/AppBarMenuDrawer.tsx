import {
  Box,
  Drawer,
  PaletteMode,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Brightness2, Brightness4 } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface Props {
  open: boolean;
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
  setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}

const AppBarMenuDrawer = ({ open, onClose, setThemeMode }: Props) => {
  const themeMode = useTheme().palette.mode;
  const navigate = useNavigate();

  return (
    <Drawer anchor={'right'} open={open} onClose={onClose}>
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        <List>
          <ListItem
            button
            key="About"
            onClick={() => {
              if (!window.location.href.endsWith('/about')) navigate('/about');
            }}
          >
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItem>
          <ListItem
            button
            key="Brightness"
            onClick={() =>
              setThemeMode(themeMode === 'light' ? 'dark' : 'light')
            }
          >
            <ListItemIcon>
              {themeMode === 'light' ? <Brightness2 /> : <Brightness4 />}
            </ListItemIcon>
            <ListItemText primary="Brightness" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default AppBarMenuDrawer;
