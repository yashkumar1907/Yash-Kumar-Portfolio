const { getPortfolioReply, getPortfolioFallbackReply } = require('../services/aiService');

const MAX_MESSAGE_LENGTH = 1000;

async function chat(req, res) {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (!message) {
    return res.status(400).json({ reply: 'Please enter a message.' });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      reply: `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  try {
    const reply = await getPortfolioReply(message);
    return res.status(200).json({ reply });
  } catch (error) {
    const fallbackReply = getPortfolioFallbackReply(message);
    if (fallbackReply) {
      console.warn('AI assistant used verified portfolio fallback:', {
        errorCode: error.code || 'UNKNOWN_ERROR',
        httpStatus: error.httpStatus,
        providerStatus: error.providerStatus,
        providerCode: error.providerCode,
      });
      return res.status(200).json({ reply: fallbackReply });
    }

    if (error.code === 'AI_NOT_CONFIGURED') {
      return res.status(503).json({ reply: 'AI assistant is temporarily unavailable.' });
    }

    console.error('AI assistant request failed:', {
      code: error.code || 'UNKNOWN_ERROR',
      httpStatus: error.httpStatus,
      providerStatus: error.providerStatus,
      providerCode: error.providerCode,
      finishReason: error.finishReason,
      blockReason: error.blockReason,
    });
    return res.status(502).json({ reply: 'AI assistant is temporarily unavailable.' });
  }
}

module.exports = { chat };
