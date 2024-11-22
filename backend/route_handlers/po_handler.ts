import express, { Express, Request, Response } from "express";
const router: Express = express();
import {
    getPurchaseOrder,
    getPurchaseOrders,
    createNewPurchaseOrder,
    updatePurchaseOrder,
    createNewPOItem,
    getPurchaseOrderItem,
    updatePOItem,
    getPOItems
} from "../firestore/purchase_order_db";
import { fetchBizUserMapping } from "../firestore/business_user_db";
import { BizUserMappingStatus, BizUserRole, POItemStatus, POStatus, UserStatus } from "../types";

router.get("/:poId", async (req: Request, res: Response) => {
    // check if logged in user has access to this PO
    const purchaseOrder = await getPurchaseOrder(req.params.purchaseOrderId);
    res.send({
        error: false,
        purchaseOrder
    });
});

router.get("/", async (req: Request, res: Response) => {
    const businessId = req.query.businessId as string;
    const traderId = req.query.traderId as string;
    const status = req.query.status as POStatus;
    const orders = await getPurchaseOrders(new Set<string>(), businessId, traderId, status);
    res.send({
        error: false,
        orders
    });
});

router.post("/", async (req: Request, res: Response) => {
    const user = req.session.user;
    if (!user || user.status !== UserStatus.ACTIVE) {
        res.status(403).send();
        return;
    }
    const businessId = req.body.businessId;
    // TODO: check that user is an active trader for the business
    const mapping = await fetchBizUserMapping(businessId, user.id);
    if (!mapping
        || mapping.role !== BizUserRole.TRADER
        || mapping.status !== BizUserMappingStatus.ACTIVE) {
        res.send(403).send();
    }
    const purchaseOrder = await createNewPurchaseOrder(
        req.body.businessId,
        user.id,
        req.body.totalQuantity,
        req.body.rate,
        req.body.contractDate,
        req.body.deliveryDate
    );
    res.send({
        error: false,
        purchaseOrder
    });
});

router.post("/:poId", async (req: Request, res: Response) => {
    const user = req.session.user;
    if (!user || user.status !== UserStatus.ACTIVE) {
        res.status(403).send();
        return;
    }
    const businessId = req.body.businessId;
    // TODO: check that user is an active trader for the business
    // const mapping = await fetchBizUserMapping(businessId, user.id);
    // if (!mapping
    //     || mapping.role !== BizUserRole.TRADER
    //     || mapping.status !== BizUserMappingStatus.ACTIVE) {
    //     res.send(403).send();
    //     return;
    // }
    const purchaseOrder = await getPurchaseOrder(req.params.poId);
    if (!purchaseOrder) {
        res.send({
            error: true,
            errorCode: "PURCHASE_ORDER_NOT_FOUND"
        });
        return;
    }
    const updatedPOData = {
        totalQuantity: req.body.totalQuantity ?? purchaseOrder.totalQuantity ?? null,
        rate: req.body.rate ?? purchaseOrder.rate ?? null,
        contractDate: req.body.contractDate ?? purchaseOrder.contractDate ?? null,
        deliveryDate: req.body.deliveryDate ?? purchaseOrder.deliveryDate ?? null,
        status: req.body.status ?? purchaseOrder.status
    };
    const updatedPurchaseOrder = await updatePurchaseOrder(
        purchaseOrder,
        updatedPOData
    );
    res.send({
        error: false,
        purchaseOrder: updatedPurchaseOrder
    });
});

router.post("/:poId/item", async (req: Request, res: Response) => {
    let purchaseOrder = await getPurchaseOrder(req.params.poId);
    if (!purchaseOrder || purchaseOrder.status !== POStatus.APPROVED) {
        res.send({
            error: true,
            errorCode: "PURCHASE_ORDER_NOT_FOUND"
        });
        return;
    }
    const item = await createNewPOItem(purchaseOrder,
        req.body.partyId,
        req.body.vehicleNumber,
        req.body.quantity);
    res.send({
        error: false,
        item
    });
});

router.post("/:poId/item/:itemId", async (req: Request, res: Response) => {
    const item = await getPurchaseOrderItem(req.params.itemId);
    if (!item
        // || item.status !== POItemStatus.PENDING_APPROVAL
    ) {
        res.send({
            error: true,
            errorCode: "PURCHASE_ORDER_ITEM_NOT_FOUND"
        });
        return;
    }
    await updatePOItem(
        item,
        {
            partyId: req.body.partyId ?? item.partyId ?? null,
            deliveryDate: req.body.deliveryDate ?? item.deliveryDate ?? null,
            deliveredQuantity: req.body.deliveredQuantity ?? item.deliveredQuantity ?? null,
            vehicleNumber: req.body.vehicleNumber ?? item.vehicleNumber ?? null,
            gateEntryNumber: req.body.gateEntryNumber ?? item.gateEntryNumber ?? null,
            billNumber: req.body.billNumber ?? item.billNumber ?? null,
            claim: req.body.claim ?? item.claim ?? null,
            bardana: req.body.bardana ?? item.bardana ?? null,
            fumigation: req.body.fumigation ?? item.fumigation ?? null,
            commission: req.body.commission ?? item.commission ?? null,
            status: req.body.status ?? item.status,
            updateTime: Date.now(),
        });
    res.send({
        error: false,
    });
});

router.get("/:poId/item/:itemId", async (req: Request, res: Response) => {
    const item = await getPurchaseOrderItem(req.params.itemId);
    if (!item || item.poId !== req.params.poId) {
        res.send({
            error: true,
            errorCode: "PURCHASE_ORDER_ITEM_NOT_FOUND"
        });
        return;
    }
    res.send({
        error: false,
        item
    });
});

router.get("/:poId/item", async (req: Request, res: Response) => {
    const poId = req.params.poId as string;
    const partyId = req.query.partyId as string;
    const status = req.query.status as POItemStatus;
    const items = await getPOItems(poId, undefined, undefined, partyId, status);
    res.send({
        error: false,
        items
    });
});

router.get("/items/all", async (req: Request, res: Response) => {
    const businessId = req.query.businessId as string;
    const orderItems = await getPOItems(undefined, businessId, undefined, undefined, undefined);

    if (orderItems.length > 0) {
        const orderIds = new Set(orderItems.map((orderItem) => orderItem.poId));
        const orders = await getPurchaseOrders(orderIds);

        const expandedOrderItems = orders.map((order) => {
            return {
                ...order,
                items: orderItems.filter((orderItem) => orderItem.poId === order.id)
            }
        });
        res.send({
            error: false,
            expandedOrderItems
        });
    } else {
        res.send({
            error: false,
            expandedOrderItems: []
        });
    }
});

export default router;