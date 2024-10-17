import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Link from 'next/link';

const style = {
    p: 0,
    width: '100%',
    maxWidth: 360,
    borderRadius: 0,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: '#90CAF9',
};

const menuItems = [
    {
        "id": "purchaseOrders",
        "name": "Purchase Order",
        "onClickUrl": "/",
    },
    {
        "id": "sellOrders",
        "name": "Sell Order",
        "onClickUrl": "/sell",
    },
    {
        "id": "brokers",
        "name": "Manage Brokers",
        "onClickUrl": "/brokers",
    },
    {
        "id": "account",
        "name": "My Account",
        "onClickUrl": "/account",
    },
    {
        "id": "logout",
        "name": "Logout",
        "onClickUrl": "/logout",
    },
];

export default function HisaabMenuBar() {
    return (
        <List sx={style}>
            {menuItems.map((item, index) => (
                <ListItem key={item.id} alignItems='flex-start'>
                    <ListItemButton divider>
                        <Link href={item.onClickUrl}>{item.name}</Link>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}
