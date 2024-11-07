import express, { Express, Request, Response } from "express";
import { genActiveBizForUser } from "../firestore/business_user_db";
import { genBizFromIds } from "../firestore/business_db";
const router: Express = express();

router.get("/business", async (req: Request, res: Response) => {
    const user = req.session.user;
    if (!user) {
        res.status(403);
        return;
    }
    const bizMap = await genActiveBizForUser(user.id);

    const bizIds: string[] = [];
    bizMap.forEach((_, key) => bizIds.push(key.toString()));
    const businesses = await genBizFromIds(bizIds);

    const bizData: Object[] = [];
    businesses.forEach((biz) => {
        const data = bizMap.get(biz.id);
        if (data) {
            const newData = {
                ...data,
                bizName: biz.name,
                bizId: biz.id,
            };
            bizData.push(newData);
        }
    });
    res.send({
        error: false,
        bizData
    });
});

export default router;