import React from 'react';
import '../styles/factory.css';
import { ControlPanel } from './ControlPanel';
import { MintWidget } from './MintWidget';
import { useWallet } from '../hooks/useWallet';
import { useDividendDistributor } from '../hooks/useDividendDistributor';
import { factoryToast } from '../utils/toast';

export const Dashboard: React.FC = () => {
    const {
        wallet,
        connected,
        balance,
        generateBurnerWallet,
        importWallet,
        disconnect,
        refreshBalance,
        sendTransaction
    } = useWallet();
    const { deployContract, isDeployed } = useDividendDistributor(wallet, sendTransaction);

    const handleDeploy = async () => {
        const toastId = factoryToast.loading('INITIALIZING CONTRACT SYSTEMS...');
        try {
            await deployContract();
            factoryToast.success('CONTRACT INITIALIZED! System ready for distribution.', toastId);
        } catch (error) {
            console.error('Deployment error:', error);
            factoryToast.error(`INITIALIZATION FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`, toastId);
        }
    };

    return (
        <div className="factory-container">
            <div className="hazard-header">
                <h1>⚙️ The Dividend Factory</h1>
            </div>

            {/* Network Badge */}
            <div style={{
                background: 'var(--factory-yellow)',
                color: 'var(--factory-black)',
                padding: '10px',
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: '20px',
                border: '2px solid var(--factory-black)'
            }}>
                🌐 CONNECTED TO: BITCOIN CASH CHIPNET (TESTNET)
                {' | '}
                <a
                    href="https://faucet.fullstack.cash/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0066cc', textDecoration: 'underline' }}
                >
                    GET TESTNET BCH
                </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                {/* Left Column: Production Line Status */}
                <div className="panel">
                    <div className="panel-title">Production Line Monitor</div>
                    <div className="monitor-box" style={{ height: '200px', background: '#000', padding: '10px', overflowY: 'auto' }}>
                        <p style={{ color: '#00ff00' }}>&gt; System initialized...</p>
                        <p style={{ color: '#00ff00' }}>&gt; Connected to Chipnet Node [Layla-Compatible]</p>
                        <p style={{ color: '#00ff00' }}>&gt; CashScript Compiler: v0.12.0</p>
                        <p style={{ color: 'yellow' }}>&gt; Wallet Status: {connected ? 'CONNECTED' : 'DISCONNECTED'}</p>
                        {wallet && (
                            <p style={{ color: '#00ff00' }}>&gt; Address: {wallet.address}</p>
                        )}
                        <p style={{ color: 'yellow' }}>&gt; Waiting for input...</p>
                    </div>
                </div>

                {/* Right Column: Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <ControlPanel
                        onDeploy={handleDeploy}
                        isDeployed={isDeployed}
                        wallet={wallet}
                        connected={connected}
                        balance={balance}
                        generateBurnerWallet={generateBurnerWallet}
                        importWallet={importWallet}
                        disconnect={disconnect}
                        refreshBalance={refreshBalance}
                        sendTransaction={sendTransaction}
                    />
                    <MintWidget connected={connected} />
                </div>
            </div>
        </div>
    );
};
