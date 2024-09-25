import { NextRequest, NextResponse } from 'next/server';
import { analyzeFood } from '@/lib/foodAnalysis';
import { File } from 'buffer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const foodName = formData.get('foodName');
    const image = formData.get('image');

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
    console.error('Error analyzing food:', error);
    return NextResponse.json({ error: 'Failed to analyze food' }, { status: 500 });
  }
}