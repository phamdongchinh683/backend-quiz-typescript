import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";

import routerApp from "./routers/router";
import Database from "./config/config";


dotenv.config();
const app: express.Express = express();
const router: express.Router = express.Router();
const port = process.env.PORT || 3000;

const mySql = Database.getInstance();
mySql.checkConnection();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("combined"));

routerApp(app);
app.use(router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
