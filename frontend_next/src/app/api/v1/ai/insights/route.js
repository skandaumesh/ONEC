import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: { category: true }
    });

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      // Fallback simulated response if no API key is present
      const mockInsight = `Based on our records, **${product.name}** is primarily used for ${product.uses ? product.uses.toLowerCase() : 'various health conditions'}. It is a ${product.category?.name || 'pharmaceutical'} product.\n\n**Salt Composition:** ${product.saltComposition || 'Not specified'}\n**Dosage Form:** ${product.dosageForm || 'Standard'}\n\n*Disclaimer: Always consult your healthcare provider before starting any medication.*`;
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({ success: true, data: mockInsight });
    }

    // Call Groq LLaMA API
    const prompt = `You are an educational text summarization assistant. 
Please write a short, educational summary of the following product data. You MUST start your response with: "*Note: This is an AI summary and not medical advice.*"
Then, simply summarize the provided description and uses into a simple, readable paragraph under 80 words. Do NOT give any medical recommendations, diagnoses, or safety advice. Only summarize the provided text.
    
Product Name: ${product.name}
Description: ${product.description || 'N/A'}
Uses: ${product.uses || 'N/A'}
Ingredients: ${product.saltComposition || 'N/A'}
Common side effects: ${product.sideEffects || 'N/A'}`;

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
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Groq API Error:', errData);
      throw new Error('Groq API failed');
    }

    const data = await response.json();
    const insight = data.choices[0]?.message?.content || "Sorry, I couldn't generate an insight for this product.";

    return NextResponse.json({ success: true, data: insight });
  } catch (error) {
    console.error('AI Insights error:', error);
    return NextResponse.json({ success: false, message: 'Failed to generate insight' }, { status: 500 });
  }
}
