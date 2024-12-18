import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
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
import { Order, OrderStatus } from '../types';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid2, Modal, TextField } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { makeGETCall, makePOSTCall } from '../api';
import NewOrder from './NewOrder.react';
import { Business } from '@mui/icons-material';

interface OrdersCrudProps {
    businessId: string,
    onOrderClick: (order: Order) => Promise<void>
}

export default function OrdersCrud(props: OrdersCrudProps) {
    const { businessId, onOrderClick } = props;
    const [orders, setOrders] = useState<Order[]>([]);
    const [openNewOrderModal, setOpenNewOrderModal] = useState(false);

    const baseColumnOptions = {
        hideable: true,
        pinnable: false,
        editable: false,
    }

    const handleOrderCreation = (order: Order) => {
        setOrders(orders.concat(order));
    };

    const handleDialogClose = () => {
        setOpenNewOrderModal(false);
    }

    function DataToolbar() {
        return (
            <GridToolbarContainer sx={{ mb: 2 }}>
                <Grid2 container width={'100%'}>
                    <Grid2 size={2} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <Button variant="contained" onClick={() => { setOpenNewOrderModal(true) }}>New Purchase Order</Button>
                    </Grid2>
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

    const fetchPurchaseOrders = async () => {
        const response = await makeGETCall("po/items/all", [{
            name: "businessId",
            value: props.businessId
        }]);
        if (response.ok) {
            const data = await response.json();
            if (!data.error) {
                setOrders(data.expandedOrderItems);
            }
            // TODO: Add error handling
        } else {
            // TODO: Add error handling
            console.log("Response not OK", response);
        }
        return [];
    };

    const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
        try {
            const response = await makePOSTCall("po/" + orderId, {
                status,
                businessId: props.businessId
            });
            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    // TODO: Add error handling
                    console.log(response);
                }
            } else {
                // TODO: Add error handling
                console.log(response);
            }
        } catch (error) {
            // TODO: Add error handling
            console.error(error);
        }
    }

    useEffect(() => {
        fetchPurchaseOrders().catch(console.error);
    }, [props.businessId]);

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
            flex: 0.4,
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
            flex: 0.4,
        },
        {
            field: 'deliveryDate',
            headerName: 'Max Delivery Date',
            ...baseColumnOptions,
            flex: 0.4,
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
                        icon={<ThumbUpIcon color='success' />}
                        onClick={async () => {
                            await updateOrderStatus(params.row.id, OrderStatus.APPROVED);

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
                        icon={<CancelIcon color='error' />}
                        onClick={async () => {
                            await updateOrderStatus(params.row.id, OrderStatus.REJECTED);

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
                        label='Mark Completed'
                        icon={<DoneIcon color='success' />}
                        onClick={async () => {
                            await updateOrderStatus(params.row.id, OrderStatus.COMPLETED);

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
        await onOrderClick(params.row);
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
                    },
                    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
                        py: '8px',
                        overflowWrap: 'break-word',
                    },
                    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                        py: '15px',
                        overflowWrap: 'break-word',
                    },
                    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
                        py: '22px',
                        overflowWrap: 'break-word',
                    },
                }}
                rows={orders.length > 0 ? orders : []}
                getEstimatedRowHeight={() => 200}
                getRowHeight={() => 'auto'}
                columns={columns}
                columnVisibilityModel={{
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
                onRowDoubleClick={handleRowClick}
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
            <NewOrder open={openNewOrderModal} businessId={businessId} handleDialogClose={handleDialogClose} handleOrderCreation={handleOrderCreation}></NewOrder>
        </Box >
    );
}