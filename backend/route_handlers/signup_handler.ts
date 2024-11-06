import express, { Express, Request, Response } from "express";
import { genUserByEmail, signupNewUser } from "../firestore/user_db";
const router: Express = express();

router.post("/", async (req: Request, res: Response) => {
    const name = req.body.name;
    const countryCode = req.body.countryCode;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;
    const password = req.body.password;
    const user = await genUserByEmail(email);
    if (user == null) {
        const user = await signupNewUser(
            name,
            countryCode,
            phoneNumber,
            email,
            password
        );
        // send verification email
        res.send({
            error: false,
            user
        });
    } else {
        res.send({
            error: true,
            errorCode: "USER_EXISTS"
        });
    }
});

router.post("/verification", async (req: Request, res: Response) => {
    // TODO: Email verification for a new user
});

export default router;