import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface OrderEmailData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

// Password Reset Email Function
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
) => {
  const resetLink = `${
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  }/auth/reset-password?token=${resetToken}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset Request</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .reset-section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .reset-button { 
          display: inline-block; 
          background: #4F46E5; 
          color: white; 
          padding: 12px 30px; 
          text-decoration: none; 
          border-radius: 5px; 
          font-weight: bold;
        }
        .reset-button:hover { background: #3730A3; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .warning { background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset for your account. Click the button below to reset your password:</p>
          
          <div class="reset-section">
            <a href="${resetLink}" class="reset-button">Reset Password</a>
            <p style="margin-top: 20px; color: #666;">
              This link will expire in <strong>1 hour</strong>
            </p>
          </div>
          
          <div class="warning">
            <p><strong>Security Notice:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>For security reasons, this link will expire in 1 hour</li>
              <li>Never share this reset link with anyone</li>
            </ul>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <code style="background: #f4f4f4; padding: 5px; border-radius: 3px; word-break: break-all;">
              ${resetLink}
            </code>
          </p>
        </div>
        
        <div class="footer">
          <p>This is an automated email, please do not reply.</p>
          <p>If you need help, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return false;
  }
};

export const sendOrderConfirmationEmail = async (data: OrderEmailData) => {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${
        item.name
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(
        item.price * item.quantity
      ).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f8f9fa; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>
        
        <div class="content">
          <h2>Hi ${data.customerName},</h2>
          <p>Your order has been confirmed and will be processed shortly.</p>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <h4>Items Ordered:</h4>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr class="total">
                  <td colspan="2">Total</td>
                  <td style="text-align: right;">$${data.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div class="order-details">
            <h3>Shipping Address</h3>
            <p>
              ${data.shippingAddress.firstName} ${
    data.shippingAddress.lastName
  }<br>
              ${data.shippingAddress.address}<br>
              ${data.shippingAddress.city}, ${data.shippingAddress.state} ${
    data.shippingAddress.postalCode
  }<br>
              ${data.shippingAddress.country}
            </p>
          </div>
          
          <p>We'll send you another email with tracking information once your order ships.</p>
        </div>
        
        <div class="footer">
          <p>Thank you for shopping with us!</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: data.customerEmail,
    subject: `Order Confirmation - ${data.orderId}`,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
};

export const sendOrderStatusUpdateEmail = async (
  customerEmail: string,
  customerName: string,
  orderId: string,
  status: string,
  trackingNumber?: string
) => {
  const statusMessages = {
    confirmed: "Your order has been confirmed and is being prepared.",
    processing: "Your order is currently being processed.",
    shipped: `Your order has been shipped${
      trackingNumber ? ` with tracking number: ${trackingNumber}` : ""
    }.`,
    delivered: "Your order has been delivered successfully!",
    cancelled: "Your order has been cancelled.",
  };

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .status-update { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .status-badge { display: inline-block; padding: 10px 20px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
        .confirmed { background: #10B981; color: white; }
        .processing { background: #3B82F6; color: white; }
        .shipped { background: #8B5CF6; color: white; }
        .delivered { background: #059669; color: white; }
        .cancelled { background: #EF4444; color: white; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Update</h1>
        </div>
        
        <div class="content">
          <h2>Hi ${customerName},</h2>
          <p>We have an update on your order <strong>${orderId}</strong>.</p>
          
          <div class="status-update">
            <span class="status-badge ${status}">${status}</span>
            <p style="margin-top: 20px;">${
              statusMessages[status as keyof typeof statusMessages]
            }</p>
            
            ${
              trackingNumber
                ? `
              <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px;">
                <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
                <a href="#" style="color: #0ea5e9; text-decoration: none;">Track your package</a>
              </div>
            `
                : ""
            }
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for shopping with us!</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: `Order Update - ${orderId}`,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send order status update email:", error);
  }
};
