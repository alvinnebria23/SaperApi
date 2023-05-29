import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.API_KEY + process.env.API_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

export default checkToken;
