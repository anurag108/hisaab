import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
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
} from '@mui/x-data-grid';
import {
    randomId
} from '@mui/x-data-grid-generator';
import { Order } from '../types';

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
                id, businessId: '', brokerId: '', totalQuantity: 0.0, rate: 0.0,
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
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add Order
            </Button>
            <GridToolbarExport />
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

    const baseColumnOptions = {
        flex: 1,
        hideable: true,
        pinnable: false,
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Order ID',
            editable: false,
            ...baseColumnOptions
        },
        {
            field: 'businessId',
            headerName: 'Business ID',
            editable: false,
            ...baseColumnOptions
        },
        {
            field: 'brokerId',
            headerName: 'Broker ID',
            editable: false,
            ...baseColumnOptions
        },
        {
            field: 'totalQuantity',
            headerName: 'Total Quantity',
            type: 'number',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'rate',
            headerName: 'Rate',
            type: 'number',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'contractDate',
            headerName: 'Contract Date',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'deliveryDate',
            headerName: 'Delivery Date',
            editable: true,
            ...baseColumnOptions
        },
        {
            field: 'status',
            headerName: 'Status',
            editable: false,
            type: 'singleSelect',
            ...baseColumnOptions
        },
        {
            field: 'creationTime',
            headerName: 'Creation Time',
            editable: false,
            valueGetter: (param) => new Date(parseInt(param)).toLocaleString(),
            ...baseColumnOptions
        },
        {
            field: 'updateTime',
            headerName: 'Last Update Time',
            editable: false,
            valueGetter: (param) => new Date(parseInt(param)).toLocaleString(),
            ...baseColumnOptions
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            ...baseColumnOptions,
            cellClassName: 'actions',
            getActions: ({ id }) => {
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
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <DataGrid
                rows={orders.length > 0 ? orders : []}
                columns={columns}
                editMode="row"
                onRowClick={handleRowClick}
                disableRowSelectionOnClick
                disableColumnResize
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
        </Box>
    );
}