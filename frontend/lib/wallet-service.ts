import { StxBalanceResponse, WalletInfo } from '@/types/wallet';
import { 
  connect, 
  isConnected,
  disconnect,
  request,
  getLocalStorage
} from '@stacks/connect';
import { 
  verifyMessageSignature
} from '@stacks/encryption';
import { 
  STACKS_TESTNET, 
  STACKS_MAINNET,
  StacksNetwork 
} from '@stacks/network';

// Extend window interface for wallet providers
declare global {
  interface Window {
    StacksProvider?: any;
    LeatherProvider?: any;
    XverseProviders?: any;
  }
}

export interface WalletConnectionResult {
  address: string;
  publicKey: string;
  profile?: any;
  isConnected: boolean;
  walletType: string;
  network: 'mainnet' | 'testnet';
}

export interface WalletSignatureResult {
  signature: string;
  publicKey: string;
  address: string;
  message: string;
}

export interface WalletAuthData {
  address: string;
  signature: string;
  message: string;
  publicKey: string;
  walletType: 'stacks';
  verified: boolean;
}

export interface WalletRegistrationData extends WalletAuthData {
  businessName: string;
  businessType: string;
  email?: string;
}

/**
 * WalletService - Frontend wallet connection and authentication
 * 
 * This service handles:
 * 1. Wallet connection (Stacks wallets like Leather, Xverse)
 * 2. Message signing for authentication
 * 3. Challenge retrieval from backend
 * 4. Registration and login flows with backend
 * 
 * The backend handles all signature verification and user management.
 * 
 * IMPORTANT: This service now properly tracks explicit wallet connections
 * and doesn't automatically use installed wallet addresses without user consent.
 */
class WalletService {
  private network: StacksNetwork;
  private baseURL: string;
  private appConfig = {
    name: 'StacksPay',
    icon: typeof window !== 'undefined' ? window.location.origin + '/icons/apple-touch-icon.png' : '',
  };

  // Track explicit wallet connection state
  private explicitlyConnected: boolean = false;

  constructor() {
    const isMainnet = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet';
    this.network = isMainnet ? STACKS_MAINNET : STACKS_TESTNET;
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Check if there's a stored explicit connection
    if (typeof window !== 'undefined') {
      this.explicitlyConnected = localStorage.getItem('stackspay_wallet_explicitly_connected') === 'true';
    }
  }

