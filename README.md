    <td><img src="assets/shot-1-monitor.png" alt="Dashboard Monitor" width="400"/></td>
    <td><img src="assets/shot-2-connected.png" alt="Wallet Connected" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><b>Industrial Dashboard</b></td>
    <td align="center"><b>Wallet Connected</b></td>
  </tr>
  <tr>
    <td colspan="2"><img src="assets/shot-3-success.png" alt="Contract Initialized" width="820"/></td>
  </tr>
  <tr>
    <td colspan="2" align="center"><b>Contract Deployment Success</b></td>
  </tr>
</table>


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