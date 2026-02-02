import { Router } from 'express';
import { db } from '../db/index.js';
import { agents } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all agents for a company
router.get('/company/:companyId', async (req, res) => {
  try {
    const companyAgents = await db
      .select()
      .from(agents)
      .where(eq(agents.companyId, req.params.companyId));

    res.json(companyAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Get agent by ID
router.get('/:id', async (req, res) => {
  try {
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, req.params.id));

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

// Update agent status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'idle', 'busy', 'stopped'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [updated] = await db
      .update(agents)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(agents.id, req.params.id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating agent status:', error);
    res.status(500).json({ error: 'Failed to update agent status' });
  }
});

export default router;
