import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid2
} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridSlots,
    GridToolbarContainer,
    GridRenderCellParams,
    GridRowId,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import { MouseEvent, useEffect, useState } from "react";
import InviteTrader from "./InviteTrader.react";
import { makeGETCall, makePOSTCall } from "../api";
import { Trader } from "../types";

interface InviteToolbarProps {
    handleInviteDialogClick: () => Promise<void>
}

function InviteToolbar(props: InviteToolbarProps) {
    return (
        <GridToolbarContainer sx={{ mb: 2 }}>
            <Grid2 container width={'100%'}>
                <Grid2 size={2} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={props.handleInviteDialogClick}>
                        Invite Trader
                    </Button>
                </Grid2>
                <Grid2 size={2} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <GridToolbarFilterButton slotProps={{
                        tooltip: { title: 'Filter traders' },
                        button: { variant: 'contained', size: 'medium' }
                    }} />
                </Grid2>
                <Grid2 size={'grow'}>
                    <GridToolbarQuickFilter />
                </Grid2>
            </Grid2>
        </GridToolbarContainer>
    );
}

interface DeactivationConfirmationModalProps {
    open: boolean,
    handleDialogClose: () => void
    handleDeactivation: (params: any) => Promise<void>
};

function DeactivationConfirmationModal(props: DeactivationConfirmationModalProps) {
    const { open, handleDialogClose, handleDeactivation } = props;

    return (
        <Dialog
            open={open}
            keepMounted
            onClose={handleDialogClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Confirm Trader Deactivation"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    This trader will not be able to submit purchase orders or dispatch plans.
                    Previous orders will still be visible to you.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleDeactivation}>Deactivate</Button>
            </DialogActions>
        </Dialog>
    );
};

interface TraderCrudProps {
    businessId: string,
}

export default function TradersCrud(props: TraderCrudProps) {
    const [traders, setTraders] = useState<Trader[]>([]);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [deactivationRow, setDeactivationRow] = useState<GridRowId | null>(null);

    const fetchTraders = async () => {
        try {
            const response = await makeGETCall("business/" + props.businessId + "/traders");
            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    // TODO: Add error handling
                    console.error(data);
                } else {
                    setTraders(data.traders);
                }
            }
        } catch (error) {
            // TODO: Add error handling
            console.error(error);
        }
    }

    useEffect(() => {
        fetchTraders().catch((error) => console.error(error));
    }, []);

    const handleInviteDialogClose = () => {
        setInviteDialogOpen(false);
    };

    const handleInviteDialogClick = () => {
        setInviteDialogOpen(true);
    };

    const handleSuccessfulInvite = (id: string, email: string, creationTime: string, updateTime: string) => {
        const invitedTrader = {
            id,
            name: '',
            email,
            phoneNumber: '',
            status: 'INVITED',
            creationTime,
            updateTime,
            parties: []
        };
        setTraders(traders.concat(invitedTrader));
    }

    const handleDeactivation = async () => {
        await makePOSTCall("business/deactivate/trader", {
            businessId: props.businessId,
            traderId: deactivationRow
        });
        // TODO: Add error handling

        const updatedTraders = traders.map((trader) => {
            if (trader.id === deactivationRow) {
                trader.status = 'DEACTIVATED';
            }
            return trader;
        });
        setTraders(updatedTraders);
        setDeactivationRow(null);
    }

    const baseColumnOptions = {
        hideable: false,
        pinnable: false,
        editable: false,
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Trader ID',
            ...baseColumnOptions
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 2,
            ...baseColumnOptions
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 3,
            ...baseColumnOptions
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone Number',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            flex: 1.5,
            ...baseColumnOptions
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 2,
            ...baseColumnOptions,
            renderCell: (params: GridRenderCellParams) => {
                if (params.value === 'DEACTIVATED') {
                    return (<Chip label={params.value} color='error' />);
                } else if (params.value === 'INVITED') {
                    return (<Chip label={params.value} color='warning' />);
                }
                return (<Chip label={params.value} color='success' />);
            }
        },
        {
            field: 'creationTime',
            headerName: 'Creation Time',
            flex: 1.5,
            valueGetter: (param: string) => new Date(parseInt(param)).toLocaleString(),
            ...baseColumnOptions
        },
        {
            field: 'updateTime',
            headerName: 'Last Update Time',
            flex: 1.5,
            valueGetter: (param: string) => new Date(parseInt(param)).toLocaleString(),
            ...baseColumnOptions
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1.5,
            ...baseColumnOptions,
            renderCell: (params: GridRenderCellParams) => {
                const onDeactivateClick = async (event: MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    setDeactivationRow(params.id);
                };

                // const onReactivateClick = async (event: MouseEvent<HTMLElement>) => {
                //     // TODO: call reactivate api
                //     const updatedTraders = traders.map((trader) => {
                //         if (trader.id === params.id) {
                //             trader.status = 'ACTIVE';
                //         }
                //         return trader;
                //     });
                //     setTraders(updatedTraders);
                // };

                const onCancelInviteClick = async () => {
                    await makePOSTCall("business/invite/cancel", {
                        businessId: props.businessId,
                        traderId: params.id
                    });
                    // TODO: Add error handling

                    const updatedTraders = traders.filter((trader) => trader.id !== params.id);
                    setTraders(updatedTraders);
                };

                const status = params.row.status;
                if (status === 'ACTIVE') {
                    return (<Button variant="contained" color="error" onClick={onDeactivateClick}>Deactivate</Button>);
                } else if (status === 'INVITED') {
                    return (<Button variant="contained" color="primary" onClick={onCancelInviteClick}>Cancel Invite</Button>);
                }
            },
        },
    ];

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
                rows={traders.length > 0 ? traders : []}
                getEstimatedRowHeight={() => 200}
                getRowHeight={() => 'auto'}
                columns={columns}
                columnVisibilityModel={{
                    id: false,
                }}
                initialState={{
                    filter: {
                        filterModel: {
                            items: [],
                            quickFilterExcludeHiddenColumns: true,
                        },
                    },
                }}
                showCellVerticalBorder
                showColumnVerticalBorder
                disableColumnMenu
                disableRowSelectionOnClick
                disableColumnResize
                disableColumnSelector
                slots={{
                    toolbar: InviteToolbar as GridSlots['toolbar'],
                }}
                slotProps={{
                    toolbar: { handleInviteDialogClick },
                }}
            />
            <InviteTrader open={inviteDialogOpen} handleDialogClose={handleInviteDialogClose} handleSuccessfulInvite={handleSuccessfulInvite} />
            <DeactivationConfirmationModal
                open={deactivationRow !== null}
                handleDialogClose={() => setDeactivationRow(null)}
                handleDeactivation={handleDeactivation} />
        </Box>
    );
}