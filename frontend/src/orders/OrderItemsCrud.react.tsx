import { Box, Chip, Grid2 } from "@mui/material";
import { ExpandedOrderItem } from "../types";
import {
    DataGrid,
    GridCallbackDetails,
    GridColDef,
    GridRenderCellParams,
    GridRowParams,
    GridRowsProp,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    MuiEvent
} from "@mui/x-data-grid";
import { useState } from "react";

function DataToolbar() {
    return (
        <GridToolbarContainer sx={{ mb: 2 }}>
            <Grid2 container width={'100%'}>
                <Grid2 size={1}>
                    <GridToolbarFilterButton slotProps={{
                        tooltip: { title: 'Filter purchase orders' },
                        button: { variant: 'contained', size: 'medium' }
                    }} />
                </Grid2>
                <Grid2 size={'grow'}>
                    <GridToolbarQuickFilter />
                </Grid2>
                <Grid2 size={1}>
                    <GridToolbarExport slotProps={{
                        tooltip: { title: 'Export purchase orders' },
                        button: { variant: 'contained', size: 'medium' }
                    }} />
                </Grid2>
            </Grid2>
        </GridToolbarContainer>
    );
}

const VISIBLE_COLUMNS = ['traderId', 'orderId', 'quantity', 'gateEntryNumber', 'vehicleNumber', 'deliveryDate', 'status', 'billNumber', 'claim'];

interface OrderItemsCrudProps {
    initialItems: GridRowsProp,
    onOrderClick: (orderItem: ExpandedOrderItem) => Promise<void>
}

export default function OrderItemsCrud(props: OrderItemsCrudProps) {
    const { initialItems, onOrderClick } = props;
    const [items, setItems] = useState(initialItems);

    const baseColumnOptions = {
        hideable: true,
        pinnable: false,
        editable: false,
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Order Item ID',
            ...baseColumnOptions,
            filterable: false,
        },
        {
            field: 'deliveryDate',
            headerName: 'Delivery Date',
            ...baseColumnOptions,
            flex: 0.7,
        },
        {
            field: 'traderId',
            headerName: 'Trader ID',
            ...baseColumnOptions,
            flex: 1,
        },
        {
            field: 'orderId',
            headerName: 'Order ID',
            ...baseColumnOptions,
            filterable: false,
            flex: 1,
        },
        {
            field: 'businessId',
            headerName: 'Business ID',
            ...baseColumnOptions,
            filterable: false,
            flex: 1,
        },
        {
            field: 'quantity',
            headerName: 'Quantity (Qntl)',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions,
            flex: 0.6,
        },
        {
            field: 'deliveredQuantity',
            headerName: 'Delivered Quantity (Qntl)',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions,
            flex: 0.6,
        },
        {
            field: 'gateEntryNumber',
            headerName: 'Gate Entry Number',
            ...baseColumnOptions,
            flex: 0.7,
        },
        {
            field: 'vehicleNumber',
            headerName: 'Vehicle Number',
            ...baseColumnOptions,
            flex: 0.7,
        },
        {
            field: 'billNumber',
            headerName: 'Bill Number',
            ...baseColumnOptions,
            flex: 0.7,
        },
        {
            field: 'status',
            headerName: 'Status',
            type: 'singleSelect',
            valueOptions: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED'],
            ...baseColumnOptions,
            flex: 1.3,
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
            field: 'claim',
            headerName: 'Claim (Kg)',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions,
            flex: 0.7,
        },
        {
            field: 'netWeight',
            headerName: 'Net Weight (Qntl)',
            ...baseColumnOptions,
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            flex: 0.7,
            valueGetter: (_value, row) => `${row.deliveredQuantity - (row.claim / 100.0)}`
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     headerName: 'Actions',
        //     ...baseColumnOptions,
        //     cellClassName: 'actions',
        //     flex: 0.5,
        //     getActions: (params: GridRowParams) => {
        //         const approveAction = (
        //             <GridActionsCellItem
        //                 label='Approve'
        //                 icon={<DoneIcon />}
        //                 onClick={async () => {
        //                     // TODO: Call API
        //                     // set status & update view
        //                     const updatedItems = items.map((item) => {
        //                         if (item.id === params.row.id) {
        //                             item.status = 'APPROVED';
        //                         }
        //                         return item;
        //                     })
        //                     setItems(updatedItems);
        //                 }}
        //                 showInMenu />
        //         );

        //         const rejectAction = (
        //             <GridActionsCellItem
        //                 label='Reject'
        //                 icon={<CancelIcon />}
        //                 onClick={async () => {
        //                     // TODO: Call API
        //                     // set status & update view
        //                     const updatedItems = items.map((item) => {
        //                         if (item.id === params.row.id) {
        //                             item.status = 'REJECTED';
        //                         }
        //                         return item;
        //                     })
        //                     setItems(updatedItems);
        //                 }}
        //                 showInMenu />
        //         );

        //         const completeAction = (
        //             <GridActionsCellItem
        //                 label='Completed'
        //                 icon={<CancelIcon />}
        //                 onClick={async () => {
        //                     // TODO: Call API
        //                     // set status & update view
        //                     const updatedItems = items.map((item) => {
        //                         if (item.id === params.row.id) {
        //                             item.status = 'COMPLETED';
        //                         }
        //                         return item;
        //                     })
        //                     setItems(updatedItems);
        //                 }}
        //                 showInMenu />
        //         );

        //         switch (params.row.status) {
        //             case 'PENDING_APPROVAL':
        //                 return [approveAction, rejectAction];
        //             case 'APPROVED':
        //                 return [rejectAction, completeAction];
        //             case 'REJECTED':
        //                 return [approveAction];
        //             case 'IN_PROGRESS':
        //                 return [completeAction];
        //             default:
        //                 return [];
        //         }
        //     }
        // },
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
                rows={items.length > 0 ? items : []}
                getEstimatedRowHeight={() => 200}
                getRowHeight={() => 'auto'}
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