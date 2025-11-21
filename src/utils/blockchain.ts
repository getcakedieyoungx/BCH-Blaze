import { ElectrumNetworkProvider } from 'cashscript';
export { getElectrumCluster } from '../../utils/network';
import { getElectrumCluster } from '../../utils/network';

const provider = new ElectrumNetworkProvider('chipnet', getElectrumCluster());

/**
 * Get BCH balance for an address
 */
export async function getBalance(address: string): Promise<number> {
    try {
        const utxos = await provider.getUtxos(address);
        const satoshis = utxos.reduce((sum, utxo) => sum + Number(utxo.satoshis), 0);
        console.log("Raw Balance (Sats):", satoshis);
        return satoshis / 100000000; // Convert to BCH
    } catch (error) {
        console.error('Error fetching balance:', error);
        return 0;
    }
}

/**
 * Get UTXOs for an address
 */
export async function getUTXOs(address: string) {
    try {
        return await provider.getUtxos(address);
    } catch (error) {
        console.error('Error fetching UTXOs:', error);
        return [];
    }
}

/**
 * Broadcast a transaction to Chipnet
 */
export async function broadcastTx(txHex: string): Promise<string> {
    try {
        const txid = await provider.sendRawTransaction(txHex);
        return txid;
    } catch (error) {
        console.error('Error broadcasting transaction:', error);
        throw error;
    }
}

/**
 * Generate block explorer link for a transaction
 */
export function getTxLink(txid: string): string {
    return `https://chipnet.imaginary.cash/tx/${txid}`;
}

/**
 * Generate block explorer link for an address
 */
export function getAddressLink(address: string): string {
    return `https://chipnet.imaginary.cash/address/${address}`;
}

/**
 * Get Chipnet faucet link
 */
export function getFaucetLink(): string {
    return 'https://faucet.fullstack.cash/';
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars: number = 8): string {
    if (address.length <= chars * 2) return address;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
