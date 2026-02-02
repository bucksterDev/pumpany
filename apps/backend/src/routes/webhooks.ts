import { Router } from 'express';
import { handleClankerWebhook } from '../services/clanker.js';

const router = Router();

// Clanker webhook endpoint
router.post('/clanker', async (req, res) => {
  try {
    await handleClankerWebhook(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
