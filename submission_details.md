# Project Description
**The Dividend Factory** is a next-gen BCH dApp that automates dividend payments for SLP/CashTokens. Built for the **Chipnet Track**, it showcases the power of the **Layla Upgrade** by using on-chain **Loops** and **64-bit Math** to validate distributions in a single atomic transaction. No more trusted servers—just pure, verifiable math.

# Tech Stack
*   **Blockchain:** Bitcoin Cash (Chipnet Testnet)
*   **Smart Contract:** CashScript (v0.10.0+)
*   **Frontend:** React + TypeScript
*   **Libraries:** Electrum-Cash, CashScript SDK

# Demo Link
[Insert Video/Live Demo Link Here]

# Key Innovation
We implemented a `while` loop inside the smart contract (`OP_BEGIN`/`OP_UNTIL`) to iterate through transaction inputs. This allows the contract to dynamically verify that *every* token holder in the input gets exactly their calculated share of BCH in the output, enforcing `OutputValue == InputToken * DividendPerToken`. This was previously impossible or inefficient without loop opcodes.
