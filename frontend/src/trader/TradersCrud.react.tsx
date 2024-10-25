import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridSlots,
    GridToolbarContainer,
    GridRowsProp,
    GridRenderCellParams,
    GridRowId,
} from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import { MouseEvent, useState } from "react";
import InviteTrader from "./InviteTrader.react";
import mockTraders from '../data/traders.json';

interface InviteToolbarProps {
    handleInviteDialogClick: () => Promise<void>
}

function InviteToolbar(props: InviteToolbarProps) {
    return (
        <GridToolbarContainer>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={props.handleInviteDialogClick}>
                Invite Trader
            </Button>
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

export default function TradersCrud() {
    const [traders, setTraders] = useState(mockTraders);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [deactivationRow, setDeactivationRow] = useState<GridRowId | null>(null);

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
        // TODO: call deactivation API
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
            flex: 2.5,
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
            flex: 1.5,
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
            flex: 2,
            valueGetter: (param: string) => new Date(parseInt(param)).toLocaleString(),
            ...baseColumnOptions
        },
        {
            field: 'updateTime',
            headerName: 'Last Update Time',
            flex: 2,
            valueGetter: (param: string) => new Date(parseInt(param)).toLocaleString(),
            ...baseColumnOptions
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 2,
            ...baseColumnOptions,
            renderCell: (params: GridRenderCellParams) => {
                const onDeactivateClick = (event: MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    setDeactivationRow(params.id);
                };
                const onReactivateClick = (event: MouseEvent<HTMLElement>) => {
                    // TODO: call reactivate api
                    const updatedTraders = traders.map((trader) => {
                        if (trader.id === params.id) {
                            trader.status = 'ACTIVE';
                        }
                        return trader;
                    });
                    setTraders(updatedTraders);
                };

                const onCancelInviteClick = async () => {
                    // TODO: Call API
                    console.log("Cancelling invite");
                    const updatedTraders = traders.filter((trader) => trader.id !== params.id);
                    setTraders(updatedTraders);
                };

                const status = params.row.status;
                if (status === 'DEACTIVATED') {
                    return (<Button variant="contained" color="primary" onClick={onReactivateClick}>Reactivate Trader</Button>);
                } else if (status === 'INVITED') {
                    return (<Button variant="contained" color="primary" onClick={onCancelInviteClick}>Cancel Invite</Button>);
                }
                else {
                    return (<Button variant="contained" color="error" onClick={onDeactivateClick}>Deactivate Trader</Button>);
                }
            },
        },
    ];

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={traders.length > 0 ? traders : []}
                columns={columns}
                columnVisibilityModel={{
                    id: false,
                }}
                disableColumnMenu
                disableRowSelectionOnClick
                disableColumnResize
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