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
import { makePOSTCall } from './api';
import { AppContext } from './AppContext';
import { User } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
    }
  }
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("");

  const handleLogin = (loggedInUser: User) => {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    setSelectedTab("HOME");
    // TODO: fetch all businesses for this user
  }

  const handleLogout = async () => {
    localStorage.removeItem("user");
    setUser(null);
    await makePOSTCall("/log/out", {});
  };

  const handleTabClick = async (tabId: string) => {
    if (tabId === "LOGOUT") {
      await handleLogout();
      setSelectedTab("");
    } else {
      setSelectedTab(tabId);
    }
  };

  useEffect(() => {
    const stringifiedUser = localStorage.getItem("user");
    if (stringifiedUser) {
      setUser(JSON.parse(stringifiedUser));
      setSelectedTab("HOME");
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ user, handleLogin, handleLogout }}>
        {user === null && <HisaabLogin onLogin={handleLogin} />}
        {user !== null &&
          <Box component="main">
            <HisaabAppbar selectedTab={selectedTab} handleTabClick={handleTabClick} />
            <Box sx={{ m: 1 }}>
              {selectedTab === 'HOME' && <OrderItemsManager businessId="0WPwZoM10n1J0O7YFsLo" />}
              {selectedTab === 'MANAGE_ORDERS' && <OrderManager businessId="0WPwZoM10n1J0O7YFsLo" />}
              {selectedTab === 'MANAGE_TRADERS' && <TradersCrud businessId="0WPwZoM10n1J0O7YFsLo" />}
              {selectedTab === 'MANAGE_ACCOUNT' && <p>Account management coming soon</p>}
            </Box>
          </Box>
        }
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;