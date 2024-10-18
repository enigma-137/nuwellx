import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recipe = await req.json()

    const savedRecipe = await prisma.savedRecipe.create({
      data: {
        userId,
        food_name: recipe.food_name,
        ingredients: recipe.ingredients,
        preparation_instructions: recipe.preparation_instructions,
        preparation_time: recipe.preparation_time,
        cooking_time: recipe.cooking_time,
        cuisine: recipe.cuisine,
        calories: recipe.calories,
        total_time: recipe.total_time,
        course: recipe.course,
        servings: recipe.servings,
        savedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Recipe saved successfully', recipeId: savedRecipe.id }, { status: 201 })
  } catch (error) {
    console.error('Error saving recipe:', error)
    return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const savedRecipes = await prisma.savedRecipe.findMany({
      where: { userId },
      orderBy: { savedAt: 'desc' },
    })

    console.log('Fetched saved recipes:', savedRecipes) // Debugging log

    return NextResponse.json({ recipes: savedRecipes })
  } catch (error) {
    console.error('Error fetching saved recipes:', error)
    return NextResponse.json({ error: 'Failed to fetch saved recipes'}, { status: 500 })
  }
}


export async function DELETE(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let id: string | null = null

    // Check if the ID is in the query parameters
    const { searchParams } = new URL(req.url)
    id = searchParams.get('id')

    // If not in query parameters, check if it's in the path
    if (!id) {
      const pathParts = req.url.split('/')
      id = pathParts[pathParts.length - 1]
    }

    if (!id) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 })
    }

    const deletedRecipe = await prisma.savedRecipe.deleteMany({
      where: {
        id: id,
        userId: userId,
      },
    })

    if (deletedRecipe.count === 0) {
      return NextResponse.json({ error: 'Recipe not found or not authorized to delete' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Recipe deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 })
  }
}