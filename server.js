import UserRouter from "./routes/UserRouter.js"
import ShopeeRouter from "./routes/ShopeeRouter.js";
import ProxyUserRouter from "./routes/ProxyUserRouter.js";
import LinkRouter from "./routes/LinkRouter.js";
import AdminRouter from "./routes/AdminRouter.js";
import express from 'express';
import checkAdminToken from "./helpers/CheckAdminToken.js";
const app = express();
const PORT = process.env.PORT || 8081;

//middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//routers
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/shopee", ShopeeRouter);
app.use("/api/v1/link", LinkRouter);
app.use("/user", ProxyUserRouter)
app.use("/api/v1/admin", checkAdminToken, AdminRouter)
app.use("/test", (req, res) => {
  res.send({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
