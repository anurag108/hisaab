import { useState } from 'react';
import Box from '@mui/material/Box';
import {
    GridRowsProp,
    GridRowModesModel,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridSlots,
    GridToolbarExport,
    GridCallbackDetails,
    GridRowParams,
    MuiEvent,
    GridRenderCellParams,
} from '@mui/x-data-grid';
import { Order } from '../types';
import { Chip } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    return (
        <GridToolbarContainer>
            <GridToolbarExport slotProps={{
                tooltip: { title: 'Export purchase orders' },
                button: { variant: 'contained' }
            }} />
        </GridToolbarContainer>
    );
}

interface OrdersCrudProps {
    initialOrders: GridRowsProp,
    onOrderClick: (order: Order) => Promise<void>
}

export default function OrdersCrud(props: OrdersCrudProps) {
    const [orders, setOrders] = useState(props.initialOrders);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleRowClick = async (params: GridRowParams, event: MuiEvent, details: GridCallbackDetails) => {
        await props.onOrderClick(params.row);
    };

    const baseColumnOptions = {
        hideable: true,
        pinnable: false,
        editable: false,
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Order ID',
            ...baseColumnOptions
        },
        {
            field: 'businessId',
            headerName: 'Business ID',
            ...baseColumnOptions
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
            ...baseColumnOptions
        },
        {
            field: 'updateTime',
            headerName: 'Last Update Time',
            valueGetter: (param) => new Date(parseInt(param)).toLocaleString(),
            ...baseColumnOptions
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            ...baseColumnOptions,
            cellClassName: 'actions',
            flex: 0.2,
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

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={orders.length > 0 ? orders : []}
                columns={columns}
                columnVisibilityModel={{
                    id: false,
                    businessId: false,
                    creationTime: false,
                    updateTime: false,
                }}
                editMode="row"
                // onRowClick={handleRowClick}
                showCellVerticalBorder
                showColumnVerticalBorder
                disableRowSelectionOnClick
                disableColumnResize
                disableColumnMenu
                rowModesModel={rowModesModel}
                slots={{
                    toolbar: EditToolbar as GridSlots['toolbar'],
                }}
                slotProps={{
                    toolbar: { setOrders, setRowModesModel },
                }}
            />
        </Box >
    );
}