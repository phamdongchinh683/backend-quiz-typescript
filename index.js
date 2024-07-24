const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 8888;
const router = require("./src/routers/router");
const configureMiddleware = require("./src/middlewares");
const viewsPath = path.join(__dirname, "src/views");
const publicPath = path.join(__dirname, "src", "public");

app.use(express.static(publicPath));
configureMiddleware(app);
router(app);
app.set("views", viewsPath);
app.set("view engine", "pug");

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
