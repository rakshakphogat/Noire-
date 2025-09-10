import { requireAuth } from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/lib/models/Order";
import jsPDF from "jspdf";
import { IOrderItem } from "@/app/types/Order";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const order = await Order.findOne({
      _id: params.orderId,
      userId: authResult.user._id,
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    // Generate PDF
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Invoice", 20, 20);
    pdf.setFontSize(12);
    pdf.text(`Order ID: ${order._id}`, 20, 40);
    pdf.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 50);
    pdf.text("Items:", 20, 70);
    let y = 80;
    (order.items as IOrderItem[]).forEach((item) => {
      pdf.text(
        `${item.name} (${item.color || ""} ${item.size || ""}) x${
          item.quantity
        } - $${item.price}`,
        20,
        y
      );
      y += 10;
    });
    pdf.text(`Subtotal: $${order.subtotal}`, 20, y + 10);
    pdf.text(`Shipping: $${order.shipping}`, 20, y + 20);
    pdf.text(`Tax: $${order.tax}`, 20, y + 30);
    pdf.text(`Total: $${order.total}`, 20, y + 40);

    // Convert PDF to buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order._id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
