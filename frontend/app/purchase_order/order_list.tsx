import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getPurchaseOrders } from '../api/purchase_order/route';

const commonAttrs = {
    flex: 1,
    hideable: false,
    resizable: false,
    editable: false,
    groupable: false,
    pinnable: false,
    disableColumnMenu: false,
};

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Order Id',
        type: 'string',
        ...commonAttrs,
    },
    {
        field: 'businessId',
        headerName: 'Business Id',
        type: 'string',
        ...commonAttrs,
    },
    {
        field: 'brokerId',
        headerName: 'Broker Id',
        type: 'string',
        ...commonAttrs,
    },
    {
        field: 'totalQuantity',
        headerName: 'Total Quantity',
        type: 'number',
        ...commonAttrs,
    },
    {
        field: 'rate',
        headerName: 'Rate',
        type: 'number',
        ...commonAttrs,
    },
    {
        field: 'contractDate',
        headerName: 'Contract Date',
        type: 'string',
        ...commonAttrs,
    },
    {
        field: 'deliveryDate',
        headerName: 'Delivery Date',
        type: 'string',
        ...commonAttrs,
    },
    {
        field: 'status',
        headerName: 'Status',
        type: 'string',
        ...commonAttrs,
    }
];

export default async function DataGridDemo() {
    const data = await getPurchaseOrders();
    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 20,
                        },
                    },
                }}
                pageSizeOptions={[20]}
                disableRowSelectionOnClick
            />
        </Box>
    );
}
