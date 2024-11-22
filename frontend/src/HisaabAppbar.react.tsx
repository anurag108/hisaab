import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Container,
    Tooltip,
    InputLabel,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from "react";
import { BizData } from "./types";
import { makeGETCall } from "./api";

const pages = [
    { id: 'HOME', label: 'Home' },
    { id: 'MANAGE_ORDERS', label: 'Purchase Orders' },
    { id: 'MANAGE_TRADERS', label: 'Traders' },
];

const settings = [
    { id: 'MANAGE_ACCOUNT', label: 'Account' },
    { id: 'LOGOUT', label: 'Logout' }
];

interface HisaabAppbarProps {
    selectedTab: string,
    handleTabClick: (tabId: string) => void,
    onSelectBiz: (bizData: BizData) => void
}

export default function HisaabAppbar(props: HisaabAppbarProps) {
    const { selectedTab, handleTabClick, onSelectBiz } = props;
    const [selectedBiz, setSelectedBiz] = useState<BizData | null>(null);
    const [businesses, setBusinesses] = useState<BizData[]>([]);
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const fetchBusinesses = async () => {
        try {
            const response = await makeGETCall("user/business");
            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    console.error(response);
                    // TODO: Add error handling
                } else {
                    setBusinesses(data.bizData);
                    // if (data.bizData && data.bizData.length > 0) {
                    //     onSelectBiz(data.bizData[0]);
                    // }
                }
            }
        } catch (error) {
            console.error(error);
            // TODO: Add error handling
            throw error;
        }
    };

    useEffect(() => {
        fetchBusinesses().catch(console.error);
    }, []);

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* for bigger screen */}
                    <Typography
                        variant="h4"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Hisaab
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <MenuItem key={page.id} onClick={() => {
                                handleTabClick(page.id);
                            }} sx={
                                selectedTab === page.id ? { border: 1, borderRadius: 1 } : {}
                            }>
                                <Typography sx={{ textAlign: 'center' }}>{page.label}</Typography>
                            </MenuItem>
                        ))}
                    </Box>
                    {businesses.length > 0 &&
                        <Box sx={{ flexGrow: 1 }}>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={selectedBiz?.bizId ?? "NONE"}
                                // onChange={onChangeBiz}
                                autoWidth
                                label="Business"
                                sx={{ border: 1, borderRadius: 1 }}
                            >
                                <MenuItem key={"NONE"} value="NONE">
                                    <Typography sx={{ textAlign: 'center' }}>Select a business</Typography>
                                </MenuItem>
                                {businesses.map((biz) =>
                                    <MenuItem
                                        key={biz.bizId}
                                        value={biz.bizId}
                                        onClick={() => {
                                            setSelectedBiz(biz);
                                            onSelectBiz(biz);
                                        }}>
                                        <Typography
                                            variant="h6"
                                            sx={{ textAlign: 'center' }}>{biz.bizName}
                                        </Typography>
                                    </MenuItem>
                                )}
                            </Select>
                        </Box>
                    }

                    {/* for smaller screen */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.id} onClick={() => {
                                    handleTabClick(page.id);
                                }} selected={selectedTab === page.id}>
                                    <Typography sx={{ textAlign: 'center' }}>{page.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h4"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Hisaab
                    </Typography>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Your Account">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Account" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting.id} onClick={() =>
                                    handleTabClick(setting.id)
                                }>
                                    <Typography sx={{ textAlign: 'center' }}>{setting.label}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}