import { useState } from 'react';
import { Contract, ElectrumNetworkProvider } from 'cashscript';
import artifact from '../../artifacts/DividendDistributor.json';
import { getElectrumCluster } from '../../utils/network';

interface DeploymentResult {
    contractAddress: string;
    explorerLink: string;
}

export const useContractDeployment = () => {
    const [deploying, setDeploying] = useState(false);

    const deployContract = async (
        tokenCategory: string,
        distributionAmount: string
    ): Promise<DeploymentResult> => {
        setDeploying(true);

        try {
            console.log('Preparing deployment for token category:', tokenCategory);
            const provider = new ElectrumNetworkProvider('chipnet', getElectrumCluster());

            // Convert amount to bigint (satoshis)
            const amountBigInt = BigInt(distributionAmount);

            // Instantiate the contract with parameters
            const contract = new Contract(
                artifact as any,
                [amountBigInt],
                { provider }
            );

            const contractAddress = contract.address;
            console.log('Contract deployed at address:', contractAddress);

            // Return contract info
            // Note: The contract is "deployed" when we instantiate it
            // Actual funding would require sending BCH to this address
            return {
                contractAddress,
                explorerLink: `https://chipnet.imaginary.cash/address/${contractAddress}`,
            };

        } catch (error) {
            console.error('Deployment error:', error);
            throw error;
        } finally {
            setDeploying(false);
        }
    };

    return {
        deployContract,
        deploying,
    };
};
