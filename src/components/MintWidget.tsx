import React, { useState } from 'react';
import '../styles/factory.css';
import { factoryToast } from '../utils/toast';
import { useContractDeployment } from '../hooks/useContractDeployment';

interface MintWidgetProps {
    connected: boolean;
}

export const MintWidget: React.FC<MintWidgetProps> = ({ connected }) => {
    const [tokenId, setTokenId] = useState('');
    const [amount, setAmount] = useState('');
    const [deployedAddress, setDeployedAddress] = useState('');
    const { deployContract, deploying } = useContractDeployment();

    const handleDeploy = async () => {
        if (!tokenId || !amount) {
            factoryToast.error('Please enter both Token ID and Amount');
            return;
        }

        if (!connected) {
            factoryToast.error('Please connect wallet first');
            return;
        }

        console.log(`Deploying Widget Contract for Token: ${tokenId} with Amount: ${amount}`);
        const toastId = factoryToast.loading('⚙️ FABRICATING SMART CONTRACT...');

        try {
            const result = await deployContract(tokenId, amount);

            setDeployedAddress(result.contractAddress);

            factoryToast.success(
                `WIDGET DEPLOYED! Contract Address: ${result.contractAddress.slice(0, 20)}...`,
                toastId
            );

            // Show explorer link in a separate toast
            setTimeout(() => {
                factoryToast.info(`View on Explorer: ${result.explorerLink}`);
            }, 500);

        } catch (error) {
            console.error('Deployment failed:', error);
            factoryToast.error(
                `DEPLOYMENT FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`,
                toastId
            );
        }
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(deployedAddress);
        factoryToast.success('CONTRACT ADDRESS COPIED!');
    };

    return (
        <div className="panel">
            <div className="panel-title">Fabrication Unit (Mint)</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                    <label>TOKEN ID SPECIFICATION:</label>
                    <input
                        className="input-factory"
                        type="text"
                        placeholder="e.g. 65f8..."
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        disabled={deploying}
                    />
                </div>

                <div>
                    <label>BATCH SIZE (AMOUNT IN SATOSHIS):</label>
                    <input
                        className="input-factory"
                        type="number"
                        placeholder="1000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={deploying}
                    />
                </div>

                <button
                    className="btn-factory btn-action"
                    onClick={handleDeploy}
                    disabled={!connected || deploying}
                >
                    {deploying ? '⚙️ FABRICATING...' : 'Initialize Fabrication'}
                </button>

                {deployedAddress && (
                    <div className="wallet-info">
                        <div className="info-row">
                            <label>CONTRACT ADDRESS:</label>
                            <div className="info-value">
                                <code>{deployedAddress}</code>
                                <button className="btn-copy" onClick={copyAddress}>
                                    📋
                                </button>
                            </div>
                        </div>
                        <div className="faucet-info">
                            📍 View on Explorer:<br />
                            <a
                                href={`https://chipnet.imaginary.cash/address/${deployedAddress}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="faucet-link"
                            >
                                chipnet.imaginary.cash
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
