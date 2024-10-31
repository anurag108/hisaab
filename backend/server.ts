import express, { Express, Request, Response } from "express";
import session from "express-session";
import cors from "cors";

import loginHandler from "./route_handlers/login_handler";
import bizHandler from "./route_handlers/business_handler";
import brokerHandler from "./route_handlers/broker_handler";
import poHandler from "./route_handlers/po_handler";
import { User } from "./types";

const app: Express = express();
app.use(cors());
app.use(express.json());
// So that we can save user object in session data
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}
app.use(session({
  secret: 'VERY_SECURE_COOKIE_SECRET',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000
  },
}));

// app.get("/", async (req, res) => {
//     // authenticate the user, if not already
//     // redirect user to home page of their business
//     // if not authenticated, ask the user to enter business url
//     const purchaseOrders = purchaseOrderDb.getPurchaseOrders(req.body.businessId);
//     res.send(purchaseOrders);
// });

app.use("/log", loginHandler);
app.use("/business", bizHandler);
app.use("/broker", brokerHandler);
app.use("/po", poHandler);

app.use((req: Request, res: Response) => {
  res.status(404).send("Sorry can't find that!")
});

// Server setup
app.listen(8080, () => {
  console.log("Server is Running")
});