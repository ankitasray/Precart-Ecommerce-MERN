import jwt from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ ok: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ ok: false });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ ok: false });
  }
};
