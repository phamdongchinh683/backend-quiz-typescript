const routerAuth = require("./Auth");
const routerUser = require("./User");
const routerAdmin = require("./Admin");

function router(app) {
  app.use("/api/auth", routerAuth);
  app.use("/api/user", routerUser);
  app.use("/api/admin", routerAdmin);
}

module.exports = router;
