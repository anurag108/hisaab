import { useState } from "react";
import OrdersCrud from "./OrdersCrud.react";
import { Order } from "../types";
import { Box, Button } from "@mui/material";
import OrderItemDetails from "./OrderItemDetails.react";

interface OrderManagerProps {
    businessId: string
}

export default function OrderManager(props: OrderManagerProps) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleOrderClick = async (order: Order) => {
        setSelectedOrder(order);
    };

    const handleBackButton = () => {
        setSelectedOrder(null);
    }

    return (
        <Box>
            {selectedOrder === null && <OrdersCrud businessId={props.businessId} onOrderClick={handleOrderClick} />}
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