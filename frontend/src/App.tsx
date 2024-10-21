import './App.css';
import {
  Box,
  ThemeProvider,
  createTheme,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
  AppBar, Toolbar, Typography
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useState } from 'react';
import PartyCrud from './parties/PartyCrud.react';
import OrderCrud from './orders/OrderCrud.react';

const theme = createTheme();
const sidebarWidth = 240;

function App() {
  const [selectedTab, setSelectedTab] = useState('HOME');

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tabId: string,
  ) => {
    setSelectedTab(tabId);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>

        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'start' }}>
              Hisaab
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: sidebarWidth,
              boxSizing: 'border-box',
              top: 64, // AppBar height
              height: 'calc(100% - 64px)', // Full height minus AppBar height
            },
          }}
        >
          <List component="nav">
            <ListItemButton
              selected={selectedTab === 'HOME'}
              onClick={(event) => handleListItemClick(event, 'HOME')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton
              selected={selectedTab === 'MANAGE_PARTY'}
              onClick={(event) => handleListItemClick(event, 'MANAGE_PARTY')}>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Parties" />
            </ListItemButton>
            <ListItemButton
              selected={selectedTab === 'MANAGE_ACCOUNT'}
              onClick={(event) => handleListItemClick(event, 'MANAGE_ACCOUNT')}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="My Account" />
            </ListItemButton>
          </List>
          <Divider />
          <List>
            <ListItemButton
              selected={selectedTab === 'LOGOUT'}
              onClick={(event) => handleListItemClick(event, 'LOGOUT')}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 2.5, mt: 6.5 }}>
          {selectedTab === 'HOME' && <OrderCrud />}
          {selectedTab === 'MANAGE_PARTY' && <PartyCrud />}
          {selectedTab === 'MANAGE_ACCOUNT' && <p>Account management coming soon</p>}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;