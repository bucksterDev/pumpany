import axios from 'axios';
import { ethers } from 'ethers';
import { db } from '../db/index.js';
import { companies, transactions } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { broadcast } from '../index.js';

const CLANKER_API_KEY = process.env.CLANKER_API_KEY;
const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

if (!CLANKER_API_KEY) {
  console.warn('CLANKER_API_KEY not set - token monitoring will be limited');
}

const clankerClient = axios.create({
  baseURL: 'https://api.clanker.world',
  headers: {
    'Authorization': `Bearer ${CLANKER_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface TokenStats {
  tokenAddress: string;
  volume24h: string;
  transactions24h: number;
  holders: number;
  price: string;
  marketCap: string;
}

/**
 * Register a token with Clanker for monitoring
 */
export async function registerTokenWithClanker(
  tokenAddress: string,
  webhookUrl?: string
): Promise<void> {
  try {
    await clankerClient.post('/tokens/register', {
      tokenAddress,
      chain: 'base',
      webhookUrl: webhookUrl || process.env.CLANKER_WEBHOOK_URL,
      events: ['transfer', 'swap', 'liquidity'],
    });

    console.log(`✅ Registered token ${tokenAddress} with Clanker`);
  } catch (error: any) {
    console.error('Failed to register token with Clanker:', error.message);
    // Non-critical - continue without Clanker
  }
}

/**
 * Get token statistics from Clanker
 */
export async function getTokenStats(tokenAddress: string): Promise<TokenStats | null> {
  try {
    const response = await clankerClient.get(`/tokens/${tokenAddress}/stats`);

    return {
      tokenAddress,
      volume24h: response.data.volume24h || '0',
      transactions24h: response.data.transactions24h || 0,
      holders: response.data.holders || 0,
      price: response.data.price || '0',
      marketCap: response.data.marketCap || '0',
    };
  } catch (error: any) {
    console.error('Failed to get token stats:', error.message);
    return null;
  }
}

/**
 * Listen for token events directly from Base chain
 */
export async function startTokenEventListener(
  companyId: string,
  tokenAddress: string
) {
  console.log(`👂 Starting token event listener for ${tokenAddress}`);

  const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);

  // ERC20 Transfer event signature
  const transferEventSignature = 'Transfer(address,address,uint256)';
  const transferTopic = ethers.id(transferEventSignature);

  // Create filter for transfer events
  const filter = {
    address: tokenAddress,
    topics: [transferTopic],
  };

  // Listen for events
  provider.on(filter, async (log) => {
    try {
      const parsedLog = parseTransferEvent(log);

      if (!parsedLog) return;

      // Calculate 1% fee
      const amount = ethers.formatEther(parsedLog.value);
      const fee = (parseFloat(amount) * 0.01).toString();

      // Save transaction to database
      await db.insert(transactions).values({
        companyId,
        tokenAddress,
        txHash: log.transactionHash,
        volume: amount,
        feeCaptured: fee,
      });

      // Update company compute balance
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, companyId));

      if (company) {
        const newBalance = (parseFloat(company.computeBalance) + parseFloat(fee)).toString();

        await db
          .update(companies)
          .set({
            computeBalance: newBalance,
            updatedAt: new Date(),
          })
          .where(eq(companies.id, companyId));

        // Broadcast balance update
        broadcast({
          type: 'compute_balance_updated',
          companyId,
          newBalance,
          feeCaptured: fee,
          txHash: log.transactionHash,
          timestamp: new Date().toISOString(),
        });

        console.log(`💰 Captured fee: ${fee} | New balance: ${newBalance}`);
      }
    } catch (error) {
      console.error('Error processing transfer event:', error);
    }
  });

  console.log(`✅ Token event listener started for ${tokenAddress}`);
}

/**
 * Parse transfer event log
 */
function parseTransferEvent(log: any): {
  from: string;
  to: string;
  value: bigint;
} | null {
  try {
    const iface = new ethers.Interface([
      'event Transfer(address indexed from, address indexed to, uint256 value)',
    ]);

    const parsed = iface.parseLog({
      topics: log.topics,
      data: log.data,
    });

    if (!parsed) return null;

    return {
      from: parsed.args.from,
      to: parsed.args.to,
      value: parsed.args.value,
    };
  } catch (error) {
    console.error('Failed to parse transfer event:', error);
    return null;
  }
}

/**
 * Get historical transactions for a token
 */
export async function getTokenTransactions(
  tokenAddress: string,
  limit: number = 100
): Promise<any[]> {
  try {
    const response = await clankerClient.get(`/tokens/${tokenAddress}/transactions`, {
      params: { limit },
    });

    return response.data.transactions || [];
  } catch (error: any) {
    console.error('Failed to get token transactions:', error.message);
    return [];
  }
}

/**
 * Start monitoring all company tokens
 */
export async function startAllTokenMonitoring() {
  console.log('🔍 Starting token monitoring for all companies...');

  try {
    const allCompanies = await db
      .select()
      .from(companies)
      .where(eq(companies.status, 'active'));

    for (const company of allCompanies) {
      if (company.tokenAddress) {
        // Register with Clanker
        await registerTokenWithClanker(company.tokenAddress);

        // Start event listener
        startTokenEventListener(company.id, company.tokenAddress);
      }
    }

    console.log(`✅ Monitoring ${allCompanies.length} company tokens`);
  } catch (error) {
    console.error('Failed to start token monitoring:', error);
  }
}

/**
 * Webhook handler for Clanker events
 */
export async function handleClankerWebhook(payload: any) {
  try {
    const { tokenAddress, eventType, data } = payload;

    console.log(`📥 Clanker webhook: ${eventType} for ${tokenAddress}`);

    // Find company by token address
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.tokenAddress, tokenAddress));

    if (!company) {
      console.warn(`No company found for token ${tokenAddress}`);
      return;
    }

    // Handle different event types
    switch (eventType) {
      case 'transfer':
        // Already handled by event listener
        break;

      case 'swap':
        broadcast({
          type: 'token_swap',
          companyId: company.id,
          tokenAddress,
          data,
          timestamp: new Date().toISOString(),
        });
        break;

      case 'liquidity':
        broadcast({
          type: 'liquidity_change',
          companyId: company.id,
          tokenAddress,
          data,
          timestamp: new Date().toISOString(),
        });
        break;

      default:
        console.log(`Unknown event type: ${eventType}`);
    }
  } catch (error) {
    console.error('Error handling Clanker webhook:', error);
  }
}
