import { Alert, AlertProps, Box, Chip, Grid2, Snackbar } from "@mui/material";
import { Order, OrderItem } from "../types";
import {
    DataGrid,
    GridActionsCellItem,
    GridCallbackDetails,
    GridColDef,
    GridEventListener,
    GridRenderCellParams,
    GridRowEditStopReasons,
    GridRowId,
    GridRowModel,
    GridRowModes,
    GridRowModesModel,
    GridRowParams,
    GridRowsProp,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    MuiEvent
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { makeGETCall, makePOSTCall } from "../api";

function DataToolbar() {
    return (
        <GridToolbarContainer sx={{ mb: 2 }}>
            <Grid2 container width={'100%'}>
                <Grid2 size={2} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <GridToolbarFilterButton slotProps={{
                        tooltip: { title: 'Filter purchase order items' },
                        button: { variant: 'contained', size: 'medium' }
                    }} />
                </Grid2>
                <Grid2 size={'grow'}>
                    <GridToolbarQuickFilter />
                </Grid2>
                <Grid2 size={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <GridToolbarExport slotProps={{
                        tooltip: { title: 'Export purchase order items' },
                        button: { variant: 'contained', size: 'medium' }
                    }} />
                </Grid2>
            </Grid2>
        </GridToolbarContainer>
    );
}

interface OrderItemsCrudProps {
    businessId: string,
    onOrderClick: (order: Order) => Promise<void>
}

export default function OrderItemsCrud(props: OrderItemsCrudProps) {
    const { businessId, onOrderClick } = props;
    const [orders, setOrders] = useState<Order[]>([]);
    const [items, setItems] = useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [snackbar, setSnackbar] = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);

    const handleCloseSnackbar = () => setSnackbar(null);

    const fetchPurchaseOrderItems = async () => {
        const response = await makeGETCall("po/items/all", [{
            name: "businessId",
            value: businessId
        }]);
        if (response.ok) {
            const data = await response.json();
            if (!data.error) {
                setOrders(data.expandedOrderItems);
                let allOrderItems: OrderItem[] = [];
                data.expandedOrderItems.map((order: Order) => {
                    allOrderItems = allOrderItems.concat(order.items);
                });
                setItems(allOrderItems);
            }
            // TODO: Add error handling
        } else {
            // TODO: Add error handling
            console.log("Response not OK", response);
        }
        return [];
    };

    useEffect(() => {
        fetchPurchaseOrderItems().catch(console.error);
    }, []);

    const baseColumnOptions = {
        hideable: true,
        pinnable: false,
    }

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = items.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setItems(items.filter((row) => row.id !== id));
        }
    };

    const saveOrderItem = async (newRow: GridRowModel) => {
        try {
            const response = await makePOSTCall("po/" + newRow.poId + "/item/" + newRow.id, {
                deliveryDate: newRow.deliveryDate,
                partyId: newRow.partyId,
                quantity: newRow.quantity,
                deliveredQuantity: newRow.deliveredQuantity,
                vehicleNumber: newRow.vehicleNumber,
                gateEntryNumber: newRow.gateEntryNumber,
                billNumber: newRow.billNumber,
                status: newRow.status,
                claim: newRow.claim,
                bardana: newRow.bardana,
                fumigation: newRow.fumigation,
                commission: newRow.commission,
            });
            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    // TODO: Add error handling
                }
            } else {
                // TODO: Add error handling
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const processRowUpdate = async (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        await saveOrderItem(newRow);
        setItems(items.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowUpdateFailure = (error: Error) => {
        setSnackbar({ children: error.message, severity: 'error' });
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: 'deliveryDate',
            headerName: 'Delivery Date',
            ...baseColumnOptions,
            flex: 0.7,
            editable: true,
        },
        {
            field: 'id',
            headerName: 'Order Item ID',
            ...baseColumnOptions,
            filterable: false,
            editable: false,
        },
        {
            field: 'poId',
            headerName: 'Order ID',
            ...baseColumnOptions,
            filterable: false,
            flex: 1,
            editable: false,
        },
        {
            field: 'businessId',
            headerName: 'Business ID',
            ...baseColumnOptions,
            filterable: false,
            flex: 1,
            editable: false,
        },
        {
            field: 'traderId',
            headerName: 'Trader ID',
            ...baseColumnOptions,
            flex: 1,
            editable: false,
        },
        {
            field: 'quantity',
            headerName: 'Quantity (Qntl)',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions,
            flex: 0.6,
            editable: false,
        },
        {
            field: 'deliveredQuantity',
            headerName: 'Delivered Quantity (Qntl)',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions,
            flex: 0.6,
            editable: true,
        },
        {
            field: 'gateEntryNumber',
            headerName: 'Gate Entry Number',
            ...baseColumnOptions,
            flex: 0.7,
            editable: true,
        },
        {
            field: 'vehicleNumber',
            headerName: 'Vehicle Number',
            ...baseColumnOptions,
            flex: 0.7,
            editable: true,
        },
        {
            field: 'billNumber',
            headerName: 'Bill Number',
            ...baseColumnOptions,
            flex: 0.7,
            editable: true,
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
            },
            editable: true,
        },
        {
            field: 'creationTime',
            headerName: 'Creation Time',
            valueGetter: (param) => new Date(parseInt(param)).toLocaleString(),
            ...baseColumnOptions,
            filterable: false,
            editable: false,
        },
        {
            field: 'updateTime',
            headerName: 'Last Update Time',
            valueGetter: (param) => new Date(parseInt(param)).toLocaleString(),
            ...baseColumnOptions,
            filterable: false,
            editable: false,
        },
        {
            field: 'claim',
            headerName: 'Claim (Kg)',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions,
            flex: 0.7,
            editable: true,
        },
        {
            field: 'cd2',
            headerName: 'CD2',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions,
            flex: 0.7,
            editable: true,
        },
        {
            field: 'bardana',
            headerName: 'Bardana ',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions,
            flex: 0.7,
            editable: true,
        },
        {
            field: 'fumigation',
            headerName: 'Fumigation',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions,
            flex: 0.7,
            editable: true,
        },
        {
            field: 'commission',
            headerName: 'Commission',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions,
            flex: 0.7,
            editable: true,
        },
        {
            field: 'netWeight',
            headerName: 'Net Weight (Qntl)',
            ...baseColumnOptions,
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            flex: 0.7,
            valueGetter: (_value, row) => `${row.deliveredQuantity - (row.claim / 100.0)}`,
            editable: false,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            ...baseColumnOptions,
            cellClassName: 'actions',
            flex: 0.5,
            getActions: (params: GridRowParams) => {
                const id = params.id;
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />
                ];
            }
        },
    ];

    const handleRowClick = async (params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => {
        const clickedOrder = orders.find((order) => order.id === params.row.poId);
        if (clickedOrder) {
            await onOrderClick(clickedOrder);
        }
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
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleRowUpdateFailure}
                columns={columns}
                columnVisibilityModel={{
                    id: false,
                    poId: false,
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
            {!!snackbar && (
                <Snackbar
                    open
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={handleCloseSnackbar}
                    autoHideDuration={6000}
                >
                    <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
        </Box >
    );
}