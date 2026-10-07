const express = require('express');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Portfolio backend is running',
  });
});

module.exports = router;
