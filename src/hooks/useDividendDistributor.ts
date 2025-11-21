import { useState, useEffect, useCallback, useMemo } from 'react';
import { Contract, ElectrumNetworkProvider } from 'cashscript';
import { getElectrumCluster } from '../../utils/network';
import { factoryToast } from '../utils/toast';
import artifact from '../../artifacts/DividendDistributor.json';

interface Wallet {
    address: string;
    privateKey: Uint8Array;
    wif: string;
    publicKeyHash: Uint8Array;
}

export const useDividendDistributor = (
    wallet: Wallet | null,
    sendTransaction: (to: string, amount: bigint) => Promise<string>
) => {
    const [contract, setContract] = useState<Contract | null>(null);
    const [isDeployed, setIsDeployed] = useState(false);

    const provider = useMemo(() => {
        try {
            const cluster = getElectrumCluster();
            return new ElectrumNetworkProvider('chipnet', cluster);
        } catch (error) {
            console.error('Failed to create ElectrumNetworkProvider:', error);
            return undefined;
        }
    }, []);

    useEffect(() => {
        console.log('useDividendDistributor effect triggered. Provider:', !!provider, 'Wallet:', !!wallet);
        if (provider && wallet) {
            const init = async () => {
                console.log('Initializing contract...');
                try {
                    // Instantiate the contract
                    const dividendPerToken = 1000n;

                    const newContract = new Contract(
                        artifact as any,
                        [dividendPerToken],
                        { provider }
                    );

                    console.log('Contract initialized. Address:', newContract.address);
                    setContract(newContract);

                    // Check if contract has balance (is deployed)
                    try {
                        const bal = await newContract.getBalance();
                        console.log('Contract balance:', bal);
                        setIsDeployed(bal > 0n);
                    } catch (err) {
                        console.error('Failed to fetch contract balance:', err);
                    }
                } catch (error) {
                    console.error('Error initializing contract:', error);
                }
            };
            init();
        } else {
            console.log('Provider or wallet missing. Contract not initialized.');
        }
    }, [provider, wallet]);

    const deployContract = async (amountSatoshis: bigint = 10000n) => {
        console.log('deployContract called. Contract:', !!contract, 'Wallet:', !!wallet);

        if (!contract || !wallet) {
            console.error('Contract or wallet not ready. Contract:', contract, 'Wallet:', wallet);
            throw new Error('Contract or wallet not ready. Please wait for connection.');
        }

        try {
            console.log(`Funding contract at ${contract.address} with ${amountSatoshis} satoshis...`);

            // Use the passed sendTransaction function
            const txId = await sendTransaction(contract.address, amountSatoshis);

            console.log('Contract funded. Transaction ID:', txId);
            setIsDeployed(true);
            return txId;
        } catch (error) {
            console.error('Deployment failed:', error);
            throw error;
        }
    };

    const distributeDividends = useCallback(async () => {
        if (!contract || !wallet) {
            console.error('Contract or wallet not ready');
            return;
        }

        const performDistribution = async (retryCount = 0): Promise<any> => {
            try {
                let targetContract = contract;

                // If we are retrying, we need to force a new connection
                if (retryCount > 0) {
                    const cluster = getElectrumCluster();
                    const newProvider = new ElectrumNetworkProvider('chipnet', cluster);
                    targetContract = new Contract(
                        artifact as any,
                        [1000n], // dividendPerToken
                        { provider: newProvider }
                    );
                    setContract(targetContract);
                }

                console.log(`Attempting distribution (Try ${retryCount + 1})...`);

                const tx = await targetContract!.functions
                    .distribute()
                    .to(targetContract!.address, 1000n)
                    .send();

                console.log('Transaction sent:', tx);
                return tx;

            } catch (error: any) {
                console.error(`Distribution attempt ${retryCount + 1} failed:`, error);

                // Check for connection error
                const isConnectionError = error.message?.includes('available clients (0)') ||
                    error.message?.includes('Socket') ||
                    error.message?.includes('timeout');

                if (isConnectionError && retryCount < 3) {
                    const nextRetry = retryCount + 1;
                    console.warn(`Connection dropped. Retrying in 1s (${nextRetry}/3)...`);
                    factoryToast.loading(`⚠️ Connection dropped. Reconnecting (${nextRetry}/3)...`);

                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return performDistribution(nextRetry);
                }
                throw error;
            }
        };

        return performDistribution();
    }, [contract, wallet]);

    return {
        contract,
        distributeDividends,
        deployContract,
        isDeployed
    };
};
