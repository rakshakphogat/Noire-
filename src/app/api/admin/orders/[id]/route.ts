import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(request: NextApiRequest) {
  try {
    await connectDB();
    const { id } = request.query;
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextApiRequest) {
  try {
    await connectDB();
    const { id } = request.query;
    const updates = await request.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        ...updates,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextApiRequest) {
  try {
    await connectDB();
    const { id } = request.query;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
