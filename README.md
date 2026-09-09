# 🌐 Watchlana Backend — Solana Wallet Tracker API

This is the **backend** for **Watchlana**, a Solana wallet tracking app that monitors multiple wallets, tracks SOL transactions, and sends real-time push notifications when SOL is sent or received. Built with **Node.js**, **Express**, **Knex**, **Bun**, and **PostgreSQL**.

---

## Mobile App

Visit the [Watchlana Mobile App](https://github.com/ElSierra/Solana-Notification-React-Native)

## 🛠️ Tech Stack

- **Bun** — JavaScript runtime for building the backend & Fast and modern package manager.
- **Express** — Web framework for creating API endpoints.
- **Knex** — SQL query builder for PostgreSQL.
- **PostgreSQL** — Relational database for storing wallet and user data.
- **Solana Web3.js** — For interacting with the Solana blockchain.
- **OneSignal** — For sending push notifications.
- **Helius** - Solana RPC client.
  
---

## 📦 Features

- **Track multiple Solana wallets** and their balances.
- **Detect incoming and outgoing SOL transactions**.
- **Push notifications** for transaction alerts via OneSignal.
- **RESTful API** for managing wallets and user data.

---

## RPC rate limits

Set `HELIUS_KEY` to your Helius API key. Both SOL and token balance reads use
Helius mainnet automatically. An optional `SOLANA_RPC` full URL overrides this;
leave it blank to use Helius. Only when neither is set is the public Solana
endpoint used.

Wallet refreshes run in batches of `SOLANA_WALLET_BATCH_SIZE` (default 2). All
balance reads share a serial queue, with at least `SOLANA_RPC_INTERVAL_MS`
(default 500) between request starts. HTTP 429 and JSON-RPC code 429 responses
retry up to four times with exponential backoff and jitter. HTTP `Retry-After`
(seconds or date) pauses the entire queue. Each HTTP attempt times out after 15
seconds. RPC errors propagate rather than being saved as zero balances.

This limit is per server process. Multiple replicas sharing a key/IP must share
a distributed limiter or divide the available request budget between replicas.
Refreshes can take longer with many wallets or provider cooldowns; persistent
provider limits still fail after the retries. Increase the interval if your free
tier has a lower allowance. The root health route does not consume RPC quota.

Run the offline RPC regression tests with `bun test tests`.
