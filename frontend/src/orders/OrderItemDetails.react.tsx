import { Stack } from "@mui/material";
import { Order } from "../types";

interface OrderItemDetailsProps {
    order: Order,
}

export default function OrderItemDetails(props: OrderItemDetailsProps) {
    return (<Stack>
        Order Summary
    </Stack>);
}