import prisma from '../config/db.js';
// import { sendMail } from '../services/emailService.js';

 import {sendAdminContactEmail} from '../services/emailService.js'

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || !email || !phone || !message) {
      return res
        .status(400)
        .json({ ok: false, error: "name, email, phone, message are required" });
    }

    // 1) Save in DB
    const saved = await prisma.contactMessage.create({
      data: { name, email, phone, message },
    });

    // 2) Figure out recipient & send email
    const mailedTo = process.env.ADMIN_MAIL || process.env.GMAIL_USER;

     try {
      const info = await sendAdminContactEmail({ name, email, phone, message });
      console.log("sendAdminContactEmail success:", info && info.messageId ? info.messageId : info);
    } catch (mailErr) {
      // Full stack logged so Render logs show root cause
      console.error("sendAdminContactEmail failed (non-fatal):", mailErr && (mailErr.stack || mailErr));
      // Return success for saved data but include mailError info
      return res.status(201).json({
        ok: true,
        message: "Message saved, but sending email to admin failed.",
        data: saved,
        mailedTo,
        mailError: mailErr && (mailErr.message || String(mailErr)),
      });
    }

    // 3) Return a richer response
    return res.status(201).json({
      ok: true,
      message: "Message submitted successfully",
      mailedTo,        // 👈 which inbox received it
      data: saved,     // 👈 the saved DB record
    });
  } catch (err) {
       console.error("createContactMessage error:", err && (err.stack || err));
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
}



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
