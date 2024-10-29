import { useState } from "react";
import mockOrders from '../data/orders.json'
import OrdersCrud from "./OrdersCrud.react";
import { Order } from "../types";
import { Box, Button } from "@mui/material";
import OrderItemDetails from "./OrderItemDetails.react";

export default function OrderManager() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleOrderClick = async (order: Order) => {
        setSelectedOrder(order);
    };

    const handleBackButton = () => {
        setSelectedOrder(null);
    }

    return (
        <Box>
            {selectedOrder === null && <OrdersCrud initialOrders={mockOrders} onOrderClick={handleOrderClick} />}
            {selectedOrder !== null &&
                <Box>
                    <Button variant="contained" onClick={handleBackButton}>Back</Button>
                    <Box sx={{ mt: 3 }}>
                        <OrderItemDetails order={selectedOrder} />
                    </Box>
                </Box>}
        </Box>
    );
}