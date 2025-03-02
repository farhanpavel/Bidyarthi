import prisma from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const generateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

export const getUser = async (req, res) => {
  const userData = await prisma.user.findMany({});
  res.status(200).json(userData);
};
export const getUserByroleFalse = async (req, res) => {
  const userData = await prisma.user.findMany({
    where: {
      role: req.params.role,
      status: false,
    },
  });
  res.status(200).json(userData);
};
export const getUserByroleTrue = async (req, res) => {
  try {
    let userData;

    switch (req.params.role) {
      case "Busdriver":
        userData = await prisma.user.findFirst({
          where: {
            role: req.params.role,
            status: true,
            busDriverAssignment: {
              is: {
                routeId: req.params.id,
              },
            },
          },
          include: {
            busDriverAssignment: {
              include: {
                route: true,
              },
            },
          },
        });
        break;

      case "Clubpresident":
        userData = await prisma.user.findFirst({
          where: {
            role: req.params.role,
            status: true,
            clubMembership: {
              is: {
                clubId: req.params.id,
              },
            },
          },
          include: {
            clubMembership: {
              include: {
                club: true,
              },
            },
          },
        });
        break;

      case "Cafeteriachef":
        userData = await prisma.user.findFirst({
          where: {
            role: req.params.role,
            status: true,
            chefAssignment: {
              is: {
                restaurantId: req.params.id,
              },
            },
          },
          include: {
            chefAssignment: {
              include: {
                restaurant: true,
              },
            },
          },
        });
        break;

      default:
        return res.status(400).json({ message: "Invalid role provided" });
    }

    if (!userData) {
      return res
        .status(404)
        .json({ message: "No assigned user found for this role and ID" });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
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
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json(accessToken);
  });
};
