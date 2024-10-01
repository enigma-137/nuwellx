// /app/api/barcode-lookup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { barcode } = await req.json();

  try {
    // Example API request using Zebra Barcode Lookup (replace with real URL and params)
    const response = await axios.get(`https://api.zebra.com/barcode-lookup`, {
      params: {
        barcode,
        // other parameters as needed
      },
      headers: {
        'Authorization': `Bearer ${process.env.ZEBRA_API_KEY}`, // Set your Zebra API Key
        'Content-Type': 'application/json',
      },
    });

    const productData = response.data;

    // Return the product data as JSON
    return NextResponse.json({ product: productData });
  } catch (error) {
    console.error('Error fetching product data:', error);
    return NextResponse.json({ error: 'Error fetching product data' }, { status: 500 });
  }
}
