# OnChain Scholarship Platform

A decentralized scholarship platform built on Ethereum that connects students with blockchain-based educational funding opportunities.

## Features

- **Browse Scholarships**: View all available scholarship opportunities
- **Apply for Scholarships**: Submit applications with personal statements
- **Admin Dashboard**: Create and manage scholarships, review applications
- **Claim Funds**: Approved students can claim funds directly to their wallet
- **Transparent**: All transactions recorded on the blockchain
- **Secure**: Built with Solidity smart contracts and modern Web3 tools

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Web3**: wagmi v2, viem v2, RainbowKit v2
- **Smart Contract**: Solidity ^0.8.20
- **Styling**: Tailwind CSS, shadcn/ui
- **Network**: Ethereum Sepolia (testnet)

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MetaMask or another Web3 wallet
- Sepolia testnet ETH (get from faucets)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy `.env.example` to `.env.local` and configure:
   ```bash
   cp .env.example .env.local
   ```

4. Update environment variables:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: Your deployed contract address on Sepolia
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com)

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Smart Contract

The smart contract is located in the root of the project as `OnChainScholarship.sol`.

### Deploying the Contract

1. Deploy to Sepolia testnet using Remix, Hardhat, or Foundry
2. Copy the deployed contract address
3. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`

### Contract Functions

**Admin Functions:**
- `createScholarship(title, description)` - Create new scholarship with ETH funding
- `approveApplication(scholarshipId, applicant)` - Approve student application
- `rejectApplication(scholarshipId, applicant)` - Reject student application
- `closeScholarship(scholarshipId)` - Close scholarship to new applications

**User Functions:**
- `submitApplication(scholarshipId, metadataURI)` - Apply for scholarship
- `claimFunds(scholarshipId)` - Claim approved scholarship funds

**View Functions:**
- `getScholarship(scholarshipId)` - Get scholarship details
- `getApplicationStatus(scholarshipId, applicant)` - Check application status
- `scholarshipCount()` - Get total number of scholarships

## Project Structure

```
/app
  /page.tsx                    # Landing page
  /scholarships
    /page.tsx                  # Browse scholarships
    /[id]/page.tsx            # Scholarship details
    /[id]/apply/page.tsx      # Application form
    /[id]/claim/page.tsx      # Claim funds
  /admin
    /page.tsx                 # Admin dashboard
    /create/page.tsx          # Create scholarship
    /applications/[id]/page.tsx  # Review applications

/components
  /providers/web3-provider.tsx  # Web3 configuration
  /wallet-button.tsx           # Connect wallet
  /scholarship-card.tsx        # Scholarship card
  /admin-guard.tsx             # Admin route protection

/lib
  /contract.ts                 # Contract ABI and address
  /wagmi.ts                    # wagmi configuration
  /hooks
    /use-scholarship.ts        # Scholarship data hooks
    /use-application.ts        # Application status hooks
    /use-is-admin.ts          # Admin check hook
```

## Usage

### For Students

1. **Connect Wallet**: Click "Connect Wallet" and select your wallet
2. **Browse Scholarships**: View available opportunities on the scholarships page
3. **Apply**: Click on a scholarship and fill out the application form
4. **Track Status**: Check your application status on the scholarship detail page
5. **Claim Funds**: Once approved, claim your scholarship funds to your wallet

### For Administrators

1. **Connect Admin Wallet**: Connect the wallet that deployed the contract
2. **Create Scholarship**: Navigate to Admin > Create Scholarship
3. **Fund Scholarship**: Specify amount in ETH when creating
4. **Review Applications**: View and review student applications
5. **Approve/Reject**: Make decisions on applications
6. **Manage**: Close scholarships or view analytics

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract address | Yes |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | Yes |
| `PINATA_JWT` | Pinata API JWT for IPFS | Optional |
| `NEXT_PUBLIC_PINATA_GATEWAY` | Pinata IPFS gateway URL | Optional |

## Features Roadmap

- [x] Connect wallet with RainbowKit
- [x] Browse scholarships
- [x] View scholarship details
- [x] Submit applications
- [x] Admin dashboard
- [x] Create scholarships
- [x] Review and approve/reject applications
- [x] Claim approved funds
- [ ] IPFS document uploads via Pinata
- [ ] Email notifications
- [ ] Application deadline enforcement
- [ ] Multi-signature admin support
- [ ] The Graph indexer integration
- [ ] ENS name resolution

## Contributing

This is a demo project. Feel free to fork and customize for your needs.

## License

MIT
