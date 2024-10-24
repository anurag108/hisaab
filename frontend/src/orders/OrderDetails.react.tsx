import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid';
import { Order, OrderItem } from '../types';

// interface SubtotalHeader {
//     id: 'SUBTOTAL';
//     label: string;
//     subtotal: number;
// }

// interface TaxHeader {
//     id: 'TAX';
//     label: string;
//     taxRate: number;
//     taxTotal: number;
// }

// interface TotalHeader {
//     id: 'TOTAL';
//     label: string;
//     total: number;
// }

// type Row = OrderItem | SubtotalHeader | TaxHeader | TotalHeader;

const baseColumnOptions = {
    sortable: false,
    pinnable: false,
    hideable: true,
    flex: 1
};

// const getCellClassName: DataGridProps['getCellClassName'] = ({ row, field }) => {
//     if (row.id === 'SUBTOTAL' || row.id === 'TOTAL' || row.id === 'TAX') {
//         if (field === 'item') {
//             return 'bold';
//         }
//     }
//     return '';
// };

interface OrderDetailsProps {
    order: Order
}

export default function OrderDetails(props: OrderDetailsProps) {
    // const rows: Row[] = [
    //     ...props.order.items,
    //     { id: 'SUBTOTAL', label: 'Subtotal', subtotal: 624 },
    //     { id: 'TAX', label: 'Tax', taxRate: 10, taxTotal: 62.4 },
    //     { id: 'TOTAL', label: 'Total', total: 686.4 },
    // ];

    // const columns: GridColDef<Row>[] = [
    //     {
    //         field: 'item',
    //         headerName: 'Item/Description',
    //         ...baseColumnOptions,
    //         flex: 3,
    //         colSpan: (value, row) => {
    //             if (row.id === 'SUBTOTAL' || row.id === 'TOTAL') {
    //                 return 3;
    //             }
    //             if (row.id === 'TAX') {
    //                 return 2;
    //             }
    //             return undefined;
    //         },
    //         valueGetter: (value, row) => {
    //             if (row.id === 'SUBTOTAL' || row.id === 'TAX' || row.id === 'TOTAL') {
    //                 return row.label;
    //             }
    //             return value;
    //         },
    //     },
    //     {
    //         field: 'quantity',
    //         headerName: 'Quantity',
    //         ...baseColumnOptions,
    //         flex: 1,
    //         sortable: false,
    //     },
    //     {
    //         field: 'price',
    //         headerName: 'Price',
    //         flex: 1,
    //         ...baseColumnOptions,
    //         valueGetter: (value, row) => {
    //             if (row.id === 'TAX') {
    //                 return `${row.taxRate}%`;
    //             }
    //             return value;
    //         },
    //     },
    //     {
    //         field: 'total',
    //         headerName: 'Total',
    //         flex: 1,
    //         ...baseColumnOptions,
    //         valueGetter: (value, row) => {
    //             if (row.id === 'SUBTOTAL') {
    //                 return row.subtotal;
    //             }
    //             if (row.id === 'TAX') {
    //                 return row.taxTotal;
    //             }
    //             if (row.id === 'TOTAL') {
    //                 return row.total;
    //             }
    //             return row.price * row.quantity;
    //         },
    //     },
    // ];

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Item ID',
            editable: false,
            ...baseColumnOptions
        },
        {
            field: 'partyId',
            headerName: 'Party ID',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'vehicleNumber',
            headerName: 'Vehicle Number',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'gateEntryNumber',
            headerName: 'Gate Entry Number',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'billNumber',
            headerName: 'Bill Number',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'claim',
            headerName: 'Claim',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'bardana',
            headerName: 'Bardana',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'fumigation',
            headerName: 'Fumigation',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'cd2',
            headerName: 'CD2',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'otherDeductions',
            headerName: 'Other Deductions',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'commission',
            headerName: 'Commission',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'status',
            headerName: 'Status',
            editable: true,
            ...baseColumnOptions
        },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                '& .bold': {
                    fontWeight: 600,
                },
            }}
        >
            <DataGrid
                disableColumnFilter
                disableRowSelectionOnClick
                hideFooter
                showCellVerticalBorder
                showColumnVerticalBorder
                columns={columns}
                rows={props.order.items.length > 0 ? props.order.items : []}
            />
        </Box>
    );
}
