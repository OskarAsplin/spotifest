import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
  items: { Icon: React.ReactNode; label: string; onClick: () => void }[];
}

const AppBarMenuDrawer = ({ open, onClose, items }: Props) => (
  <Drawer anchor={'right'} open={open} onClose={onClose}>
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <List>
        {items.map(({ Icon, label, onClick }) => (
          <ListItem button key={label} onClick={onClick}>
            <ListItemIcon>{Icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </Box>
  </Drawer>
);

export default AppBarMenuDrawer;
