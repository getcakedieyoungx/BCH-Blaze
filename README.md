# The Dividend Factory (Chipnet Edition)

**Problem:** Sending BCH dividends to 1000 token holders usually requires 1000 transactions or complex, trusted off-chain scripts. It's inefficient and centralized.

**Solution:** We use the new **Layla Upgrade** opcodes (`OP_BEGIN`/`OP_UNTIL`) to perform native loops on-chain. This allows a single contract interaction to calculate and distribute dividends to multiple recipients in one go, enforcing logic purely through Bitcoin Cash Script.

## 🎥 Live Demo

**🌐 Try it now:** [https://the-dividend-factory-2xnpet9lz-alperens-projects-e8a4fdab.vercel.app](https://the-dividend-factory-2xnpet9lz-alperens-projects-e8a4fdab.vercel.app)

## 📸 Interface Showcase

![Industrial Dashboard](assets/shot-1-monitor.png)
*Industrial-themed dashboard with hazard stripes and terminal monitor*

![Wallet Connected](assets/shot-2-connected.png)
*Burner wallet generated and connected to Chipnet*

![Contract Deployed](assets/shot-3-success.png)
*DividendDistributor contract successfully initialized*

## The Tech (Why this matters)

This isn't just a UI wrapper. We are leveraging the bleeding edge of the BCH VM:

*   **Native Loops:** Using `OP_BEGIN` and `OP_UNTIL` to iterate through recipient lists inside the locking script.
*   **Introspection:** The contract validates its own transaction outputs to ensure strict adherence to the distribution schedule.
*   **64-bit Math:** Precise dividend calculations using the new high-precision arithmetic opcodes.

## Architecture

*   **Contract:** `DividendDistributor.cash` (CashScript) - The on-chain logic engine.
*   **Frontend:** React + Vite - A "Widget Factory" themed interface for interaction.
*   **Network:** Chipnet (Testnet) - Powered by Electrum-Cash.

## Quick Start

No docker, no complex setup. Just code.

```bash
# Install dependencies
npm install

# Run the factory
npm run dev
```

## Deployment

The contract is deployed on Chipnet.
**Contract Address:** `bchtest:pq...` (Check console logs for latest deployment)

## License

MIT. Code is law.