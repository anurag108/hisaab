import { Grid2 as Grid, Stack, Box, styled, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button } from "@mui/material";
import { ExpandedOrderItem, Order, OrderItem } from "../types";
import OrderItemsCrud from "./OrderItemsCrud.react";

interface OrderItemDetailsProps {
    order: Order,
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

function OrderSummary(props: OrderItemDetailsProps) {
    const { order } = props;
    return (<Box sx={{ width: '100%' }}>
        <Item>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid size={3.5}>
                    <b>Trader: </b>{order.traderId}
                </Grid>
                <Grid size={3.5}>
                    <b>Total Quantity (Qntl): </b>{order.totalQuantity}
                </Grid>
                <Grid size={3.5}>
                    <b>Rate (₹): </b>{order.rate}
                </Grid>
                <Grid size={3.5}>
                    <b>Contract Date: </b>{order.contractDate}
                </Grid>
                <Grid size={3.5}>
                    <b>Maximum Delivery Date: </b>{order.deliveryDate}
                </Grid>
                <Grid size={3.5}>
                    <b>Order Status: </b>{order.status}
                </Grid>
            </Grid>
        </Item>
    </Box>
    );
}

function OrderTotals(props: OrderItemDetailsProps) {
    const { order } = props;

    let totalClaim = 0.0;
    let totalBardana = 0.0;
    let totalCD2 = 0.0;
    let totalFumigation = 0.0;
    let totalCommission = 0.0;
    let totalOtherDeducation = 0.0;
    let grossWeight = 0.0;

    order.items.forEach((item: OrderItem) => {
        totalClaim += item.claim;
        totalBardana += item.bardana;
        totalCD2 += item.cd2;
        totalFumigation += item.fumigation;
        totalCommission += item.commission;
        totalOtherDeducation += item.otherDeductions;
        grossWeight += item.deliveredQuantity;
    });

    let netWeight = grossWeight - (totalClaim / 100.0);
    let totalAmount = grossWeight * order.rate;
    let netAmount = netWeight * order.rate;

    const deductions = [
        { name: 'Total Claim', value: totalClaim },
        { name: 'Total Bardana', value: totalBardana },
        { name: 'Total CD2', value: totalCD2 },
        { name: 'Total Fumigation', value: totalFumigation },
        { name: 'Total Commission', value: totalCommission },
        { name: 'Total Other Deductions', value: totalOtherDeducation },
    ];

    const weights = [
        { name: 'Gross Weight', value: grossWeight },
        { name: 'Net Weight', value: netWeight }
    ];
    const amounts = [
        { name: 'Total Amount', value: totalAmount },
        { name: 'Net Amount', value: netAmount }
    ]

    return (
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'right' }}>
            <TableContainer component={Paper} sx={{ maxWidth: 300, height: '100%' }}>
                <Table>
                    <TableBody>
                        {deductions.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{row.name}</TableCell>
                                <TableCell align="right">{row.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >
            <TableContainer component={Paper} sx={{ maxWidth: 300, height: '100%' }}>
                <Table>
                    <TableBody>
                        {weights.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{row.name}</TableCell>
                                <TableCell align="right">{row.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >
            <TableContainer component={Paper} sx={{ maxWidth: 300, height: '100%' }}>
                <Table>
                    <TableBody>
                        {amounts.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{row.name}</TableCell>
                                <TableCell align="right">{row.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >
        </Stack>
    );
}

function Footer() {
    return (
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'right' }}>
            <Button variant="contained" color="inherit" onClick={() => { window.print() }}>Print</Button>
        </Stack>
    )
}

export default function OrderItemDetails(props: OrderItemDetailsProps) {
    const { order } = props;
    let initialItems: ExpandedOrderItem[] = [];
    const expandedItems = order.items.map((item) => {
        return {
            id: item.id,
            poId: order.id,
            businessId: order.businessId,
            traderId: order.traderId,
            partyId: item.partyId,
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

    return (
        <Stack spacing={2}>
            <OrderSummary order={props.order} />
            <OrderItemsCrud businessId={props.order.businessId} onOrderClick={async () => { }} />
            <OrderTotals order={props.order} />
            <Footer />
        </Stack>
    );
}