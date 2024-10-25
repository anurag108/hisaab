import { Box, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowModesModel,
    GridSlots,
    GridToolbarContainer,
    GridRowModes,
    GridRowId,
    GridRowModel,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowsProp
} from "@mui/x-data-grid";
import { useState } from "react";

interface InviteToolbarProps {
    onClickInvite: () => Promise<void>
}

function InviteToolbar(props: InviteToolbarProps) {
    const handleInviteClick = async () => {
        // not saved in FB, just to manage UI changes
        await props.onClickInvite();
    };

    return (
        <GridToolbarContainer>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleInviteClick}>
                Invite Trader
            </Button>
        </GridToolbarContainer>
    );
}

interface TradersCrudProps {
    traders: GridRowsProp,
    onClickInvite: () => Promise<void>
}

export default function TradersCrud(props: TradersCrudProps) {
    const { onClickInvite } = props;
    const [traders, setTraders] = useState(props.traders);
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
        // TODO: call update Trader API
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        // const editedRow = traders.find((trader) => trader.id === id);
        // if (editedRow!.isNew) {
        //     setTraders(traders.filter((trader) => trader.id !== id));
        // }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setTraders(traders.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const baseColumnOptions = {
        flex: 1,
        hideable: true,
        pinnable: false,
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Trader ID',
            editable: false,
            ...baseColumnOptions
        },
        {
            field: 'name',
            headerName: 'Name',
            editable: false,
            ...baseColumnOptions
        },
        {
            field: 'email',
            headerName: 'Email',
            editable: false,
            ...baseColumnOptions
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone Number',
            type: 'number',
            editable: false,
            ...baseColumnOptions
        },
        {
            field: 'status',
            headerName: 'Status',
            editable: false,
            ...baseColumnOptions
        },
        {
            field: 'creationTime',
            headerName: 'Creation Time',
            editable: false,
            valueGetter: (param: string) => new Date(parseInt(param)).toLocaleString(),
            ...baseColumnOptions
        },
        {
            field: 'updateTime',
            headerName: 'Last Update Time',
            editable: false,
            valueGetter: (param: string) => new Date(parseInt(param)).toLocaleString(),
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
                    />
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
                rows={traders.length > 0 ? traders : []}
                columns={columns}
                editMode="row"
                disableRowSelectionOnClick
                disableColumnResize
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: InviteToolbar as GridSlots['toolbar'],
                }}
                slotProps={{
                    toolbar: { onClickInvite },
                }}
            />
        </Box>
    );
}