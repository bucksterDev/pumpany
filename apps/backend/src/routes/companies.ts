import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { companies } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { launchCompany, startAgentStatusPolling } from '../services/orchestrator.js';

const router = Router();

const createCompanySchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  computeLevel: z.enum(['low', 'medium', 'high']),
});

// Create a new company
router.post('/', async (req, res) => {
  try {
    const body = createCompanySchema.parse(req.body);

    const [company] = await db
      .insert(companies)
      .values({
        prompt: body.prompt,
        computeLevel: body.computeLevel,
      })
      .returning();

    // Return company immediately
    res.status(201).json(company);

    // Launch company asynchronously (deploy token, spawn agents, create tasks)
    launchCompany(company.id)
      .then(() => {
        console.log(`✅ Company ${company.id} launched successfully`);
        // Start agent status polling
        startAgentStatusPolling(company.id);
      })
      .catch((error) => {
        console.error(`❌ Failed to launch company ${company.id}:`, error);
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Get all companies
router.get('/', async (req, res) => {
  try {
    const allCompanies = await db.select().from(companies);
    res.json(allCompanies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, req.params.id));

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Update company token info
router.patch('/:id/token', async (req, res) => {
  try {
    const { tokenAddress, tokenName, tokenSymbol } = req.body;

    const [updated] = await db
      .update(companies)
      .set({
        tokenAddress,
        tokenName,
        tokenSymbol,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, req.params.id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating company token:', error);
    res.status(500).json({ error: 'Failed to update company token' });
  }
});

// Update company status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'paused', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [updated] = await db
      .update(companies)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(companies.id, req.params.id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating company status:', error);
    res.status(500).json({ error: 'Failed to update company status' });
  }
});

export default router;
