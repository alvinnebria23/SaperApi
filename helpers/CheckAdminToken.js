import jwt from "jsonwebtoken";

const checkAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.API_KEY + process.env.API_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    if(user.type === "admin"){
      next();
    }
    return res.sendStatus(403);
  });
};

export default checkAdminToken;
