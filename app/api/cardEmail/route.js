import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, message, subject, filters } = await request.json();

    // Validate input
    if (!name || !email || !message || !subject) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true, // Enable logger
      debug: true,  // Enable debug output
    });
    
    const mailOptionsToOwner = {
      from: process.env.EMAIL_USER,
      to: 'emmanuelmakau90@gmail.com', // Replace with your email address
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333;">New Message from ${name}</h2>
          <p style="color: #555;">You have received a new message:</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <p><strong>Filters:</strong></p>
            <ul>
              <li><strong>House Type:</strong> ${filters.houseType}</li>
              <li><strong>Star Rating:</strong> ${filters.starRating}</li>
              <li><strong>Occupation:</strong> ${filters.occupation}</li>
              <li><strong>Location:</strong> ${filters.userLocation}</li>
            </ul>
          </div>
        </div>
      `,
    };

    // Send email to owner
    await transporter.sendMail(mailOptionsToOwner);

    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for contacting us about ${filters.houseType}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333;">Thank you for your message, ${name}!</h2>
          <p style="color: #555;">We have received your message and will respond to you shortly.</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <p><strong>Filters you selected:</strong></p>
            <ul>
              <li><strong>House Type:</strong> ${filters.houseType}</li>
              <li><strong>Star Rating:</strong> ${filters.starRating}</li>
              <li><strong>Occupation:</strong> ${filters.occupation}</li>
              <li><strong>Location:</strong> ${filters.userLocation}</li>
            </ul>
          </div>
          <p style="color: #777; font-size: 12px; margin-top: 20px;">Thank you for contacting us. We will get back to you shortly!</p>
        </div>
      `,
    };

    // Send thank-you email to user
    await transporter.sendMail(mailOptionsToUser);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email: ' + error.message }, { status: 500 });
  }
}
