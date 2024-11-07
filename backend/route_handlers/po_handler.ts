import express, { Express, Request, Response } from "express";
const router: Express = express();
import {
    getPurchaseOrder,
    getPurchaseOrders,
    createNewPurchaseOrder,
    updatePurchaseOrder,
    createNewPOItem,
    getPurchaseOrderItem,
    updatePOItem
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
    const orders = await getPurchaseOrders('aBfJosYmhg7dsKOQ56lr');
    res.send(orders);
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
    const mapping = await fetchBizUserMapping(businessId, user.id);
    if (!mapping
        || mapping.role !== BizUserRole.TRADER
        || mapping.status !== BizUserMappingStatus.ACTIVE) {
        res.send(403).send();
        return;
    }
    const purchaseOrder = await getPurchaseOrder(req.params.poId);
    if (!purchaseOrder) {
        res.send({
            error: true,
            errorCode: "PURCHASE_ORDER_NOT_FOUND"
        });
        return;
    }
    const updatedPOData = {
        totalQuantity: req.body.totalQuantity ?? purchaseOrder.totalQuantity,
        rate: req.body.rate ?? purchaseOrder.rate,
        contractDate: req.body.contractDate ?? purchaseOrder.contractDate,
        deliveryDate: req.body.deliveryDate ?? purchaseOrder.deliveryDate
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
    let item = await getPurchaseOrderItem(req.params.itemId);
    if (!item || item.status !== POItemStatus.PENDING_APPROVAL) {
        res.send({
            error: true,
            errorCode: "PURCHASE_ORDER_ITEM_NOT_FOUND"
        });
        return;
    }
    let updatedItemData = item;
    if (req.body.partyId) {
        updatedItemData.partyId = req.body.partyId;
    }
    if (req.body.vehicleNumber) {
        updatedItemData.vehicleNumber = req.body.vehicleNumber;
    }
    if (req.body.quantity) {
        updatedItemData.quantity = req.body.quantity;
    }
    const newStatus = req.body.status;
    if (newStatus && newStatus === POItemStatus.CANCELLED) {
        updatedItemData.status = req.body.status;
    }
    updatedItemData.updateTime = Date.now();
    await updatePOItem(
        item,
        updatedItemData);
    res.send({
        error: false,
    });
});

export default router;