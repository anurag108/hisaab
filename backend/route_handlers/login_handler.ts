import express, { Express, Request, Response } from "express";
import { checkLoginDetails } from "../firestore/login_db";
const router: Express = express();

router.post("/in", async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await checkLoginDetails(email, password);
    if (user == null) {
        res.send({
            errorCode: "USER_NOT_FOUND",
        });
    } else {
        req.session.user = user;
        res.send({
            user
        });
    }
});

router.post("/out", async (req: Request, res: Response) => {
    req.session.destroy((error) => {
        if (error) {
            console.log('Error logging out the user', error);
        }
    });
});

export default router;