import { NextResponse } from 'next/server';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import axios from 'axios';

const CONSUMER_KEY = process.env.FATSECRET_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.FATSECRET_CONSUMER_SECRET;

const oauth =  new OAuth({
  consumer: {
    key: CONSUMER_KEY!,
    secret: CONSUMER_SECRET!,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString, key) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64');
  },
});

export async function POST(req: Request) {
  const { barcode } = await req.json();

  const url = 'https://platform.fatsecret.com/rest/server.api';
  const params = {
    method: 'food.find_id_for_barcode',
    format: 'json',
    barcode: barcode,
  };

  const requestData = {
    url,
    method: 'GET',
    data: params,
  };

  const authHeader = oauth.authorize(requestData);

  try {
    const response = await axios.get(url, {
      params,
      headers: {
        ...authHeader,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching food:', error);
    return NextResponse.json({ error: 'Failed to fetch food data' }, { status: 500 });
  }
}
