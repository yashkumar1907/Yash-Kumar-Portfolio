const mongoose = require('mongoose');
const ContactMessage = require('../models/ContactMessage');
const { allowContactSubmission } = require('../middleware/contactRateLimit');
const { validateContactPayload, sendContactNotification } = require('../services/contactService');

async function submitContact(req, res) {
  const { values, errors } = validateContactPayload(req.body);
  const fields = Object.keys(errors);

  if (fields.length) {
    return res.status(400).json({
      status: 'error',
      message: errors[fields[0]],
      fields,
      errors,
    });
  }

  const rateLimit = allowContactSubmission(req.ip);
  if (!rateLimit.allowed) {
    res.set('Retry-After', String(rateLimit.retryAfterSeconds));
    return res.status(429).json({
      status: 'error',
      message: 'Too many messages have been submitted. Please try again later.',
    });
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      status: 'error',
      message: 'The contact service is temporarily unavailable. Please try again later.',
    });
  }

  let savedContact;
  try {
    savedContact = await ContactMessage.create(values);
  } catch (error) {
    console.error('Contact message could not be saved:', {
      name: error.name || 'Error',
      code: error.code || 'UNKNOWN_ERROR',
    });
    return res.status(500).json({
      status: 'error',
      message: 'We could not save your message. Please try again later.',
    });
  }

  const notification = await sendContactNotification(savedContact);
  const responseMessage = notification.sent
    ? 'Your message was saved and an email notification was submitted.'
    : 'Your message was saved, but the email notification could not be sent.';

  return res.status(notification.sent ? 201 : 202).json({
    status: 'ok',
    message: responseMessage,
    saved: true,
    notificationSent: notification.sent,
    createdAt: savedContact.createdAt,
  });
}

module.exports = { submitContact };
