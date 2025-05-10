import cloudinary from "../cloudinaryConfig.js";
import prisma from "../db.js";
import "dotenv/config";
import SSLCommerzPayment from "sslcommerz-lts";
import { v4 as uuidv4 } from "uuid";

export const postFee = async (req, res) => {
  const { feeName, feeType, amount, feeDate, feeDescription } = req.body;

  const feePost = await prisma.fee.create({
    data: {
      feeName,
      feeType,
      amount,
      feeDate,
      feeDescription,
    },
  });
  res.status(200).json(feePost);
};
export const feeGet = async (req, res) => {
  const feeget = await prisma.fee.findMany({});
  res.status(200).json(feeget);
};
export const feeGetByid = async (req, res) => {
  const feeget = await prisma.fee.findFirst({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json(feeget);
};

// SSL

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;

export const initiatePayment = async (req, res) => {
  const { amount, feeId } = req.body;
  const userId = req.user.id;
  const data = {
    total_amount: amount,
    currency: "BDT",
    tran_id: uuidv4(),
    success_url: `https://bidyarthi-server.vercel.app/api/fee/success?feeId=${feeId}&userId=${userId}`,
    fail_url: "http://localhost:3000/userdashboard/fee",
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
    opt_a: feeId,
    opt_b: userId,
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
    const { feeId, userId } = req.query;
    await prisma.pay.create({
      data: {
        status: true,
        feeId,
        userId,
      },
    });
    res.json({ success: true, redirectScreen: "FeeScreen" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to process order",
      details: error.message,
    });
  }
};
export const failedPayment = async (req, res) => {
  res.redirect("http://localhost:3000/userdashboard/fee");
};

export const feeStatusCheck = async (req, res) => {
  const userId = req.user.id;
  const data = await prisma.pay.findFirst({
    where: {
      feeId: req.params.id,
      userId,
    },
  });
  res.status(200).json(data);
};

export const payCheck = async (req, res) => {
  const data = await prisma.pay.findMany({
    include: {
      user: true,
      fee: true,
    },
  });
  res.status(200).json(data);
};
