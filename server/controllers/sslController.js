import SSLCommerzPayment from "sslcommerz-lts";
import { v4 as uuidv4 } from "uuid";
import prisma from "../db.js";
import "dotenv/config";
import { sendDataMessage, sendNotification } from "./userController.js";

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;

export const initiatePayment = async (req, res) => {
  const userId = req.user.id;
  const { amount, menuId, quantity, paid } = req.body;

  const data = {
    total_amount: amount,
    currency: "BDT",
    tran_id: uuidv4(),
    success_url: `https://bidyarthi.onrender.com/api/ssl/success?userId=${userId}&menuId=${menuId}&quantity=${quantity}&paid=${paid}`,
    fail_url: "https://bidyarthi.vercel.app/userdashboard/meal",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Meal Order",
    product_category: "Food",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
    opt_a: userId,
    opt_b: menuId,
    opt_c: quantity,
    opt_d: paid,
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse) => {
    let GatewayPageURL = apiResponse.GatewayPageURL;
    res.send({ url: GatewayPageURL });
    console.log("Redirecting to: ", GatewayPageURL);
  });
};
export const successPayment = async (req, res) => {
  try {
    const { userId, menuId, quantity } = req.query;

    await prisma.cafeteriaMenu.update({
      where: { id: menuId },
      data: { quantity: { decrement: Number(quantity) } },
    });

    const newOrder = await prisma.cafeteriaOrder.create({
      data: {
        userId,
        menuId,
        quantity: parseInt(quantity, 10),
        paid: true,
        status: false,
      },
    });

    if (!newOrder) {
      return res.status(500).json({ error: "Order creation failed" });
    }

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
      orderId: String(newOrder.id),
      userId: String(userId),
      menuId: String(menuId),
      userName: String(userData.name),
      mealName: String(meal.mealName),
      quantity: String(quantity),
      paid: "true",
      preOrder: "false",
      topic: `chef-${chefId}`,
    };

    console.log("Notification Data:", notificationData);

    await sendDataMessage(notificationData, `chef-${chefId}`);

    await sendNotification(
      {
        title: "New Order Received",
        body: `Meal: ${meal.mealName}, Quantity: ${String(newOrder.quantity)}`,
      },
      `chef-${chefId}-notifications`
    );

    res.json({ success: true, redirectScreen: "ReqScreen" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to process order",
      details: error.message,
    });
  }
};
export const failedPayment = async (req, res) => {
  res.redirect("https://bidyarthi.vercel.app/userdashboard/meal");
};
