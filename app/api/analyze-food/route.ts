import { NextRequest, NextResponse } from 'next/server';
import { analyzeFood } from '@/lib/foodAnalysis';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    let foodName: string | null = null;
    let image: File | null = null;

    if (contentType?.includes('application/json')) {
      const jsonData = await request.json();
      foodName = jsonData.foodName;
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      foodName = formData.get('foodName') as string | null;
      image = formData.get('image') as File | null;
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
    }

    let foodAnalysis;

    if (typeof foodName === 'string' && foodName.trim() !== '') {
      foodAnalysis = await analyzeFood(foodName.trim());
    } else if (image instanceof File) {
      foodAnalysis = await analyzeFood(image);
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