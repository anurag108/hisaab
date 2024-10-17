import express, { Express, Request, Response } from "express";
const router: Express = express();
import {
    getPurchaseOrder,
    getPurchaseOrders,
    createNewPurchaseOrder,
    createNewPurchaseOrderItems
} from "../firestore/purchase_order_db";

router.get("/:poId", async (req: Request, res: Response) => {
    // check if logged in user has access to this PO
    const purchaseOrder = await getPurchaseOrder(req.params.purchaseOrderId);
    res.send(purchaseOrder);
});

router.get("/", async (req: Request, res: Response) => {
    const orders = await getPurchaseOrders(req.body.businessId ?? 'aBfJosYmhg7dsKOQ56lr');
    console.log("Orders ", orders);
    res.send(orders);
});

router.post("/", async (req: Request, res: Response) => {
    const purchaseOrder = await createNewPurchaseOrder(
        req.body.businessId,
        req.body.brokerId,
        req.body.totalQuantity,
        req.body.rate,
        req.body.contractDate,
        req.body.deliveryDate
    );
    res.send(purchaseOrder);
});

router.post("/items", async (req: Request, res: Response) => {
    const purchaseOrder = await createNewPurchaseOrderItems(
        req.body.purchaseOrderId,
        req.body.items);
    res.send(purchaseOrder);
});

export default router;