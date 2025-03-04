import SSLCommerzPayment from "sslcommerz-lts";
import { v4 as uuidv4 } from "uuid";
import prisma from "../db.js";
import "dotenv/config";

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
    // Extract data from the query parameters
    const { userId, menuId, quantity, paid } = req.query;
    await prisma.cafeteriaMenu.update({
      where: {
        id: menuId,
      },
      data: {
        quantity: {
          decrement: Number(quantity),
        },
      },
    });

    // Create the order in the database
    const updatedPayment = await prisma.cafeteriaOrder.create({
      data: {
        userId,
        menuId,
        quantity: parseInt(quantity, 10),
        paid: true,
        status: false,
      },
    });

    // Check if the order was successfully created
    if (updatedPayment) {
      res.redirect("http://localhost:3000/userdashboard/meal/request"); // Redirect user to the dashboard
    } else {
      res.status(404).json({ error: "Order creation failed" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to create order",
      details: error.message,
    });
  }
};
export const failedPayment = async (req, res) => {
  res.redirect("http://localhost:3000/userdashboard/meal");
};
