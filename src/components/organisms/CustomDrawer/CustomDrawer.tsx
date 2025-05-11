import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

interface CustomDrawerProps {
  open: boolean;
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
  items: { Icon: React.ReactNode; label: string; onClick: () => void }[];
}

export const CustomDrawer = ({ open, onClose, items }: CustomDrawerProps) => (
  <Drawer anchor="right" open={open} onClose={onClose}>
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <List>
        {items.map(({ Icon, label, onClick }) => (
          <ListItemButton key={label} onClick={onClick}>
            <ListItemIcon>{Icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  </Drawer>
);
