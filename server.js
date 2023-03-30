import UserRouter from "./routes/UserRouter.js"
import ConvertionReportRouter from "./routes/ConversionReportRouter.js"
import ShopeeRouter from "./routes/ShopeeRouter.js";
import express from 'express';
const app = express();
const PORT = process.env.PORT || 8081;

//middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//routers
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/report", ConvertionReportRouter);
app.use("/api/v1/shopee", ShopeeRouter);

//test api
app.get("/test", (req, res) => {
  res.send({ message: "Hello from alvin api" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
