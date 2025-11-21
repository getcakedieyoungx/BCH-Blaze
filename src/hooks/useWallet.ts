import { useState } from 'react';
import {
    encodePrivateKeyWif,
    decodePrivateKeyWif,
    encodeCashAddress,
    CashAddressNetworkPrefix,
    CashAddressType,
} from '@bitauth/libauth';
import { getSecp256k1, getSha256, getRipemd160 } from '../utils/crypto';
import { factoryToast } from '../utils/toast';
import { getBalance, getElectrumCluster } from '../utils/blockchain';
import { Contract, ElectrumNetworkProvider, SignatureTemplate } from 'cashscript';
import p2pkhArtifact from '../artifacts/P2PKH.json';

interface Wallet {
    address: string;
    privateKey: Uint8Array;
    wif: string;
    publicKeyHash: Uint8Array;
}

export const useWallet = () => {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const generateBurnerWallet = async () => {
        setLoading(true);
        const toastId = factoryToast.loading('GENERATING BURNER WALLET...');

        try {
            const secp256k1 = await getSecp256k1();
            const sha256 = await getSha256();
            const ripemd160 = await getRipemd160();

            // Generate random private key
            const privateKey = new Uint8Array(32);
            crypto.getRandomValues(privateKey);

            // Derive public key
            const publicKey = secp256k1.derivePublicKeyCompressed(privateKey);
            if (typeof publicKey === 'string') {
                throw new Error('Failed to derive public key');
            }

            // Hash public key: RIPEMD160(SHA256(publicKey))
            const sha256Hash = sha256.hash(publicKey);
            const publicKeyHash = ripemd160.hash(sha256Hash);

            // Convert to iterable array (encodeCashAddress requires iterable)
            const payloadArray = new Uint8Array(publicKeyHash);

            // Generate address (Chipnet = testnet)
            const addressResult = encodeCashAddress({
                payload: payloadArray,
                prefix: CashAddressNetworkPrefix.testnet,
                type: CashAddressType.p2pkh,
            });

            if (typeof addressResult === 'string') {
                throw new Error(`Failed to encode address: ${addressResult}`);
            }

            const address = addressResult.address;

            // Encode WIF (testnet)
            const wif = encodePrivateKeyWif(privateKey, 'testnet');

            const newWallet: Wallet = {
                address,
                privateKey,
                wif,
                publicKeyHash,
            };

            setWallet(newWallet);
            setConnected(true);
            setLoading(false);
            factoryToast.success(`BURNER WALLET GENERATED! Address: ${address}`, toastId);

            // Fetch balance non-blocking
            getBalance(address).then(bal => setBalance(bal));

            return newWallet;
        } catch (error) {
            console.error('Error generating wallet:', error);
            factoryToast.error(`WALLET GENERATION FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`, toastId);
            setLoading(false);
            throw error;
        }
    };

    const importWallet = async (wifKey: string) => {
        setLoading(true);
        const toastId = factoryToast.loading('IMPORTING WALLET...');

        try {
            const secp256k1 = await getSecp256k1();
            const sha256 = await getSha256();
            const ripemd160 = await getRipemd160();

            // Decode WIF
            const decoded = decodePrivateKeyWif(wifKey);
            if (typeof decoded === 'string') {
                throw new Error('Invalid WIF key');
            }

            const privateKey = decoded.privateKey;

            // Derive public key
            const publicKey = secp256k1.derivePublicKeyCompressed(privateKey);
            if (typeof publicKey === 'string') {
                throw new Error('Failed to derive public key');
            }

            // Hash public key: RIPEMD160(SHA256(publicKey))
            const sha256Hash = sha256.hash(publicKey);
            const publicKeyHash = ripemd160.hash(sha256Hash);

            // Convert to iterable array (encodeCashAddress requires iterable)
            const payloadArray = new Uint8Array(publicKeyHash);

            // Generate address
            const addressResult = encodeCashAddress({
                payload: payloadArray,
                prefix: CashAddressNetworkPrefix.testnet,
                type: CashAddressType.p2pkh,
            });

            if (typeof addressResult === 'string') {
                throw new Error(`Failed to encode address: ${addressResult}`);
            }

            const address = addressResult.address;

            const importedWallet: Wallet = {
                address,
                privateKey,
                wif: wifKey,
                publicKeyHash,
            };

            setWallet(importedWallet);
            setConnected(true);
            setLoading(false);
            factoryToast.success(`WALLET IMPORTED! Address: ${address}`, toastId);

            // Fetch balance non-blocking
            getBalance(address).then(bal => setBalance(bal));

            return importedWallet;
        } catch (error) {
            console.error('Error importing wallet:', error);
            factoryToast.error(`WALLET IMPORT FAILED: ${error instanceof Error ? error.message : 'Invalid WIF key'}`, toastId);
            setLoading(false);
            throw error;
        }
    };

    const disconnect = () => {
        setWallet(null);
        setConnected(false);
        setBalance(0);
        factoryToast.info('WALLET DISCONNECTED');
    };

    const refreshBalance = async () => {
        if (!wallet) return;

        try {
            const bal = await getBalance(wallet.address);
            setBalance(bal);
        } catch (error) {
            console.error('Error refreshing balance:', error);
        }
    };

    const sendTransaction = async (toAddress: string, amountSatoshis: bigint) => {
        if (!wallet) throw new Error('Wallet not connected');

        const provider = new ElectrumNetworkProvider('chipnet', getElectrumCluster());

        // Instantiate P2PKH contract for the wallet
        const contract = new Contract(
            p2pkhArtifact as any,
            [wallet.publicKeyHash],
            { provider }
        );

        // Build and send transaction
        const tx = await contract.functions
            .spend(wallet.privateKey, new SignatureTemplate(wallet.privateKey))
            .to(toAddress, amountSatoshis)
            .send();

        console.log('Transaction sent:', tx.txid);
        return tx.txid;
    };

    return {
        wallet,
        connected,
        balance,
        loading,
        generateBurnerWallet,
        importWallet,
        disconnect,
        refreshBalance,
        sendTransaction,
    };
};
