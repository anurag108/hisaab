import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlots,
    GridToolbarExport,
    GridCallbackDetails,
    GridRowParams,
    MuiEvent,
    GridRenderCellParams,
} from '@mui/x-data-grid';
import {
    randomId
} from '@mui/x-data-grid-generator';
import { Order } from '../types';
import { Button, Chip, Divider } from '@mui/material';

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        // not saved in FB, just to manage UI changes
        const id = randomId();
        setRows((oldRows) => [
            ...oldRows,
            {
                id, businessId: '', traderId: '', totalQuantity: 0.0, rate: 0.0,
                contractDate: '', deliveryDate: '', status: 'PENDING_APPROVAL', creationTime: '', updateTime: '', items: [],
                isNew: true
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'businessId' },
        }));
    };

    return (
        <GridToolbarContainer>
            {/* <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add Order
            </Button> */}
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

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => async () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
        // TODO: call add order API
    };

    const handleDeleteClick = (id: GridRowId) => async () => {
        // TODO: call delete order API
        setOrders(orders.filter((order) => order.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = orders.find((order) => order.id === id);
        if (editedRow!.isNew) {
            setOrders(orders.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setOrders(orders.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleRowClick = async (params: GridRowParams, event: MuiEvent, details: GridCallbackDetails) => {
        await props.onOrderClick(params.row);
    };

    const getActionsPerStatus = (status: string) => {
        const approveAction = (
            <Button variant="contained" color="primary" onClick={() => { }}>Approve</Button>
        );
        const rejectAction = (
            <Button variant="contained" color="error" onClick={() => { }}>Reject</Button>
        );
        const editAction = (
            <Button variant="contained" color="warning" onClick={() => { }}>Edit</Button>
        );
        switch (status) {
            case 'PENDING_APPROVAL':
                return <Box>{approveAction} {rejectAction}</Box>;
            case 'APPROVED':
                return rejectAction;
            case 'REJECTED':
                return approveAction;
            case 'IN_PROGRESS':
                return editAction;
            case 'COMPLETED':
                return [];
        }
    };

    const baseColumnOptions = {
        flex: 1,
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
            ...baseColumnOptions
        },
        {
            field: 'totalQuantity',
            headerName: 'Total Quantity (Qntl)',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions
        },
        {
            field: 'rate',
            headerName: 'Rate (₹)',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            ...baseColumnOptions
        },
        {
            field: 'contractDate',
            headerName: 'Contract Date',
            ...baseColumnOptions
        },
        {
            field: 'deliveryDate',
            headerName: 'Delivery Date',
            ...baseColumnOptions
        },
        {
            field: 'status',
            headerName: 'Status',
            type: 'singleSelect',
            valueOptions: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED'],
            ...baseColumnOptions,
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
            renderCell: (params: GridRenderCellParams) => {
                const actions = getActionsPerStatus(params.row.status);
                return actions;
            },
            getActions: (params: GridRowParams) => {
                const rowId = params.id;
                const isInEditMode = rowModesModel[rowId]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(rowId)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(rowId)}
                            color="inherit"
                        />,
                    ];
                }
                return [];
            },
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
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
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