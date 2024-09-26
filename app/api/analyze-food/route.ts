import { NextRequest, NextResponse } from 'next/server';
import { analyzeFood } from '@/lib/foodAnalysis';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    let foodName: string | null = null;
    let imageBuffer: ArrayBuffer | null = null;
    let imageMimeType: string | null = null;

    if (contentType?.includes('application/json')) {
      const jsonData = await request.json();
      foodName = jsonData.foodName;
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      foodName = formData.get('foodName') as string | null;
      const imageFile = formData.get('image') as File | null;
      if (imageFile) {
        imageBuffer = await imageFile.arrayBuffer();
        imageMimeType = imageFile.type;
      }
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
    }

    let foodAnalysis;

    if (typeof foodName === 'string' && foodName.trim() !== '') {
      foodAnalysis = await analyzeFood(foodName.trim());
    } else if (imageBuffer && imageMimeType) {
      foodAnalysis = await analyzeFood({ buffer: imageBuffer, mimeType: imageMimeType });
    } else {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    return NextResponse.json({ foodAnalysis });
  } catch (error) {
    console.error('Error in analyze-food route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}