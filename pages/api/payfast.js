import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { amount, item_name, user_email, rental_days } = req.body;
  const merchantId = "22934046";
  const merchantKey = "djtg9inihumhl";
  const returnUrl = "https://besthubs-luxury-33klnhypi-kingobes-projects.vercel.app/success";
  const cancelUrl = "https://besthubs-luxury-33klnhypi-kingobes-projects.vercel.app/cancel";
  const notifyUrl = "https://besthubs-luxury-33klnhypi-kingobes-projects.vercel.app/api/payfast-notify";

  const data = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    name_first: user_email.split("@")[0],
    email_address: user_email,
    m_payment_id: `order_${Date.now()}`,
    amount: parseFloat(amount).toFixed(2),
    item_name,
    payment_method: "cc",
  };

  const signature = Object.keys(data)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
    .join("&");
  data.signature = crypto.createHash("md5").update(signature).digest("hex");

  try {
    const client = new DynamoDBClient({ region: "us-west-2" });
    const docClient = DynamoDBDocumentClient.from(client);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(rental_days));
    await docClient.send(new PutCommand({
      TableName: "Orders",
      Item: {
        id: data.m_payment_id,
        email: user_email,
        item: item_name,
        total: parseFloat(amount),
        status: "pending",
        endDate: endDate.toISOString().split("T")[0],
      },
    }));
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
}
