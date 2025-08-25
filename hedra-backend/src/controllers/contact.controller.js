import prisma from '../config/db.js';
import { sendMail } from '../services/emailService.js';

export const submitContact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Save to DB
  const contact = await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone,
      message,
    },
  });

  // Send email notification (optional)
  try {
    await sendMail({
      to: process.env.SMTP_USER,
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Inquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });
  } catch (err) {
    console.warn('Email failed to send:', err.message);
  }

  res.status(201).json({ message: 'Message submitted successfully' });
};

export const getAllMessages = async (req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(messages);
};
