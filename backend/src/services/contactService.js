const { Resend } = require('resend');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTHS = { name: 120, email: 254, message: 5000 };
const REQUIRED_MESSAGES = {
  name: 'Please provide a name.',
  email: 'Please provide an email address.',
  message: 'Please provide a message.',
};

function validateContactPayload(payload) {
  const values = {
    name: typeof payload?.name === 'string' ? payload.name.trim() : '',
    email: typeof payload?.email === 'string' ? payload.email.trim().toLowerCase() : '',
    message: typeof payload?.message === 'string' ? payload.message.trim() : '',
  };
  const errors = {};

  for (const field of Object.keys(values)) {
    if (!values[field]) errors[field] = REQUIRED_MESSAGES[field];
    else if (values[field].length > MAX_LENGTHS[field]) {
      errors[field] = `The ${field} must be ${MAX_LENGTHS[field]} characters or fewer.`;
    }
  }

  if (values.email && values.email.length <= MAX_LENGTHS.email && !EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  return { values, errors };
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function getResendSettings() {
  const {
    RESEND_API_KEY,
    RESEND_FROM_EMAIL,
    CONTACT_RECEIVER_EMAIL,
  } = process.env;

  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !CONTACT_RECEIVER_EMAIL) {
    return null;
  }

  return {
    apiKey: RESEND_API_KEY,
    from: RESEND_FROM_EMAIL,
    receiver: CONTACT_RECEIVER_EMAIL,
  };
}

async function sendContactNotification(contact) {
  const settings = getResendSettings();

  if (!settings) {
    return { sent: false, reason: 'not_configured' };
  }

  try {
    const resend = new Resend(settings.apiKey);

    // Human-readable timestamp
    const submittedAt = new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    }).format(contact.createdAt);

    // Escape user-provided values before inserting them into HTML
    const safeName = escapeHtml(contact.name);
    const safeEmail = escapeHtml(contact.email);
    const safeMessage = escapeHtml(contact.message).replace(/\r?\n/g, '<br>');

    // Prevent newline characters from entering the email subject
    const subjectName = contact.name
      .replace(/[\r\n]/g, ' ')
      .trim();

    const replyUrl = `mailto:${encodeURIComponent(contact.email)}`;

    await resend.emails.send({
      from: settings.from,
      to: settings.receiver,
      replyTo: contact.email,

      subject: `New Portfolio Contact — ${subjectName}`,

      // Plain-text fallback
      text: [
        'NEW PORTFOLIO CONTACT',
        '',
        'Someone has reached out through your portfolio website.',
        '',
        'VISITOR DETAILS',
        `Name: ${contact.name}`,
        `Email: ${contact.email}`,
        '',
        'MESSAGE',
        contact.message,
        '',
        `Received: ${submittedAt}`,
        '',
        `Reply to this person: ${contact.email}`,
      ].join('\n'),

      // Professional HTML email
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Portfolio Contact</title>
          </head>

          <body style="
            margin: 0;
            padding: 0;
            background: #f4f6f8;
            font-family: Arial, Helvetica, sans-serif;
            color: #172033;
          ">

            <div style="
              max-width: 620px;
              margin: 40px auto;
              padding: 0 20px;
            ">

              <!-- Header -->
              <div style="
                background: #111827;
                padding: 28px 30px;
                border-radius: 14px 14px 0 0;
                color: #ffffff;
              ">
                <div style="
                  font-size: 12px;
                  letter-spacing: 1.5px;
                  text-transform: uppercase;
                  color: #9ca3af;
                  margin-bottom: 10px;
                ">
                  YASH KUMAR · PORTFOLIO
                </div>

                <h1 style="
                  margin: 0;
                  font-size: 25px;
                  line-height: 1.3;
                  font-weight: 600;
                ">
                  New Portfolio Contact
                </h1>
              </div>

              <!-- Main content -->
              <div style="
                background: #ffffff;
                padding: 30px;
                border-radius: 0 0 14px 14px;
                border: 1px solid #e5e7eb;
                border-top: none;
              ">

                <p style="
                  margin: 0 0 24px;
                  font-size: 16px;
                  line-height: 1.6;
                ">
                  Hi Yash,
                </p>

                <p style="
                  margin: 0 0 28px;
                  font-size: 15px;
                  line-height: 1.6;
                  color: #4b5563;
                ">
                  Someone has reached out through your portfolio website.
                </p>

                <!-- Visitor details -->
                <div style="
                  background: #f8fafc;
                  border: 1px solid #e5e7eb;
                  border-radius: 10px;
                  padding: 20px;
                  margin-bottom: 24px;
                ">

                  <h2 style="
                    margin: 0 0 16px;
                    font-size: 16px;
                    color: #111827;
                  ">
                    Visitor Details
                  </h2>

                  <p style="
                    margin: 8px 0;
                    font-size: 14px;
                    line-height: 1.5;
                  ">
                    <strong>Name:</strong> ${safeName}
                  </p>

                  <p style="
                    margin: 8px 0;
                    font-size: 14px;
                    line-height: 1.5;
                  ">
                    <strong>Email:</strong>
                    <a
                      href="${replyUrl}"
                      style="color: #2563eb; text-decoration: none;"
                    >
                      ${safeEmail}
                    </a>
                  </p>

                </div>

                <!-- Message -->
                <h2 style="
                  margin: 0 0 12px;
                  font-size: 16px;
                  color: #111827;
                ">
                  Message
                </h2>

                <div style="
                  background: #f8fafc;
                  border-left: 4px solid #2563eb;
                  border-radius: 6px;
                  padding: 18px;
                  margin-bottom: 24px;
                  font-size: 15px;
                  line-height: 1.7;
                  color: #374151;
                  word-break: break-word;
                ">
                  ${safeMessage}
                </div>

                <!-- Received time -->
                <p style="
                  margin: 0 0 25px;
                  font-size: 13px;
                  color: #6b7280;
                ">
                  Received: ${submittedAt} IST
                </p>

                <!-- Reply button -->
                <div style="margin-bottom: 28px;">
                  <a
                    href="${replyUrl}"
                    style="
                      display: inline-block;
                      padding: 12px 20px;
                      background: #2563eb;
                      color: #ffffff;
                      text-decoration: none;
                      border-radius: 8px;
                      font-size: 14px;
                      font-weight: 600;
                    "
                  >
                    Reply to ${safeName}
                  </a>
                </div>

                <div style="
                  border-top: 1px solid #e5e7eb;
                  padding-top: 18px;
                  font-size: 12px;
                  color: #9ca3af;
                ">
                  This notification was sent automatically from your portfolio contact form.
                </div>

              </div>

            </div>

          </body>
        </html>
      `,
    });

    return { sent: true };
  } catch (error) {
    // Log only non-sensitive metadata
    console.error('Contact email notification failed:', {
      name: error.name || 'Error',
      code: error.code || 'UNKNOWN_ERROR',
    });

    return { sent: false, reason: 'failed' };
  }
}

module.exports = { validateContactPayload, sendContactNotification, MAX_LENGTHS };
