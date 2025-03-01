import prisma from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const generateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

export const getUser = async (req, res) => {
  const userData = await prisma.user.findMany({});
  res.status(200).json(userData);
};

export const userRegister = async (req, res) => {
  const { email, name, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
    },
  });
  res.status(200).json(userData);
};
export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!data) {
    return res.status(404).json("user Doesnot Exist");
  }
  const isMatch = await bcrypt.compare(password, data.password);
  if (!isMatch) {
    res.status(404).json("Password Not Match");
  }
  const token = generateToken(data);
  res.status(200).json(token);
};
const RefreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json("access Denied");
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json("Invalid Refresh TOken");
    }
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json(accessToken);
  });
};
