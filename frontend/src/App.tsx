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
import ViewListIcon from '@mui/icons-material/ViewList';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useState } from 'react';
import OrderManager from './orders/OrderManager.react';
import TradersCrud from './trader/TradersCrud.react';
import OrderItemsManager from './orders/OrderItemsManager.react';
import HisaabLogin from './login/HisaabLogin.react';

const theme = createTheme();
const sidebarWidth = 180;

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
      <Box component="main" sx={{ mt: 9, mr: 1, ml: 23, mb: 1 }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, textAlign: 'start' }}>
              Hisaab
            </Typography>
          </Toolbar>
        </AppBar>

        {selectedTab !== 'LOGOUT' && <Drawer
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
              selected={selectedTab === 'MANAGE_ORDERS'}
              onClick={(event) => handleListItemClick(event, 'MANAGE_ORDERS')}>
              <ListItemIcon>
                <ViewListIcon />
              </ListItemIcon>
              <ListItemText primary="Purchase Orders" />
            </ListItemButton>
            <ListItemButton
              selected={selectedTab === 'MANAGE_TRADERS'}
              onClick={(event) => handleListItemClick(event, 'MANAGE_TRADERS')}>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Traders" />
            </ListItemButton>
            <ListItemButton
              selected={selectedTab === 'MANAGE_ACCOUNT'}
              onClick={(event) => handleListItemClick(event, 'MANAGE_ACCOUNT')}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Account" />
            </ListItemButton>
          </List>
          <Divider />
          <List>
            <ListItemButton
              selected={selectedTab === 'LOGOUT'}
              onClick={(event) => handleListItemClick(event, 'LOGOUT')}>
              <ListItemIcon>
                <ExitToAppIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Drawer>
        }

        <Box>
          {selectedTab === 'HOME' && <OrderItemsManager />}
          {selectedTab === 'MANAGE_ORDERS' && <OrderManager />}
          {selectedTab === 'MANAGE_TRADERS' && <TradersCrud />}
          {selectedTab === 'MANAGE_ACCOUNT' && <p>Account management coming soon</p>}
          {selectedTab === 'LOGOUT' && <HisaabLogin onLogin={() => setSelectedTab('HOME')} />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;