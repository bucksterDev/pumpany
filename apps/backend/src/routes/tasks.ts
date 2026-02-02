import { Router } from 'express';
import { db } from '../db/index.js';
import { tasks } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all tasks for a company
router.get('/company/:companyId', async (req, res) => {
  try {
    const companyTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.companyId, req.params.companyId));

    res.json(companyTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, req.params.id));

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { companyId, agentId, description, priority } = req.body;

    const [task] = await db
      .insert(tasks)
      .values({
        companyId,
        agentId,
        description,
        priority: priority || 0,
      })
      .returning();

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, output } = req.body;

    if (!['pending', 'in_progress', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (output) {
      updateData.output = output;
    }

    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const [updated] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, req.params.id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

export default router;
