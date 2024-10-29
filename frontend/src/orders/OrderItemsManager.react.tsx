import { useState } from "react";
import mockOrders from '../data/orders.json'
import { ExpandedOrderItem, Order } from "../types";
import { Box, Button } from "@mui/material";
import OrderItemDetails from "./OrderItemDetails.react";
import OrderItemsCrud from "./OrderItemsCrud.react";

export default function OrderItemsManager() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    let initialItems: ExpandedOrderItem[] = [];
    mockOrders.map((order) => {
        const expandedItems = order.items.map((item) => {
            return {
                id: item.id,
                businessId: order.businessId,
                traderId: order.traderId,
                partyId: item.partyId,
                orderId: order.id,
                quantity: item.quantity,
                deliveredQuantity: item.deliveredQuantity,
                vehicleNumber: item.vehicleNumber,
                gateEntryNumber: item.gateEntryNumber,
                billNumber: item.billNumber,
                claim: item.claim,
                bardana: item.bardana,
                fumigation: item.fumigation,
                cd2: item.cd2,
                commission: item.commission,
                otherDeductions: item.otherDeductions,
                creationTime: item.creationTime,
                deliveryDate: item.deliveryDate,
                updateTime: item.updateTime,
                status: item.status
            };
        });
        initialItems = initialItems.concat(expandedItems);
    });

    const handleOrderClick = async (orderItem: ExpandedOrderItem) => {
        const order = mockOrders.find((order) => order.id === orderItem.orderId) as Order;
        setSelectedOrder(order);
    };

    const handleBackButton = () => {
        setSelectedOrder(null);
    }

    return (
        <Box>
            {selectedOrder === null && <OrderItemsCrud initialItems={initialItems} onOrderClick={handleOrderClick} />}
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