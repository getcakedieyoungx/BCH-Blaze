import React, { useState } from 'react';
import '../styles/factory.css';
import { useDividendDistributor } from '../hooks/useDividendDistributor';
import { factoryToast } from '../utils/toast';
import { WalletModal } from './WalletModal';
import { truncateAddress } from '../utils/blockchain';

interface ControlPanelProps {
    onDeploy: () => Promise<void>;
    isDeployed: boolean;
    wallet: any;
    connected: boolean;
    balance: number;
    generateBurnerWallet: () => Promise<any>;
    importWallet: (wif: string) => Promise<any>;
    disconnect: () => void;
    refreshBalance: () => Promise<void>;
    sendTransaction: (to: string, amount: bigint) => Promise<string>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    onDeploy,
    isDeployed,
    wallet,
    connected,
    balance,
    generateBurnerWallet,
    importWallet,
    disconnect,
    refreshBalance,
    sendTransaction
}) => {
    const { distributeDividends } = useDividendDistributor(wallet, sendTransaction);
    const [showWalletModal, setShowWalletModal] = useState(false);

    const handleDistribute = async () => {
        const toastId = factoryToast.loading('INITIATING DISTRIBUTION SEQUENCE...');
        try {
            await distributeDividends();
            factoryToast.success('DISTRIBUTION COMPLETE! Dividends distributed to all token holders.', toastId);
            await refreshBalance();
        } catch (error) {
            console.error('Distribution error:', error);
            factoryToast.error(
                `DISTRIBUTION FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`,
                toastId
            );
        }
    };

    const handleConnectClick = () => {
        setShowWalletModal(true);
    };

    const handleModalGenerate = async () => {
        const wallet = await generateBurnerWallet();
        return wallet;
    };

    const handleModalImport = async (wif: string) => {
        await importWallet(wif);
    };

    return (
        <div className="panel">
            <div className="panel-title">Control Panel</div>

            {/* Wallet Display */}
            {connected && wallet ? (
                <div className="wallet-display">
                    <span className="status-light status-on"></span>
                    <span className="wallet-address">
                        {truncateAddress(wallet.address, 10)}
                    </span>
                    <span className="wallet-balance">
                        {balance.toFixed(4)} BCH
                    </span>
                    <button
                        className="btn-factory btn-disconnect"
                        onClick={disconnect}
                    >
                        DISCONNECT
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <span className="status-light status-off"></span>
                        SYSTEM OFFLINE
                    </div>
                    <button className="btn-factory btn-action" onClick={handleConnectClick}>
                        🔌 CONNECT WALLET
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <button
                    className="btn-factory"
                    onClick={onDeploy}
                    disabled={!connected || isDeployed}
                    style={isDeployed ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                    {isDeployed ? '[A] SYSTEM ONLINE' : '[A] INITIALIZE CONTRACT'}
                </button>
                <button className="btn-factory btn-action" onClick={handleDistribute} disabled={!connected}>
                    [B] Execute Distribution Sequence
                </button>
            </div>

            {showWalletModal && (
                <WalletModal
                    onClose={() => setShowWalletModal(false)}
                    onGenerate={handleModalGenerate}
                    onImport={handleModalImport}
                />
            )}
        </div>
    );
};
