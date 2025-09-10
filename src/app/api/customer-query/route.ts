import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface QueryRequest {
  query: string;
  customerName?: string;
  customerEmail?: string;
  category?: string;
}

interface QueryResponse {
  id: string;
  query: string;
  response: string;
  category: string;
  timestamp: string;
  customerName?: string;
  customerEmail?: string;
  status: "answered" | "pending";
}

// System prompt for e-commerce customer service
const SYSTEM_PROMPT = `You are a helpful customer service AI assistant for an e-commerce store called "Noiré". Your role is to assist customers with their queries about products, orders, shipping, returns, and general support.

Guidelines:
1. Be friendly, professional, and empathetic
2. Provide accurate and helpful information
3. If you don't know specific details about products or orders, politely ask for more information or suggest contacting human support
4. Keep responses concise but comprehensive
5. Always maintain a helpful tone
6. For order-specific queries, remind customers to provide order numbers
7. For product queries, be enthusiastic about the products while being honest
8. If the query is about returns, exchanges, or complaints, be understanding and solution-oriented

Store Information:
- Store Name: Noiré
- We offer a wide range of premium products
- Standard shipping takes 3-5 business days
- Express shipping takes 1-2 business days
- Free shipping on orders over $50
- 30-day return policy
- Customer service hours: 9 AM - 6 PM (Monday-Friday)

Respond as if you're speaking directly to the customer.`;

export async function POST(request: NextRequest) {
  try {
    const body: QueryRequest = await request.json();
    const { query, customerName, customerEmail, category = "general" } = body;
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Format the prompt with customer context
    const contextualPrompt = `${SYSTEM_PROMPT}

Customer Information:
${customerName ? `Name: ${customerName}` : "Name: Not provided"}
${customerEmail ? `Email: ${customerEmail}` : "Email: Not provided"}
Query Category: ${category}

Customer Query: "${query}"

Please provide a helpful response:`;

    // Generate response using Gemini
    const result = await model.generateContent(contextualPrompt);
    const response = await result.response;
    const aiResponse = response.text();
    // Create response object
    const queryResponse: QueryResponse = {
      id: `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query,
      response: aiResponse,
      category,
      timestamp: new Date().toISOString(),
      customerName,
      customerEmail,
      status: "answered",
    };

    // Log the query for analytics (you could save this to a database)
    // console.log("Customer Query Processed:", {
    //   id: queryResponse.id,
    //   category,
    //   timestamp: queryResponse.timestamp,
    //   hasCustomerInfo: !!(customerName || customerEmail),
    // });
    return NextResponse.json(queryResponse);
  } catch (error) {
    console.error("Error processing customer query:", error);
    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes("API_KEY")) {
        return NextResponse.json(
          { error: "AI service configuration error. Please contact support." },
          { status: 500 }
        );
      }
      if (error.message.includes("quota") || error.message.includes("limit")) {
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }
    }
    return NextResponse.json(
      {
        error:
          "Failed to process your query. Please try again or contact support.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Customer Query API is running",
    endpoints: {
      POST: "/api/customer-query - Submit a customer query",
    },
  });
}
