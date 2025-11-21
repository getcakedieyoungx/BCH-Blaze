## Our Solution

The Dividend Factory uses Bitcoin Cash's **Layla Upgrade** to perform dividend calculations and distributions entirely on-chain using native loop opcodes (`OP_BEGIN`/`OP_UNTIL`). This enables:

✅ **Single Transaction Distribution:** Calculate and send dividends to multiple recipients in one atomic operation  
✅ **Trustless Execution:** All logic enforced by the blockchain, no intermediaries needed  
✅ **Cost Efficiency:** Dramatically reduced fees compared to individual transactions  
✅ **Transparency:** All distribution logic is publicly auditable on-chain

---

## 🎥 Demo

For a complete walkthrough with screenshots and technical details, see **[DEMO.md](DEMO.md)**.

---

## The Tech Stack

### Smart Contract Layer
- **Language:** CashScript (Bitcoin Cash Script with high-level syntax)
- **Key Features:**
  - Native loops using `OP_BEGIN` and `OP_UNTIL` opcodes
  - Transaction introspection for output validation
  - 64-bit arithmetic for precise dividend calculations
  
### Frontend Layer
- **Framework:** React 18 + Vite
- **Wallet Integration:** Custom burner wallet with WIF import/export
- **Network:** Chipnet (BCH Testnet) via Electrum-Cash
- **Theme:** Industrial "Widget Factory" aesthetic with CSS animations

### Infrastructure
- **Deployment:** Vercel (SPA with client-side routing)
- **Build Tool:** Vite (fast HMR, optimized production builds)
- **Type Safety:** TypeScript throughout

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Wallet     │  │   Contract   │  │     UI       │  │
│  │   Manager    │  │   Deployer   │  │  Components  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Electrum Network Provider                   │
│         (Chipnet WebSocket Connections)                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│           DividendDistributor.cash Contract              │
│  • Loop through token holder inputs                      │
│  • Validate output amounts via introspection             │
│  • Enforce dividend-per-token ratio                      │
└─────────────────────────────────────────────────────────┘
```

---

## Key Features

### 🔐 Burner Wallet System
- Generate ephemeral wallets for testing
- Import existing wallets via WIF (Wallet Import Format)
- Secure key storage in browser memory (no persistence)

### 🏭 Industrial UI Theme
- Animated hazard stripes
- Pulsing status indicators
- Terminal-style production monitor with typing effect
- Neon gold button hover effects

### 🔄 Network Resilience
- Automatic reconnection on Electrum server failures
- Fallback to multiple Chipnet servers
- Retry logic for transaction broadcasts (up to 3 attempts)

### 📊 Real-time Monitoring
- Live balance updates
- Contract deployment status tracking
- Transaction confirmation feedback

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Chipnet-compatible wallet (or use the built-in burner wallet generator)

### Installation

```bash
# Clone the repository
git clone https://github.com/getcakedieyoungx/The-Dividend-Factory.git
cd The-Dividend-Factory

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Usage Flow

1. **Connect Wallet:** Generate a burner wallet or import an existing WIF
2. **Fund Wallet:** Get testnet BCH from a Chipnet faucet
3. **Initialize Contract:** Deploy the DividendDistributor contract
4. **Execute Distribution:** Trigger the on-chain dividend calculation and payout

---

## Contract Details

The `DividendDistributor.cash` contract accepts a single constructor parameter:

- `dividendPerToken` (int): Amount of satoshis to distribute per token held

**Example:**
```solidity
contract DividendDistributor(int dividendPerToken) {
    function distribute() {
        int i = 0;
        loop(tx.inputs.length) {
            bytes25 recipient = tx.inputs[i].lockingBytecode.split(3)[0];
            int amount = dividendPerToken;
            require(tx.outputs[i].value == amount);
            require(tx.outputs[i].lockingBytecode == new LockingBytecodeP2PKH(recipient));
            i = i + 1;
        }
    }
}
**Team:** getcakedieyoungx  
**Repository:** [github.com/getcakedieyoungx/The-Dividend-Factory](https://github.com/getcakedieyoungx/The-Dividend-Factory)

This project demonstrates practical, real-world usage of the Layla Upgrade's new VM opcodes in a dividend distribution scenario. No off-chain computation, no trusted intermediaries—just pure on-chain logic.

---

## License

MIT. Code is law.