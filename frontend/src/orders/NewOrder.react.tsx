import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Box,
    InputAdornment,
    Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from 'dayjs';
import { useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { makePOSTCall } from "../api";
import { Order } from "../types";

interface NewOrderProps {
    open: boolean,
    businessId: string,
    handleDialogClose: () => void,
    handleOrderCreation: (order: Order) => void,
}

export default function NewOrder(props: NewOrderProps) {
    const { open, businessId, handleDialogClose, handleOrderCreation } = props;
    const today = new Date().toISOString().split("T")[0];
    const [totalQuantity, setTotalQuantity] = useState<Number | null>();
    const [rate, setRate] = useState<Number | null>();
    const [contractDate, setContractDate] = useState<Dayjs | null>(dayjs(today));
    const [deliveryDate, setDeliveryDate] = useState<Dayjs | null>(dayjs(today));
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const createNewOrder = async () => {
        const res = await makePOSTCall("po/", {
            businessId,
            totalQuantity,
            rate,
            contractDate,
            deliveryDate
        });
        if (res.ok) {
            const data = await res.json();
            if (data.error) {
                setErrorMessage(data.errorMessage);
            } else {
                handleOrderCreation(data.purchaseOrder);
                handleDialogClose();
            }
        } else {
            setErrorMessage("Something went wrong");
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}>
            <DialogTitle>Create New Purchase Order</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    id="totalQuantity"
                    name="totalQuantity"
                    label="Total Quantity"
                    value={totalQuantity}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setTotalQuantity(parseFloat(event.target.value));
                    }}
                    type="number"
                    variant="standard"
                    fullWidth
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">Quintal</InputAdornment>,
                        },
                    }}
                />
                <TextField
                    autoFocus
                    required
                    id="rate"
                    name="rate"
                    label="Rate"
                    value={rate}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setRate(parseFloat(event.target.value));
                    }}
                    type="number"
                    variant="standard"
                    fullWidth
                    slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">₹ per Quintal</InputAdornment>,
                        },
                    }}
                    sx={{ mt: 4 }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ mt: 5 }}>
                        <DatePicker
                            name="contractDate"
                            label="Contract Date"
                            value={contractDate}
                            onChange={(newVal) => setContractDate(newVal)}
                            sx={{ pr: 1 }} />
                        <DatePicker
                            name="deliveryDate"
                            label="Last Delivery Date"
                            value={deliveryDate}
                            onChange={(newVal) => setDeliveryDate(newVal)}
                            sx={{ pl: 1 }} />
                    </Box>
                </LocalizationProvider>
            </DialogContent>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button type="submit" variant="contained" onClick={createNewOrder}>Create New Order</Button>
            </DialogActions>
        </Dialog>
    );
}
