import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { amount, item_name, days } = req.body;
  const data = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    amount,
    item_name,
    return_url: 'http://localhost:3005/success',
    cancel_url: 'http://localhost:3005/cancel',
    notify_url: 'http://localhost:3005/api/payfast/notify',
  };
  const url = `https://sandbox.payfast.co.za/eng/process?${new URLSearchParams(data).toString()}`;
  return res.status(200).json({ redirectUrl: url });
}
