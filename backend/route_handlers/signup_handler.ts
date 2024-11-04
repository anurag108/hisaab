import express, { Express, Request, Response } from "express";
import { checkLoginDetails, genUserByEmail, signupNewUser } from "../firestore/login_db";
const router: Express = express();

router.post("/", async (req: Request, res: Response) => {
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;
    const password = req.body.password;
    const user = await genUserByEmail(email);
    if (user == null) {
        const user = await signupNewUser(name, phoneNumber, email, password);
        // send verification email
        res.send({
            user
        });
    } else {
        res.send({
            errorCode: "USER_EXISTS"
        });
    }
});

export default router;