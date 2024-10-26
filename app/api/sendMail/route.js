import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email sending function
export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your email address
      to: process.env.EMAIL_USER, // Recipient address
      subject: 'New Message from ' + name, // Subject line
      text: `Message from: ${name}\n\n${message}`, // Plain text body
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333;">New Message from ${name}</h2>
          <p style="color: #555;">You have received a new message:</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
          <p style="color: #777; font-size: 12px; margin-top: 20px;">This email was sent from your contact form.</p>
        </div>
      `, // Enhanced HTML body
    };

    await transporter.sendMail(mailOptions); // Send email

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error); // Log the error
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
