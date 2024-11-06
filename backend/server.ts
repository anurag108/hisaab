import express, { Express, NextFunction, Request, Response } from "express";
import session, { MemoryStore } from "express-session";
import cors from "cors";

import loginHandler from "./route_handlers/login_handler";
import signupHandler from "./route_handlers/signup_handler";
import bizHandler from "./route_handlers/business_handler";
import traderHandler from "./route_handlers/trader_handler";
import poHandler from "./route_handlers/po_handler";
import { User, UserStatus } from "./types";

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
  secret: 'VERY_SECURE_SESSION_SECRET', // TODO
  store: new MemoryStore(),
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 4 * 3600 * 1000,
    secure: false,
  },
}));

function isUserLoggedIn(req: Request, res: Response, next: NextFunction) {
  req.session.user = {
    id: "CIeubNg9SNPgbtnMYiEO",
    name: "Anurag Gupta",
    email: "severus.snape987@gmail.com",
    phone: {
      countryCode: "91",
      phoneNumber: "8130992702"
    },
    status: UserStatus.ACTIVE,
    creationTime: 1730799542689,
    updateTime: 1730799542689
  };
  if (req.session.user) {
    next();
  } else {
    res.status(403).send("UNAUTHORIZED");
  }
}

app.use("/log", loginHandler);
app.use("/signup", signupHandler);
app.use("/business", isUserLoggedIn, bizHandler);
app.use("/trader", isUserLoggedIn, traderHandler);
app.use("/po", isUserLoggedIn, poHandler);

app.use((req: Request, res: Response) => {
  res.status(404).send("Sorry can't find that!")
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Something went wrong. Please try again.");
})

// Server setup
app.listen(8080, () => {
  console.log("Server is Running")
});