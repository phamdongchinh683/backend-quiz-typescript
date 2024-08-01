import routerAuth from "./Auth";
// import routerAdmin from "../routers/Admin";

function routerApp(app: any) {
  app.use("/api/auth", routerAuth);
  // app.use("/api/admin", routerAdmin);
  // app.use("/api/user", (req:any, res:any) => res.send('User route'));
}

export = routerApp;
