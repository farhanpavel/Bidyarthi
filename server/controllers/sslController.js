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
    success_url: `http://localhost:4000/api/ssl/success?userId=${userId}&menuId=${menuId}&quantity=${quantity}&paid=${paid}`,
    fail_url: "http://localhost:3000/userdashboard/meal",
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
    opt_a: userId, // Pass userId as custom field
    opt_b: menuId, // Pass menuId as custom field
    opt_c: quantity, // Pass quantity as custom field
    opt_d: paid, // Pass paid status as custom field
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

    // Decrease quantity of the ordered meal in stock
    await prisma.cafeteriaMenu.update({
      where: { id: menuId },
      data: { quantity: { decrement: Number(quantity) } },
    });

    // Fetch meal data for the user
    // const mealData = await prisma.cafeteriaOrder.findMany({
    //   where: { userId },
    //   include: {
    //     menu: {
    //       include: {
    //         user: {
    //           include: {
    //             chefAssignment: {
    //               include: { restaurant: true },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // if (!mealData.length) {
    //   return res.status(404).json({ error: "Meal data not found" });
    // }

    // Create a new order
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

    // Fetch the chef's information based on the menuId
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

    // Construct notification data
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

    // Redirect user after successful payment
    res.redirect("http://localhost:3000/userdashboard/meal/request");
  } catch (error) {
    res.status(500).json({
      error: "Failed to process order",
      details: error.message,
    });
  }
};
export const failedPayment = async (req, res) => {
  res.redirect("http://localhost:3000/userdashboard/meal");
};
