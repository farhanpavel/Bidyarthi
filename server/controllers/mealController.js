import cloudinary from "../cloudinaryConfig.js";
import prisma from "../db.js";
import multer from "multer";
import { sendDataMessage, sendNotification } from "./userController.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getMeal = async (req, res) => {
  const userId = req.user.id;
  try {
    const mealData = await prisma.cafeteriaMenu.findMany({
      where: {
        user_id: userId,
      },

      include: {
        user: {
          include: {
            chefAssignment: {
              include: {
                restaurant: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(mealData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
export const getMealForAllUser = async (req, res) => {
  try {
    const mealData = await prisma.cafeteriaMenu.findMany({
      include: {
        user: {
          include: {
            chefAssignment: {
              include: {
                restaurant: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(mealData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
export const getMealByChef = async (req, res) => {
  const user_id = req.user.id;
  try {
    const mealData = await prisma.cafeteriaMenu.findMany({
      where: {
        user_id,
      },
      include: {
        user: {
          include: {
            chefAssignment: {
              include: {
                restaurant: true,
              },
            },
          },
        },
        orders: {
          include: {
            user: true, 
          },
        },
      },
    });
    res.status(200).json(mealData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const getMealById = async (req, res) => {
  try {
    const mealData = await prisma.cafeteriaMenu.findMany({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(mealData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const getReqMeal = async (req, res) => {
  const userId = req.user.id; 

  try {
    const mealData = await prisma.cafeteriaOrder.findMany({
      where: { userId },
      include: {
        menu: {
          include: {
            user: {
              include: {
                chefAssignment: {
                  include: {
                    restaurant: true, 
                  },
                },
              },
            },
          },
        },
      },
    });

    res.status(200).json(mealData);
  } catch (error) {
    console.error("Error fetching meal data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
export const putPreMeal = async (req, res) => {
  const userId = req.user.id;
  const { menuId, quantity } = req.body;
  try {
    const mealData = await prisma.cafeteriaOrder.create({
      data: {
        userId,
        menuId,
        quantity: parseInt(quantity, 10),
        paid: false,
        status: false,
        preOrder: true,
      },
    });

    const meal = await prisma.cafeteriaMenu.findUnique({
      where: { id: menuId },
      include: {
        user: {
          include: {
            chefAssignment: {
              include: { restaurant: true },
            },
          },
        },
      },
    });
    const userData = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    const chefId = meal.user.id;


    const notificationData = {
      orderId: String(mealData.id),
      userId: String(userId),
      menuId: String(menuId),
      userName: String(userData.name),
      mealName: String(meal.mealName),
      quantity: String(quantity),
      paid: "false",
      preOrder: "true",
      topic: `chef-${chefId}`,
    };

    console.log("Notification Data:", notificationData);

    await sendDataMessage(notificationData, `chef-${chefId}`);

    await sendNotification(
      {
        title: "New Preorder Received",
        body: `Meal: ${meal.mealName}, Quantity: ${String(quantity)}`,
      },
      `chef-${chefId}-notifications`
    );

    res.status(200).json(mealData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const postMeal = async (req, res) => {
  const userId = req.user.id;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "meal" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const newCafe = await prisma.cafeteriaMenu.create({
      data: {
        user_id: userId,
        meal_url: result.secure_url,
        mealName: req.body.mealName,
        mealType: req.body.mealType,
        description: req.body.description,
        price: parseFloat(req.body.price),
        quantity: parseInt(req.body.quantity),
      },
    });

    res.status(201).json({ message: "Cafe added successfully", data: newCafe });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};
export const mealDelete = async (req, res) => {
  const mealData = await prisma.cafeteriaOrder.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json(mealData);
};
export const mealquantityChanger = async (req, res) => {
  const mealData = await prisma.cafeteriaMenu.update({
    where: {
      id: req.params.id,
    },
    data: {
      quantity: Number(req.body.quantity),
    },
  });
  await prisma.cafeteriaOrder.delete({
    where: {
      id: req.body.orderId,
    },
  });
  res.status(200).json(mealData);
};

export const uploadMiddleware = upload.single("file");
