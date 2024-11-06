import express, { Express, NextFunction, Request, Response } from "express";
import { checkLoginDetails } from "../firestore/user_db";
import { doPasswordsMatch } from "../encryption_utils";

const router: Express = express();

router.post("/in", async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await checkLoginDetails(email, password);
    if (user == null) {
        res.send({
            error: true,
            errorCode: "USER_NOT_FOUND",
        });
    } else {
        const hashedPassword = user.hashedPassword;
        delete user.hashedPassword;
        const match = await doPasswordsMatch(password, hashedPassword)
        if (match) {
            req.session.user = user;
            res.send({
                error: false,
                user
            });
        } else {
            res.send({
                error: true,
                errorCode: "INCORRECT_PASSWORD"
            });
        }
    }
});

router.post("/out", async (req: Request, res: Response) => {
    req.session.destroy((error) => {
        if (error) {
            res.send({
                error: true,
            });
            console.error(error);
        } else {
            res.send({
                error: false
            });
        }
    });
});

export default router;