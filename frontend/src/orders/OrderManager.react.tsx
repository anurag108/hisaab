import { useState } from "react";
import mockOrders from '../data/orders.json'
import OrderDetails from "./OrderDetails.react";
import OrdersCrud from "./OrdersCrud.react";
import { Order } from "../types";
import { Box, Button } from "@mui/material";

export default function OrderManager() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleOrderClick = async (order: Order) => {
        setSelectedOrder(order);
    };

    const handleBackButton = () => {
        setSelectedOrder(null);
    }

    return (<Box>
        {selectedOrder === null && <OrdersCrud initialOrders={mockOrders} onOrderClick={handleOrderClick} />}
        {selectedOrder !== null &&
            <Box>
                <Button variant="contained" onClick={handleBackButton}>Back</Button>
                <Box sx={{ mt: 3 }}>
                    <OrderDetails order={selectedOrder} />
                </Box>
            </Box>}
    </Box>);
}