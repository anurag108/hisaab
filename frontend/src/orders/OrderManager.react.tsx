import { useEffect, useState } from "react";
import mockOrders from '../data/orders.json'
import OrderDetails from "./OrderDetails.react";
import OrdersCrud from "./OrdersCrud.react";
import { Order } from "../types";
import { Box, Button } from "@mui/material";

export default function OrderManager() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleOrderClick = async (order: Order) => {
        console.log("Clicked on order", order);
        setSelectedOrder(order);
    };

    const handleBackButton = () => {
        setSelectedOrder(null);
    }

    return (<div>
        {selectedOrder === null && <OrdersCrud initialOrders={mockOrders} onOrderClick={handleOrderClick} />}
        {selectedOrder !== null &&
            <Box>
                <Button variant="contained" onClick={handleBackButton}>Back</Button>
                <Box sx={{ mt: 3 }}>
                    <OrderDetails order={selectedOrder} />
                </Box>
            </Box>}
    </div>);
}