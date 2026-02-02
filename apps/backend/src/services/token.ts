import { ethers } from 'ethers';

const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

if (!DEPLOYER_PRIVATE_KEY) {
  console.warn('DEPLOYER_PRIVATE_KEY not set - token deployment will fail');
}

// CompanyToken ABI (simplified - just the constructor)
const COMPANY_TOKEN_ABI = [
  'constructor(string memory name, string memory symbol, address initialOwner, address _feeCollector)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
];

// CompanyToken bytecode - This would come from compiled Solidity
// For now, we'll use a placeholder that needs to be updated after compilation
const COMPANY_TOKEN_BYTECODE = process.env.COMPANY_TOKEN_BYTECODE || '';

export interface TokenDeploymentResult {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  transactionHash: string;
  blockNumber: number;
}

/**
 * Generate a token symbol from company prompt
 */
export function generateTokenSymbol(prompt: string, companyId: string): string {
  // Take first 3 letters of first significant word
  const words = prompt.split(' ').filter(w => w.length > 3);
  const prefix = words[0]?.substring(0, 3).toUpperCase() || 'CMP';

  // Add first 3 chars of company ID
  const suffix = companyId.substring(0, 3).toUpperCase();

  return `${prefix}${suffix}`;
}

/**
 * Generate a token name from company prompt
 */
export function generateTokenName(prompt: string): string {
  // Extract first sentence or first 50 chars
  const firstSentence = prompt.split('.')[0];
  const name = firstSentence.length > 50
    ? firstSentence.substring(0, 47) + '...'
    : firstSentence;

  return `${name} Token`;
}

/**
 * Deploy a new CompanyToken on Base
 */
export async function deployCompanyToken(
  companyId: string,
  prompt: string,
  ownerAddress?: string
): Promise<TokenDeploymentResult> {
  if (!DEPLOYER_PRIVATE_KEY) {
    throw new Error('DEPLOYER_PRIVATE_KEY not configured');
  }

  if (!COMPANY_TOKEN_BYTECODE) {
    console.warn('COMPANY_TOKEN_BYTECODE not set - using mock deployment');
    // Mock deployment for testing
    return {
      tokenAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
      tokenName: generateTokenName(prompt),
      tokenSymbol: generateTokenSymbol(prompt, companyId),
      transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      blockNumber: Math.floor(Math.random() * 1000000),
    };
  }

  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const wallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

    const tokenName = generateTokenName(prompt);
    const tokenSymbol = generateTokenSymbol(prompt, companyId);
    const owner = ownerAddress || wallet.address;

    console.log(`Deploying token: ${tokenName} (${tokenSymbol})`);

    // Create contract factory
    const factory = new ethers.ContractFactory(
      COMPANY_TOKEN_ABI,
      COMPANY_TOKEN_BYTECODE,
      wallet
    );

    // Deploy contract
    const contract = await factory.deploy(
      tokenName,
      tokenSymbol,
      owner,
      wallet.address // Fee collector (backend wallet)
    );

    await contract.waitForDeployment();
    const tokenAddress = await contract.getAddress();
    const deployTx = contract.deploymentTransaction();

    if (!deployTx) {
      throw new Error('Deployment transaction not found');
    }

    const receipt = await deployTx.wait();

    console.log(`Token deployed at: ${tokenAddress}`);

    return {
      tokenAddress,
      tokenName,
      tokenSymbol,
      transactionHash: deployTx.hash,
      blockNumber: receipt?.blockNumber || 0,
    };
  } catch (error: any) {
    console.error('Token deployment failed:', error.message);
    throw new Error(`Token deployment failed: ${error.message}`);
  }
}

/**
 * Get token balance for an address
 */
export async function getTokenBalance(
  tokenAddress: string,
  accountAddress: string
): Promise<string> {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const contract = new ethers.Contract(
      tokenAddress,
      ['function balanceOf(address) view returns (uint256)'],
      provider
    );

    const balance = await contract.balanceOf(accountAddress);
    return ethers.formatEther(balance);
  } catch (error: any) {
    console.error('Failed to get token balance:', error.message);
    throw new Error(`Failed to get token balance: ${error.message}`);
  }
}

/**
 * Get token info
 */
export async function getTokenInfo(tokenAddress: string): Promise<{
  name: string;
  symbol: string;
  totalSupply: string;
}> {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const contract = new ethers.Contract(
      tokenAddress,
      [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function totalSupply() view returns (uint256)',
      ],
      provider
    );

    const [name, symbol, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.totalSupply(),
    ]);

    return {
      name,
      symbol,
      totalSupply: ethers.formatEther(totalSupply),
    };
  } catch (error: any) {
    console.error('Failed to get token info:', error.message);
    throw new Error(`Failed to get token info: ${error.message}`);
  }
}
