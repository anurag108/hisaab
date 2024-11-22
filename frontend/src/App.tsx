import './App.css';
import {
  Box,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import OrderManager from './orders/OrderManager.react';
import TradersCrud from './trader/TradersCrud.react';
import OrderItemsManager from './orders/OrderItemsManager.react';
import HisaabLogin from './login/HisaabLogin.react';
import HisaabAppbar from './HisaabAppbar.react';
import { indigo } from '@mui/material/colors';
import { makeGETCall, makePOSTCall } from './api';
import { AppContext } from './AppContext';
import { BizData, User } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
    }
  }
});

function App() {
  const stringifiedUser = localStorage.getItem("user");
  const [user, setUser] = useState<User | null>(stringifiedUser ? JSON.parse(stringifiedUser) : null);
  const [selectedBiz, setSelectedBiz] = useState<BizData | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>(stringifiedUser ? "HOME" : "");

  const handleLogin = async (loggedInUser: User) => {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setSelectedTab("HOME");
  }

  const handleLogout = async () => {
    localStorage.removeItem("user");
    setUser(null);
    await makePOSTCall("log/out", {});
  };

  const handleTabClick = async (tabId: string) => {
    if (tabId === "LOGOUT") {
      await handleLogout();
      setSelectedTab("");
    } else {
      setSelectedTab(tabId);
    }
  };

  const handleBizSelection = (selectedBiz: BizData) => {
    setSelectedBiz(selectedBiz);
  }

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ user, handleLogin, handleLogout }}>
        {user === null && <HisaabLogin onLogin={handleLogin} />}
        {user !== null &&
          <Box component="main">
            <HisaabAppbar selectedTab={selectedTab} handleTabClick={handleTabClick} onSelectBiz={handleBizSelection} />
            {!selectedBiz && <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 5
            }}>
              Please select a business to continue
            </Box>}
            {selectedBiz &&
              <Box sx={{ m: 1 }}>
                {selectedTab === 'HOME' && <OrderItemsManager businessId={selectedBiz.bizId} />}
                {selectedTab === 'MANAGE_ORDERS' && <OrderManager businessId={selectedBiz.bizId} />}
                {selectedTab === 'MANAGE_TRADERS' && <TradersCrud businessId={selectedBiz.bizId} />}
                {selectedTab === 'MANAGE_ACCOUNT' && <p>Account management coming soon</p>}
              </Box>}
          </Box>
        }
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;