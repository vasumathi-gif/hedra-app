// services/emailService.js
import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;
const FROM = process.env.FROM_EMAIL || "onboarding@resend.dev";
const ADMIN = process.env.ADMIN_EMAIL || process.env.GMAIL_USER; // fallback to old env

const resend = new Resend(resendKey);

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

  if (!resendKey) {
    const err = new Error("RESEND_API_KEY missing");
    err.code = "NO_RESEND_KEY";
    throw err;
  }

  const result = await resend.emails.send({
    from: `Hedra <${FROM}>`,
    to: [ADMIN],
    replyTo: data.email,              // so you can reply to the sender
    subject: `New contact message from ${data.name}`,
    html,
  });

  // result has { id } on success
  return result;
}

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
