import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getAccessToken = async () => {
  const url = `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get access token:', error.response?.data || error.message);
    throw new Error('Unable to generate access token');
  }
};
export const stkPush = async (req, res) => {
  try {
    const token = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14); // Format: YYYYMMDDHHMMSS

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: '1', // Test with 1 KES
      PartyA: req.body.phone, // User's phone number (e.g., 2547XXXXXXXX)
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: req.body.phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: 'AccessNest',
      TransactionDesc: 'Testing STK push'
    };

    const response = await axios.post(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'STK Push failed', details: error.response?.data });
  }
};
