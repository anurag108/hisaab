import React, { useState } from 'react';
import Box from '@mui/material/Box';
import {
    GridRowsProp,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridToolbarExport,
    GridRowParams,
    GridRenderCellParams,
    GridToolbarQuickFilter,
    GridToolbarFilterButton,
    GridCallbackDetails,
    MuiEvent,
} from '@mui/x-data-grid';
import { Order } from '../types';
import { Chip, Grid2 } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';

function DataToolbar() {
    return (
        <GridToolbarContainer sx={{ mb: 2 }}>
            <Grid2 container width={'100%'}>
                <Grid2 size={2} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <GridToolbarFilterButton slotProps={{
                        tooltip: { title: 'Filter purchase orders' },
                        button: { variant: 'contained', size: 'medium' }
                    }} />
                </Grid2>
                <Grid2 size={'grow'}>
                    <GridToolbarQuickFilter />
                </Grid2>
                <Grid2 size={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <GridToolbarExport slotProps={{
                        tooltip: { title: 'Export purchase orders' },
                        button: { variant: 'contained', size: 'medium' }
                    }} />
                </Grid2>
            </Grid2>
        </GridToolbarContainer>
    );
}

interface OrdersCrudProps {
    initialOrders: GridRowsProp,
    onOrderClick: (order: Order) => Promise<void>
}

const VISIBLE_COLUMNS = ['traderId', 'totalQuantity', 'rate', 'contractDate', 'deliveryDate', 'status'];

export default function OrdersCrud(props: OrdersCrudProps) {
    const [orders, setOrders] = useState(props.initialOrders);
    const baseColumnOptions = {
        hideable: true,
        pinnable: false,
        editable: false,
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Order ID',
            ...baseColumnOptions,
            filterable: false,
        },
        {
            field: 'businessId',
            headerName: 'Business ID',
            ...baseColumnOptions,
            filterable: false,
        },
        {
            field: 'traderId',
            headerName: 'Trader ID',
            ...baseColumnOptions,
            flex: 1,
        },
        {
            field: 'totalQuantity',
            headerName: 'Total Quantity (Qntl)',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions,
            flex: 0.6,
        },
        {
            field: 'rate',
            headerName: 'Rate (₹)',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions,
            flex: 0.4,
        },
        {
            field: 'contractDate',
            headerName: 'Contract Date',
            ...baseColumnOptions,
            flex: 0.7,
        },
        {
            field: 'deliveryDate',
            headerName: 'Delivery Date',
            ...baseColumnOptions,
            flex: 0.7,
        },
        {
            field: 'status',
            headerName: 'Status',
            type: 'singleSelect',
            valueOptions: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED'],
            ...baseColumnOptions,
            flex: 0.7,
            renderCell: (params: GridRenderCellParams) => {
                switch (params.value) {
                    case 'PENDING_APPROVAL':
                        return (<Chip label={params.value} color='secondary' />);
                    case 'APPROVED':
                        return (<Chip label={params.value} color='primary' />);
                    case 'REJECTED':
                        return (<Chip label={params.value} color='error' />);
                    case 'IN_PROGRESS':
                        return (<Chip label={params.value} color='warning' />);
                    case 'COMPLETED':
                        return (<Chip label={params.value} color='success' />);
                    default:
                        throw new Error('Unexpected purchase order status');
                }
            }
        },
        {
            field: 'creationTime',
            headerName: 'Creation Time',
            valueGetter: (param) => new Date(parseInt(param)).toLocaleString(),
            ...baseColumnOptions,
            filterable: false,
        },
        {
            field: 'updateTime',
            headerName: 'Last Update Time',
            valueGetter: (param) => new Date(parseInt(param)).toLocaleString(),
            ...baseColumnOptions,
            filterable: false,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            ...baseColumnOptions,
            cellClassName: 'actions',
            flex: 0.3,
            getActions: (params: GridRowParams) => {
                const approveAction = (
                    <GridActionsCellItem
                        label='Approve'
                        icon={<DoneIcon />}
                        onClick={async () => {
                            // TODO: Call API
                            // set status & update view
                            const updatedOrders = orders.map((order) => {
                                if (order.id === params.row.id) {
                                    order.status = 'APPROVED';
                                }
                                return order;
                            })
                            setOrders(updatedOrders);
                        }}
                        showInMenu />
                );

                const rejectAction = (
                    <GridActionsCellItem
                        label='Reject'
                        icon={<CancelIcon />}
                        onClick={async () => {
                            // TODO: Call API
                            // set status & update view
                            const updatedOrders = orders.map((order) => {
                                if (order.id === params.row.id) {
                                    order.status = 'REJECTED';
                                }
                                return order;
                            })
                            setOrders(updatedOrders);
                        }}
                        showInMenu />
                );

                const completeAction = (
                    <GridActionsCellItem
                        label='Completed'
                        icon={<CancelIcon />}
                        onClick={async () => {
                            // TODO: Call API
                            // set status & update view
                            const updatedOrders = orders.map((order) => {
                                if (order.id === params.row.id) {
                                    order.status = 'COMPLETED';
                                }
                                return order;
                            })
                            setOrders(updatedOrders);
                        }}
                        showInMenu />
                );

                switch (params.row.status) {
                    case 'PENDING_APPROVAL':
                        return [approveAction, rejectAction];
                    case 'APPROVED':
                        return [rejectAction, completeAction];
                    case 'REJECTED':
                        return [approveAction];
                    case 'IN_PROGRESS':
                        return [completeAction];
                    default:
                        return [];
                }
            }
        },
    ];

    const handleRowClick = async (params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => {
        const order = params.row;
        await props.onOrderClick(order);
    };

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                sx={{
                    "& .MuiDataGrid-columnHeaderTitle": {
                        whiteSpace: "normal",
                        lineHeight: "normal",
                        fontWeight: "bold",
                    },
                    "& .MuiDataGrid-columnHeader": {
                        // Forced to use important since overriding inline styles
                        height: "unset !important"
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        // Forced to use important since overriding inline styles
                        maxHeight: "168px !important"
                    }
                }}
                rows={orders.length > 0 ? orders : []}
                columns={columns}
                columnVisibilityModel={{
                    id: false,
                    businessId: false,
                    creationTime: false,
                    updateTime: false,
                }}
                initialState={{
                    filter: {
                        filterModel: {
                            items: [],
                            quickFilterExcludeHiddenColumns: true,
                        },
                    },
                }}
                onRowClick={handleRowClick}
                editMode="row"
                showCellVerticalBorder
                showColumnVerticalBorder
                disableRowSelectionOnClick
                disableColumnResize
                disableColumnMenu
                disableColumnSelector
                slots={{
                    toolbar: DataToolbar,
                }}
            />
        </Box >
    );
}