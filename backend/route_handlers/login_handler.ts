import express, { Express, Request, Response } from "express";
import { checkLoginDetails } from "../firestore/login_db";
const router: Express = express();

router.post("/in", async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log('Email', email);
    console.log('Password', password);
    const user = await checkLoginDetails(email, password);
    if (user == null) {
        res.status(404).send("User not found");
    } else {
        req.session.user = user;
        res.send("User logged in successfully");
    }
});

router.post("/out", async (req: Request, res: Response) => {
    req.session.destroy((error) => {
        console.log('Error logging out the user', error);
    });
});

export default router;