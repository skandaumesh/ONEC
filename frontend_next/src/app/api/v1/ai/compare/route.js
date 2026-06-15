import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { productIds } = await req.json();

    if (!productIds || productIds.length !== 2) {
      return NextResponse.json({ success: false, message: 'Exactly two Product IDs are required for comparison' }, { status: 400 });
    }

    const productA = await prisma.product.findUnique({ where: { id: parseInt(productIds[0]) } });
    const productB = await prisma.product.findUnique({ where: { id: parseInt(productIds[1]) } });

    if (!productA || !productB) {
      return NextResponse.json({ success: false, message: 'One or both products not found' }, { status: 404 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      const mockInsight = `**Comparison:**\n\n**${productA.name}** is generally used for ${productA.uses || 'its specific indications'} and contains ${productA.saltComposition || 'active ingredients'}.\n\n**${productB.name}**, on the other hand, is known for ${productB.uses || 'its own indications'} with ${productB.saltComposition || 'its active ingredients'}.\n\n*Note: This is a simulated fallback response because the Groq API key is missing.*`;
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({ success: true, data: mockInsight });
    }

    const prompt = `You are an educational health assistant. 
Please write a brief, objective comparison between the two products below. You MUST start your response with: "*Note: This is an AI summary and not medical advice.*"
Compare their active ingredients, primary uses, and suggest scenarios where one might be preferred over the other based purely on the provided text. Keep it under 150 words and do NOT give medical diagnoses or definitive recommendations.

Product 1: ${productA.name}
Description: ${productA.description || 'N/A'}
Uses: ${productA.uses || 'N/A'}
Ingredients: ${productA.saltComposition || 'N/A'}

Product 2: ${productB.name}
Description: ${productB.description || 'N/A'}
Uses: ${productB.uses || 'N/A'}
Ingredients: ${productB.saltComposition || 'N/A'}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Groq API Error:', errData);
      throw new Error('Groq API failed');
    }

    const data = await response.json();
    const insight = data.choices[0]?.message?.content || "Sorry, I couldn't generate a comparison.";

    return NextResponse.json({ success: true, data: insight });
  } catch (error) {
    console.error('AI Compare error:', error);
    return NextResponse.json({ success: false, message: 'Failed to generate comparison' }, { status: 500 });
  }
}
