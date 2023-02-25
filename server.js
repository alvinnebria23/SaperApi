const UserRouter = require("./routes/UserRouter");
const ConvertionReportRouter = require("./routes/ConversionReportRouter");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

//middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//routers
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/report", ConvertionReportRouter);

//test api
app.get("/test", (req, res) => {
  res.json({ message: "Hello from api" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
