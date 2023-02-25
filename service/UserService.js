const checkApi = async () => {
  const sha256 = require("js-sha256").sha256;
  const appId = 123456;
  const secretKey = "demo";
  const payload = '{"query":"{brandOffer{nodes{commissionRateofferName}}}"}';
  const timestamp = 1577836800;
  const factor = appId + timestamp + payload + secretKey;
  console.log(factor);
  const signature = sha256(factor);
  console.log(signature);
};

module.exports = { checkApi };
