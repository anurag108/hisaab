import './App.css';
import {
  Box,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { useState } from 'react';
import OrderManager from './orders/OrderManager.react';
import TradersCrud from './trader/TradersCrud.react';
import OrderItemsManager from './orders/OrderItemsManager.react';
import HisaabLogin from './login/HisaabLogin.react';
import HisaabAppbar from './HisaabAppbar.react';
import { indigo } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
    }
  }
});

function App() {
  const [selectedTab, setSelectedTab] = useState('HOME');
  const handleTabClick = (tabId: string) => {
    setSelectedTab(tabId);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box component="main">
        <HisaabAppbar selectedTab={selectedTab} handleTabClick={handleTabClick} />
        <Box sx={{ m: 1 }}>
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