import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { IconHome, IconUser, IconReport } from '@tabler/icons-react';

const Sidebar = () => {
  return (
    <div className=" relative min-h-screen">
    <Box sx={{ width: 240, height: '100vh', backgroundColor: "transparent",position:"absolute",top:"0",left:"0", }}>
        
      <List>
        <ListItem>
          <ListItemIcon>
            <IconHome />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem >
          <ListItemIcon>
            <IconUser />
          </ListItemIcon>
          <ListItemText primary="Teachers" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <IconReport />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
      </List>
    </Box>
    </div>
  );
};

export default Sidebar;
