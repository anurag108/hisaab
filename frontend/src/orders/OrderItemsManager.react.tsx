import { useState } from "react";
import { Order } from "../types";
import { Box, Button } from "@mui/material";
import OrderItemDetails from "./OrderItemDetails.react";
import OrderItemsCrud from "./OrderItemsCrud.react";

interface OrderItemsManagerProps {
    businessId: string
}

export default function OrderItemsManager(props: OrderItemsManagerProps) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const handleOrderClick = async (order: Order) => {
        setSelectedOrder(order);
    };

    const handleBackButton = () => {
        setSelectedOrder(null);
    }

    return (
        <Box>
            {selectedOrder === null && <OrderItemsCrud businessId={props.businessId} onOrderClick={handleOrderClick} />}
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