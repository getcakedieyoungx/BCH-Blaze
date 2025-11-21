import React, { useState } from 'react';
import '../styles/factory.css';
import { factoryToast } from '../utils/toast';

interface WalletModalProps {
    onClose: () => void;
    onGenerate: () => Promise<any>;
    onImport: (wif: string) => Promise<any>;
}

export const WalletModal: React.FC<WalletModalProps> = ({ onClose, onGenerate, onImport }) => {
    const [activeTab, setActiveTab] = useState<'generate' | 'import'>('generate');
    const [wifInput, setWifInput] = useState('');
    const [generatedWallet, setGeneratedWallet] = useState<any>(null);

    const handleGenerate = async () => {
        try {
            const wallet = await onGenerate();
            setGeneratedWallet(wallet);
        } catch (error) {
            console.error('Generation failed:', error);
        }
    };

    const handleImport = async () => {
        if (!wifInput.trim()) {
            factoryToast.error('Please enter a WIF key');
            return;
        }

        try {
            await onImport(wifInput);
            onClose();
        } catch (error) {
            console.error('Import failed:', error);
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        factoryToast.success(`${label} COPIED TO CLIPBOARD!`);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="panel">
                    <div className="panel-title">⚙️ WALLET CONNECTION TERMINAL</div>

                    <div className="wallet-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
                            onClick={() => setActiveTab('generate')}
                        >
                            [1] GENERATE BURNER
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
                            onClick={() => setActiveTab('import')}
                        >
                            [2] IMPORT WIF
                        </button>
                    </div>

                    {activeTab === 'generate' && (
                        <div className="tab-content">
                            <div className="warning-box">
                                ⚠️ WARNING: CHIPNET TESTNET ONLY<br />
                                This generates a temporary wallet for testing.<br />
                                DO NOT send real BCH to this address!
                            </div>

                            {!generatedWallet ? (
                                <button
                                    className="btn-factory btn-action"
                                    onClick={handleGenerate}
                                    style={{ width: '100%', marginTop: '15px' }}
                                >
                                    🔧 FABRICATE NEW WALLET
                                </button>
                            ) : (
                                <div className="wallet-info">
                                    <div className="info-row">
                                        <label>ADDRESS:</label>
                                        <div className="info-value">
                                            <code>{generatedWallet.address}</code>
                                            <button
                                                className="btn-copy"
                                                onClick={() => copyToClipboard(generatedWallet.address, 'ADDRESS')}
                                            >
                                                📋
                                            </button>
                                        </div>
                                    </div>

                                    <div className="info-row">
                                        <label>WIF KEY (SAVE THIS!):</label>
                                        <div className="info-value">
                                            <code style={{ fontSize: '11px' }}>{generatedWallet.wif}</code>
                                            <button
                                                className="btn-copy"
                                                onClick={() => copyToClipboard(generatedWallet.wif, 'WIF KEY')}
                                            >
                                                📋
                                            </button>
                                        </div>
                                    </div>

                                    <div className="faucet-info">
                                        💰 Get testnet BCH from faucet:<br />
                                        <a
                                            href="https://faucet.fullstack.cash/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="faucet-link"
                                        >
                                            https://faucet.fullstack.cash/
                                        </a>
                                    </div>

                                    <button
                                        className="btn-factory btn-success"
                                        onClick={onClose}
                                        style={{ width: '100%', marginTop: '15px' }}
                                    >
                                        ✅ WALLET LOADED - CLOSE
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'import' && (
                        <div className="tab-content">
                            <div className="warning-box">
                                🔑 IMPORT EXISTING WALLET<br />
                                Enter your Chipnet (testnet) WIF private key.
                            </div>

                            <div style={{ marginTop: '15px' }}>
                                <label>WIF PRIVATE KEY:</label>
                                <input
                                    className="input-factory"
                                    type="text"
                                    placeholder="cT1YPr..."
                                    value={wifInput}
                                    onChange={(e) => setWifInput(e.target.value)}
                                    style={{ width: '100%', marginTop: '5px' }}
                                />
                            </div>

                            <button
                                className="btn-factory btn-action"
                                onClick={handleImport}
                                style={{ width: '100%', marginTop: '15px' }}
                            >
                                🔓 IMPORT WALLET
                            </button>
                        </div>
                    )}

                    <button
                        className="btn-factory btn-secondary"
                        onClick={onClose}
                        style={{ width: '100%', marginTop: '10px' }}
                    >
                        ❌ CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
};
