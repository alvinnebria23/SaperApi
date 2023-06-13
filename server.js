import UserRouter from "./routes/UserRouter.js"
import ShopeeRouter from "./routes/ShopeeRouter.js";
import ProxyUserRouter from "./routes/ProxyUserRouter.js";
import LinkRouter from "./routes/LinkRouter.js";
import https from "https";
import fs from "fs";
import express from 'express';
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

// Load SSL certificate and private key 
const options = { 
	key: fs.readFileSync('/path/to/private_key.pem'), 
	cert: fs.readFileSync('/path/to/certificate.pem') 
};
// Create HTTPS server 
const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
