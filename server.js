import UserRouter from "./routes/UserRouter.js"
import ShopeeRouter from "./routes/ShopeeRouter.js";
import LinkRouter from "./routes/LinkRouter.js";
import https from "https";
import fs from "fs";
import AdminRouter from "./routes/AdminRouter.js";
import express from 'express';
import checkAdminToken from "./helpers/CheckAdminToken.js";
const app = express();
const PORT = process.env.PORT || 443;

//middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//routers
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/shopee", ShopeeRouter);
app.use("/api/v1/link", LinkRouter);
app.use("/api/v1/admin", checkAdminToken, AdminRouter)
app.use("/test", (req, res) => {
  res.send({ success: true });
});

// Load SSL certificate and private key 
const options = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH || '/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/etc/letsencrypt/live/yourdomain.com/fullchain.pem')
};

// Create HTTPS server 
const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
