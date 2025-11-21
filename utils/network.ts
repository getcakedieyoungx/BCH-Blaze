import { ElectrumCluster, ElectrumTransport, ClusterOrder } from 'electrum-cash';

// Network Configuration for Chipnet (BCH Testnet)
export const networkConfig = {
    network: 'chipnet',
    electrum: {
        applicationId: 'bch-blaze-dividend-distributor',
        version: '1.4.1',
        confidence: 1,
        distribution: 1,
        order: ClusterOrder.PRIORITY,
        timeout: 5000,
    },
    // List of available Chipnet servers
    servers: [
        {
            host: 'chipnet.imaginary.cash',
            port: 50004,
            transport: ElectrumTransport.WSS.Scheme,
        },
        {
            host: 'testnet.bitcoincash.network',
            port: 50004,
            transport: ElectrumTransport.WSS.Scheme,
        },
        {
            host: 'blackie.c3-soft.com',
            port: 60004,
            transport: ElectrumTransport.WSS.Scheme,
        },
        {
            host: 'chipnet.bch.ninja',
            port: 50004,
            transport: ElectrumTransport.WSS.Scheme,
        }
    ]
} as const;

// Helper to initialize the Electrum Cluster
export function getElectrumCluster() {
    const cluster = new ElectrumCluster(
        networkConfig.electrum.applicationId,
        networkConfig.electrum.version,
        networkConfig.electrum.confidence,
        networkConfig.electrum.distribution,
        networkConfig.electrum.order,
        networkConfig.electrum.timeout
    );

    networkConfig.servers.forEach(server => {
        cluster.addServer(server.host, server.port, server.transport);
    });

    return cluster;
}
