import { Box, Typography } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

/**
 * For SwipeableViews
 */
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box
          sx={{
            '@media (min-width: 690px)': { py: 2 },
            '@media (max-width: 689px)': { py: 1 },
          }}
        >
          {children}
        </Box>
      )}
    </Typography>
  );
};

export default TabPanel;
