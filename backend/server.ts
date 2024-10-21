import express, { Express, Request, Response } from "express";

import bizHandler from "./route_handlers/business_handler";
import brokerHandler from "./route_handlers/broker_handler";
import poHandler from "./route_handlers/po_handler";

const app: Express = express();
app.use(express.json())

app.use((req: Request, res: Response, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

// app.get("/", async (req, res) => {
//     // authenticate the user, if not already
//     // redirect user to home page of their business
//     // if not authenticated, ask the user to enter business url
//     const purchaseOrders = purchaseOrderDb.getPurchaseOrders(req.body.businessId);
//     res.send(purchaseOrders);
// });

// app.use("/log", loginHandler);
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