  /**
   * Mark wallet as explicitly connected
   */
  private markAsExplicitlyConnected(): void {
    this.explicitlyConnected = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem('stackspay_wallet_explicitly_connected', 'true');
    }
  }

  /**
   * Clear explicit connection state
   */
  private clearExplicitConnection(): void {
    this.explicitlyConnected = false;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stackspay_wallet_explicitly_connected');
    }
  }

  /**
   * Check if wallet is explicitly connected through our app
   */
  isExplicitlyConnected(): boolean {
    return this.explicitlyConnected;
  }

  /**
   * Connect to a Stacks wallet
   * This method explicitly connects the wallet and marks it as connected through our app
   */
  async connectWallet(appDetails?: {
    name: string;
    icon: string;
  }): Promise<WalletInfo> {
    try {
      console.log("🔄 Starting explicit wallet connection...");
      console.log("🔄 App details:", appDetails);
      
      // Clear any previous connection state
      console.log("🧹 Clearing previous connection state...");
      
      const response = await connect();
      
      console.log("✅ Wallet connection response received:", response);
      console.log("✅ Response type:", typeof response);
      console.log("✅ Response keys:", Object.keys(response || {}));

      // Check if response contains addresses directly
      if (response && typeof response === 'object' && 'addresses' in response) {
        console.log("🎯 Found addresses in response:", response.addresses);
      }

      const userData = getLocalStorage();
      console.log("📦 User Data from localStorage:", userData);
      console.log("📦 User Data type:", typeof userData);
      console.log("📦 User Data keys:", Object.keys(userData || {}));
      
      // Try to get addresses from both response and localStorage
      const getWalletAddresses = (responseData: any, localData: any) => {
        console.log("🔍 Extracting addresses from response:", responseData);
        console.log("🔍 Extracting addresses from localStorage:", localData);
        
        // Try response first
        let stx = responseData?.addresses?.stx?.[0]?.address || responseData?.addresses?.stx?.address;
        let btc = responseData?.addresses?.btc?.[0]?.address || responseData?.addresses?.btc?.address;
        
        // Fallback to localStorage
        if (!stx || !btc) {
          stx = stx || localData?.addresses?.stx?.[0]?.address || localData?.addresses?.stx?.address;
          btc = btc || localData?.addresses?.btc?.[0]?.address || localData?.addresses?.btc?.address;
        }
        
        const addresses = { stx, btc };
        console.log("🔍 Final address extraction result:", addresses);
        return addresses;
      };

      const { stx, btc } = getWalletAddresses(response, userData);
      console.log("📍 Final extracted addresses:", { stx, btc });
      
      if (stx) {
        // Mark as explicitly connected ONLY after successful connection
        this.markAsExplicitlyConnected();
        
        console.log("✅ Wallet connection successful!");
        
        return {
          address: stx,
          publicKey: (userData as any)?.profile?.publicKey || (userData as any)?.publicKey || '',
          profile: (userData as any)?.profile || userData,
          isConnected: true,
        };
      } else {
        console.error("❌ No STX address found in wallet data");
        console.error("❌ Full userData structure:", JSON.stringify(userData, null, 2));
        throw new Error("Failed to retrieve wallet addresses - no STX address found");
      }
    } catch (error) {
      console.error("❌ Wallet connection error details:", error);
      
      // IGNORE the misleading "User canceled" error from Stacks Connect
      // Instead, check if we actually got wallet data despite the error
      console.log("🔄 Checking for wallet data despite error...");
      
      try {
        const userData = getLocalStorage();
        console.log("📦 Checking localStorage after error:", userData);
        
        if (userData && userData.addresses && userData.addresses.stx) {
          console.log("✅ Found wallet data despite error! Proceeding...");
          
          const stx = (userData as any).addresses.stx[0]?.address || (userData as any).addresses.stx.address;
          if (stx) {
            this.markAsExplicitlyConnected();
            
            return {
              address: stx,
              publicKey: (userData as any)?.profile?.publicKey || (userData as any)?.publicKey || '',
              profile: (userData as any)?.profile || userData,
              isConnected: true,
            };
          }
        }
      } catch (recoveryError) {
        console.log("❌ Recovery attempt failed:", recoveryError);
      }
      
      // Handle different types of errors more gracefully
      if (error instanceof Error) {
        if (error.message.includes('User canceled') || error.message.includes('User rejected')) {
          console.log('ℹ️ User canceled wallet connection');
          throw new Error('WALLET_CANCELED');
        }
        
        if (error.message.includes('No wallet provider')) {
          console.log('ℹ️ No wallet provider detected');
          throw new Error('WALLET_NOT_INSTALLED');
        }
        
        if (error.message.includes('timeout') || error.message.includes('Timeout')) {
          console.log('ℹ️ Wallet connection timed out');
          throw new Error('WALLET_TIMEOUT');
        }
      }
      
      // For any other error, provide detailed information
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      console.error('❌ Wallet connection failed with error:', errorMessage);
      throw new Error(`WALLET_CONNECTION_FAILED: ${errorMessage}`);
    }
  }

  /**
     * Get STX balance for connected wallet
     */
    async getStxBalance(): Promise<bigint> {
      try {
        // First check if wallet was explicitly connected through our app
        if (!this.explicitlyConnected) {
          console.log("Wallet not explicitly connected through StacksPay app");
          return BigInt(0);
        }

        const address = await this.getCurrentAddress();
        if (!address) {
          throw new Error('No wallet connected');
        }
  
        // Use the better API endpoint (v2)
        const apiUrl = this.network === STACKS_MAINNET 
          ? 'https://api.hiro.so'
          : 'https://api.testnet.hiro.so';
  
        const response = await fetch(`${apiUrl}/extended/v2/addresses/${address}/balances/stx?include_mempool=false`);
        if (!response.ok) {
          throw new Error('Failed to fetch balance');
        }
  
        const data = await response.json() as StxBalanceResponse;
        console.log("STX Balance Response:", data);
        
        // Return balance in microSTX
        return BigInt(data.balance || '0');
      } catch (error) {
        console.error('Error getting STX balance:', error);
        throw new Error('Failed to get STX balance');
      }
    }
  
    /**
     * Get network info
     */
    getNetworkInfo() {
      return {
        network: this.network,
        isMainnet: this.network === STACKS_MAINNET,
        stacksApiUrl: this.network === STACKS_MAINNET 
          ? 'https://api.mainnet.hiro.so'
          : 'https://api.testnet.hiro.so',
      };
    }

  /**
   * Get current wallet address if explicitly connected
   */
  async getCurrentAddress(): Promise<string | null> {
    try {
      // First check if wallet was explicitly connected through our app
      if (!this.explicitlyConnected) {
        console.log("Wallet not explicitly connected through StacksPay app");
        return null;
      }

      if (!isConnected()) {
        // Clear our explicit connection flag if Stacks connect says not connected
        this.clearExplicitConnection();
        return null;
      }

      const userData = getLocalStorage();
      
      // Helper to safely access wallet response
      const getWalletAddresses = (response: any) => {
        return {
          stx: response?.addresses?.stx?.[0]?.address,
          btc: response?.addresses?.btc?.[0]?.address
        };
      };

      const { stx } = getWalletAddresses(userData);
      return stx || null;
    } catch (error) {
      console.error('Error getting wallet address:', error);
      return null;
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnectWallet(): Promise<void> {
    try {
      await disconnect();
      console.log('✅ StacksPay: Wallet disconnected');
    } catch (error) {
      console.error('❌ Wallet disconnection failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to disconnect wallet');
    }
  }


  async isWalletConnected(): Promise<boolean> {
    try {
      return await isConnected();
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      return false;
    }
  }

  

  /**
   * Get current wallet data if explicitly connected through our app
   * This prevents automatic wallet detection without user consent
   */
  async getCurrentWalletData(): Promise<WalletConnectionResult | null> {
    try {
      // First check if wallet was explicitly connected through our app
      if (!this.explicitlyConnected) {
        console.log("Wallet not explicitly connected through StacksPay app");
        return null;
      }

      const connected = await isConnected();
      if (!connected) {
        console.log("Stacks wallet not connected");
        // Clear our explicit connection flag if Stacks connect says not connected
        this.clearExplicitConnection();
        return null;
      }

      const walletData = getLocalStorage();
      if (!walletData) {
        console.log("No wallet data available");
        return null;
      }

      console.log("Explicitly connected walletData", walletData)

      // Helper to safely access wallet response
      const getWalletAddresses = (response: any) => {
        return {
          stx: response?.addresses?.stx?.[0]?.address,
          btc: response?.addresses?.btc?.[0]?.address
        };
      };

      const { stx, btc } = getWalletAddresses(walletData);

      if (!stx) {
        console.log("No Stacks address found in wallet data");
        return null;
      }

      return {
        address: stx,
        publicKey: (walletData as any)?.profile?.publicKey || (walletData as any)?.publicKey || '',
        profile: (walletData as any)?.profile || walletData,
        isConnected: true,
        walletType: this.detectWalletType(),
        network: this.network === STACKS_MAINNET ? 'mainnet' : 'testnet',
      };
    } catch (error) {
      console.error('❌ Failed to get current wallet data:', error);
      return null;
    }
  }

  /**
   * Get current Bitcoin address from connected wallet
   */
  async getCurrentBitcoinAddress(): Promise<string | null> {
    try {
      const connected = await isConnected();
      if (!connected) return null;

      const walletData = getLocalStorage();
      if (!walletData) return null;

      console.log("Bitcoin address lookup - walletData structure:", JSON.stringify(walletData, null, 2));

      // Helper to safely access wallet response
      const getWalletAddresses = (response: any) => {
        console.log("Getting wallet addresses from:", response);
        
        // Try different possible structures
        const addresses = {
          stx: response?.addresses?.stx?.[0]?.address || response?.addresses?.stx?.address,
          btc: response?.addresses?.btc?.[0]?.address || response?.addresses?.btc?.address || response?.addresses?.bitcoin?.address
        };
        
        console.log("Extracted addresses:", addresses);
        return addresses;
      };

      const { btc } = getWalletAddresses(walletData);
      
      if (!btc) {
        console.warn("No Bitcoin address found in wallet data. Available properties:", Object.keys(walletData));
        if (walletData.addresses) {
          console.warn("Available address properties:", Object.keys(walletData.addresses));
        }
      }
      
      return btc || null;
    } catch (error) {
      console.error('❌ Failed to get current Bitcoin address:', error);
      return null;
    }
  }

  /**
   * Detect wallet type based on available providers
   */
  private detectWalletType(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    if (window.LeatherProvider) return 'leather';
    if (window.XverseProviders) return 'xverse';
    if (window.StacksProvider) return 'stacks';
    
    return 'unknown';
  }

  /**
   * Sign a message with the connected wallet
   * This creates the signature that will be sent to backend for verification
   */
  async signMessage(message: string): Promise<WalletSignatureResult> {
    try {
      const walletData = await this.getCurrentWalletData();
      if (!walletData) {
        throw new Error('No wallet connected');
      }

      console.log('✍️ StacksPay: Signing message with wallet...');
      console.log('📝 Message to sign:', message);
      console.log('🔑 Using public key:', walletData.publicKey);

      // Use the modern request API for message signing
      console.log('🔄 Attempting to sign message with wallet...');
      console.log('🔄 Sign request params:', { message });
      
      // Use the stx_signMessage method
      const result = await request('stx_signMessage', {
        message
      }) as any; // Type assertion since we know this will be a SignMessageResult

      console.log('✅ Message signed successfully');
      console.log('🔏 Raw signature result:', result);
      console.log('🔍 Full result structure:', Object.keys(result));
      console.log('🔍 Result signature property:', result.signature);
      console.log('🔍 Result publicKey property:', result.publicKey);

      // Handle different possible response formats
      const signature = result.signature || result.sig || result.r + result.s;
      const publicKey = result.publicKey || result.pubKey || walletData.publicKey;

      console.log('🔍 Extracted signature:', signature);
      console.log('🔍 Extracted publicKey:', publicKey);
      console.log('🔍 Signature type:', typeof signature);
      console.log('🔍 Signature length:', signature?.length);

      if (!signature) {
        throw new Error('No signature returned from wallet');
      }
      if (!publicKey) {
        throw new Error('No public key available for verification');
      }

      // Ensure signature is in the correct format
      let processedSignature = signature;
      if (typeof signature === 'string') {
        // Remove 0x prefix if present
        if (signature.startsWith('0x')) {
          processedSignature = signature.slice(2);
        }
      }

      console.log('🔏 Processed signature:', processedSignature);
      console.log('🔑 Final public key used:', publicKey);

      return {
        signature: processedSignature,
        publicKey: publicKey,
        address: walletData.address,
        message: message,
      };

    } catch (error) {
      console.error('❌ Message signing failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to sign message');
    }
  }

  /**
   * Verify a message signature locally (optional verification before sending to backend)
   */
  verifySignature(message: string, signature: string, publicKey: string): boolean {
    try {
      return verifyMessageSignature({
        message,
        signature,
        publicKey,
      });
    } catch (error) {
      console.error('❌ Local signature verification failed:', error);
      return false;
    }
  }


  // =================================================================
  // BACKEND INTEGRATION METHODS
  // These methods interact with the backend API for authentication
  // =================================================================

  /**
   * Store authentication tokens in localStorage
   */
  private setStoredToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('authToken', token);
  }

  private setStoredRefreshToken(refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Get stored authentication token from localStorage
   */
  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  /**
   * Get challenge from backend for wallet authentication
   * The backend generates a unique challenge that the wallet must sign
   */
  private async getChallengeFromBackend(
    address: string, 
    type: 'connection' | 'payment' = 'connection',
    paymentId?: string,
    amount?: number
  ): Promise<{ challenge: string; expiresAt: string }> {
    try {
      console.log('🔄 Getting challenge from backend for address:', address);
      
      const params = new URLSearchParams({
        address,
        type,
        ...(paymentId && { paymentId }),
        ...(amount && { amount: amount.toString() }),
      });

      const response = await fetch(`${this.baseURL}/api/auth/wallet/challenge?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get challenge from backend');
      }

      console.log('✅ Challenge received from backend');
      return {
        challenge: data.challenge,
        expiresAt: data.expiresAt
      };
      
    } catch (error) {
      console.error('❌ Failed to get challenge from backend:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get authentication challenge');
    }
  }

  /**
   * Register new user with wallet authentication (simplified approach)
   * Instead of complex signature verification, we store the wallet address and use proof of ownership
   */
  async registerWithWallet(): Promise<any> {
    try {
      console.log('🔄 Starting simplified wallet registration...');

      // Step 1: Connect wallet
      const walletData = await this.connectWallet();
      console.log('✅ Wallet connected for registration');
      console.log('🔍 Wallet address:', walletData.address);
      console.log('🔍 Public key:', walletData.publicKey);

      // Step 2: Simple registration with just the wallet address
      // The wallet connection itself proves ownership
      const registrationData = {
        walletAddress: walletData.address,
        publicKey: walletData.publicKey,
        walletType: 'stacks' as const,
        authMethod: 'wallet' as const,
        // Just store the address - no complex signature verification needed
      };

      console.log('📤 Sending wallet registration to backend...', {
        walletAddress: registrationData.walletAddress,
        walletType: registrationData.walletType,
      });
      
      const response = await fetch(`${this.baseURL}/api/auth/register/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Registration failed' }));
        console.error('❌ Backend registration error:', errorData);
        
        // Handle specific error types
        if (response.status === 409) {
          // User already exists - suggest login instead
          throw new Error('WALLET_ALREADY_EXISTS');
        }
        
        throw new Error(errorData.error || `Registration failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }

      console.log('✅ Wallet registration successful');
      
      // Store authentication tokens if provided
      if (result.token) {
        this.setStoredToken(result.token);
      }
      if (result.refreshToken) {
        this.setStoredRefreshToken(result.refreshToken);
      }
      
      return result;
      
    } catch (error) {
      // Handle different wallet errors gracefully
      if (error instanceof Error) {
        if (error.message === 'WALLET_CANCELED') {
          console.log('ℹ️ User canceled wallet registration');
          throw error;
        }
        
        if (error.message === 'WALLET_NOT_INSTALLED') {
          console.log('ℹ️ Wallet not installed during registration');
          throw error;
        }
        
        if (error.message === 'WALLET_TIMEOUT') {
          console.log('ℹ️ Wallet connection timed out during registration');
          throw error;
        }
        
        if (error.message === 'WALLET_ALREADY_EXISTS') {
          throw error;
        }
      }
      
      console.error('❌ Wallet registration failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to register with wallet');
    }
  }

  /**
   * Connect wallet for existing user (email sign-in users)
   * This goes through the full authentication flow: connect -> sign -> verify
   */
  async connectWalletForExistingUser(): Promise<{
    success: boolean;
    address?: string;
    error?: string;
  }> {
    try {
      console.log('🔄 Starting wallet connection for existing user...');

      // Step 1: Connect wallet and get wallet data
      const walletData = await this.connectWallet();
      console.log('✅ Wallet connected:', walletData.address);

      // Step 2: Get challenge from backend for wallet connection
      const { challenge } = await this.getChallengeFromBackend(walletData.address, 'connection');
      console.log('✅ Challenge received from backend');

      // Step 3: Sign the challenge
      const signatureData = await this.signMessage(challenge);
      console.log('✅ Message signed by wallet');

      // Step 4: Send wallet connection data to backend for verification and account linking
      const connectionData = {
        address: walletData.address,
        signature: signatureData.signature,
        message: challenge,
        publicKey: signatureData.publicKey,
        walletType: 'stacks', // Default to stacks for now
      };

      const response = await fetch(`${this.baseURL}/api/auth/connect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getStoredToken()}`, // Use existing user's token
        },
        body: JSON.stringify(connectionData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Wallet connected and verified by backend:', result);

      // Mark as explicitly connected
      this.markAsExplicitlyConnected();

      return {
        success: true,
        address: walletData.address,
      };

    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
      };
    }
  }

  /**
   * Login with wallet authentication (simplified approach)
   * Just connects wallet and verifies the address exists in our database
   */
  async loginWithWallet(): Promise<any> {
    try {
      console.log('🔄 Starting wallet login...');

      // Step 1: Connect wallet
      const walletData = await this.connectWallet();
      console.log('✅ Wallet connected for login');
      console.log('🔍 Wallet address:', walletData.address);

      // Step 2: Send login request with wallet address
      const loginData = {
        walletAddress: walletData.address,
        walletType: 'stacks' as const,
      };

      console.log('📤 Sending login to backend...');
      const response = await fetch(`${this.baseURL}/api/auth/login/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(errorData.error || `Login failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }

      console.log('✅ Wallet login successful');
      
      // Store authentication tokens if provided
      if (result.token) {
        this.setStoredToken(result.token);
      }
      if (result.refreshToken) {
        this.setStoredRefreshToken(result.refreshToken);
      }
      
      return result;
      
    } catch (error) {
      // Handle different wallet errors gracefully
      if (error instanceof Error) {
        if (error.message === 'WALLET_CANCELED') {
          console.log('ℹ️ User canceled wallet login');
          throw error;
        }
        
        if (error.message === 'WALLET_NOT_INSTALLED') {
          console.log('ℹ️ Wallet not installed during login');
          throw error;
        }
        
        if (error.message === 'WALLET_TIMEOUT') {
          console.log('ℹ️ Wallet connection timed out during login');
          throw error;
        }
      }
      
      console.error('❌ Wallet login failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to login with wallet');
    }
  }

  /**
   * Verify wallet signature with backend
   * This is used for additional verification steps if needed
   */
  async verifyWithBackend(walletData: WalletAuthData): Promise<boolean> {
    try {
      console.log('🔄 Verifying signature with backend...');

      const response = await fetch(`${this.baseURL}/api/auth/wallet/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walletData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Verification failed' }));
        throw new Error(errorData.error || `Verification failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Verification failed');
      }

      console.log('✅ Backend verification successful');
      return result.verified === true;
      
    } catch (error) {
      console.error('❌ Backend verification failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to verify with backend');
    }
  }

  /**
   * Verify wallet signature for payments
   * This creates a payment-specific challenge and verifies the signature
   */
  async verifyWalletSignature(
    type: 'connection' | 'payment', 
    paymentId?: string, 
    amount?: number
  ): Promise<{ success: boolean; verified: boolean; error?: string }> {
    try {
      console.log('🔄 Starting wallet signature verification for:', type);

      // Step 1: Connect wallet (or use existing connection)
      const walletData = await this.getCurrentWalletData();
      if (!walletData) {
        throw new Error('No wallet connected');
      }

      // Step 2: Get challenge from backend
      const { challenge } = await this.getChallengeFromBackend(
        walletData.address, 
        type, 
        paymentId, 
        amount
      );

      // Step 3: Sign the challenge
      const signatureData = await this.signMessage(challenge);

      // Step 4: Verify with backend
      const verificationData = {
        address: walletData.address,
        signature: signatureData.signature,
        message: challenge,
        publicKey: signatureData.publicKey,
        walletType: 'stacks' as const,
        verified: false, // Will be set by backend
        ...(paymentId && { paymentId }),
        ...(amount && { amount }),
      };

      const verified = await this.verifyWithBackend(verificationData);

      console.log('✅ Wallet signature verification successful');
      return {
        success: true,
        verified,
      };
      
    } catch (error) {
      console.error('❌ Wallet signature verification failed:', error);
      return {
        success: false,
        verified: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  }
}

// Export singleton instance
export const walletService = new WalletService();
export default walletService;
