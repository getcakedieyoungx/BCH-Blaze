# The Dividend Factory - Live Demo

This document demonstrates the full workflow of The Dividend Factory, a BCH Chipnet dApp that uses the Layla Upgrade's native loop opcodes to distribute dividends on-chain.

## Demo Video

> **Note:** For the full interactive demo video, [download demo.webp](https://github.com/getcakedieyoungx/The-Dividend-Factory/raw/main/docs/demo.webp) and open it in your browser or video player.

Below are key screenshots from the workflow:

---

## Step-by-Step Walkthrough

### 1. Landing Page - Industrial Theme

![Landing Page](docs/01_landing.png)

The "Widget Factory" interface features:
- Industrial hazard stripe animations
- Real-time status indicators with pulse effects
- Terminal-style production monitor
- Clean, functional design matching the Chipnet theme

### 2. Wallet Generation

![Wallet Generated](docs/02_wallet.png)

**Action:** Clicked "FABRICATE NEW WALLET"

**Result:**
- Burner wallet created instantly
- Address displayed: `bchtest:qz...`
- Balance fetched from Chipnet Electrum servers
- WIF stored securely in browser state

### 3. Contract Initialization

![Contract Initialized](docs/03_contract.png)

**Action:** Clicked "INITIALIZE CONTRACT"

**Result:**
- `DividendDistributor.cash` contract deployed to Chipnet
- Contract address: `bchtest:pq...` (visible in console)
- Funding transaction broadcast successfully
- Contract now ready to accept distribution calls

### 4. Distribution Execution

![Distribution Executed](docs/04_distribution.png)

**Action:** Clicked "EXECUTE DISTRIBUTION SEQUENCE"

**Result:**
- Contract's `distribute()` function invoked
- Native loop opcodes (`OP_BEGIN`/`OP_UNTIL`) executed on-chain
- Automatic reconnection logic triggered (visible in toast notification)
- Transaction broadcast with retry mechanism (3 attempts max)

**Note:** The screenshot shows the robust network handling in action - when the Electrum connection dropped, the app automatically reconnected and retried the transaction.

---

## Technical Highlights

### What Makes This Special

1. **Native Loops:** The contract uses `OP_BEGIN` and `OP_UNTIL` to iterate through recipients without off-chain computation.
2. **Introspection:** The contract validates its own outputs to ensure correct dividend amounts.
3. **Network Resilience:** Auto-reconnect logic handles flaky testnet connections gracefully.
4. **Industrial UX:** CSS animations (hazard stripes, status pulses, terminal typing) create an engaging, thematic experience.

### Contract Code (Simplified)

```solidity
contract DividendDistributor(int dividendPerToken) {
    function distribute() {
        // Loop through transaction inputs (token holders)
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
```

---

## Try It Yourself

**Live Demo:** [Coming soon - Vercel deployment in progress]

**Local Setup:**
```bash
git clone https://github.com/getcakedieyoungx/The-Dividend-Factory.git
cd The-Dividend-Factory
npm install
npm run dev
```

---

## Hackathon Submission

**Track:** Chipnet (Layla Upgrade)  
**Team:** getcakedieyoungx  
**Repo:** [github.com/getcakedieyoungx/The-Dividend-Factory](https://github.com/getcakedieyoungx/The-Dividend-Factory)

This project demonstrates practical use of the new VM opcodes in a real-world dividend distribution scenario. No off-chain scripts, no trusted intermediaries - just pure on-chain logic.
