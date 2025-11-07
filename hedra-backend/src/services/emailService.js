// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export const sendMail = async ({ to, subject, html }) => {
//   return transporter.sendMail({
//     from: `"Hedra Fabrications" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };

import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // ✅ important for Render
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // ✅ prevents Render SSL block
  },
});

export async function sendAdminContactEmail(data) {
  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif">
      <h2 style="margin:0 0 8px">New Contact Message</h2>
      <p><b>Name:</b> ${escapeHtml(data.name)}</p>
      <p><b>Email:</b> ${escapeHtml(data.email)}</p>
      <p><b>Phone:</b> ${escapeHtml(data.phone)}</p>
      <p><b>Message:</b><br>${escapeHtml(data.message).replace(/\n/g,"<br/>")}</p>
    </div>
  `;

  try {
    const info = await mailer.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
      replyTo: data.email,
      subject: `New contact message from ${data.name}`,
      html,
    });
    console.log("mailer.sendMail info:", info && info.messageId ? info.messageId : info);
    return info;
  } catch (err) {
    // Log the full error and rethrow so the controller can handle it non-fatally
    console.error("mailer.sendMail error:", err && (err.stack || err));
    throw err;
  }
}
mailer.verify()
  .then(() => console.log("Mailer verify: SMTP server OK"))
  .catch(err => console.error("Mailer verify failed:", err && (err.stack || err)));

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

