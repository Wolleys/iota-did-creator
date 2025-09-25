# IOTA DID Creator 🪪

> A utility for creating and managing **Decentralized Identifiers (DIDs)** on the IOTA Tangle.
> Supports both **local development** and **containerized (Docker)** environments, with built-in HashiCorp Vault integration for secure key storage.

## ✨Features

- ✅ Create IOTA DIDs for users, organizations, or devices.
- 🔐 Secure key management via **HashiCorp Vault (transit engine)**.
- 🧪 Ready-to-run **demo script** showing end-to-end DID creation.
- 🐳 Flexible deployment: **Local** or  **Dockerized**.
- 🌐 Supports IOTA **Testnet** and **Mainnet**

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18 (works with 22.x, tested in Docker `node:22-alpine`).
- Hashicorp Vault (local or remote).
- Docker + Docker Compose (for containerized setup).

### Basic Usage

```ts
import { didService, ConfigManager, Network } from 'iota-did-creator';

// Configure for testnet with local Vault
ConfigManager.useNetwork(Network.Testnet, {
  endpoint: 'http://localhost:8200',
  token: 'your-vault-token'
});

// Create a DID for a user
const user = await didService.createUserWithDid({
  email: 'user@example.com',
  password: 'secure-password',
  role: 'organization',
  fundingAmount: 60
});

console.log('Created user:', user);
```

## 🧪 Demo Examples

### 🧑‍💻 Run Demo Locally

Start the demo script against a **local Vault** instance:

```bash
# Clone the repository
git clone https://github.com/Wolleys/iota-did-creator.git
cd iota-did-creator

# Install dependencies
npm install

# Start local Vault (requires Docker)
docker-compose up -d vault

# Run the demo locally
npm run demo:dev
```

Expected output:

```bash
Auto-configured for network: testnet, Vault: http://127.0.0.1:8200
Starting IOTA DID Creator Demo...
Environment: Local
=== Example 2: Complete User Creation with Key Pair ===
...

```

### 🐳 Run Demo in Docker

The project ships with a ready-to-use `docker-compose.yml`:

```bash
# Start everything in Docker
docker-compose up -d

# Or run demo in a one-off container
npm run demo:docker

# View logs
docker-compose logs -f iota-did-creator
```

Expected output:

```bash
Auto-configured for network: testnet, Vault: http://vault:8200
Starting IOTA DID Creator Demo...
Environment: Docker
=== Example 2: Complete User Creation with Key Pair ===
...

```

## ⚙️ Configuration

### Environment Variables

The app uses  **dotenv** . Create a `.env` file in the project root:

```ini
# Example .env
VAULT_ENDPOINT=http://localhost:8200
VAULT_TOKEN=your-vault-token
IOTA_NETWORK=testnet
```

### Network Configuration

```ts
import { ConfigManager, Network } from 'iota-did-creator';

// Testnet with local Vault
ConfigManager.useNetwork(Network.Testnet, {
  endpoint: 'http://localhost:8200',
  token: 'test-token'
});

// Mainnet with production Vault
ConfigManager.useNetwork(Network.Mainnet, {
  endpoint: 'https://your-vault.example.com',
  token: 'production-token'
});
```

## 🔧 Core Methods

#### `createIotaDid(options: ICreateDidOptions): Promise<ICreateDidResponse>`

Creates an IOTA DID with basic configuration.

```ts
const result = await didService.createIotaDid({
  email: 'user@example.com',
  walletId: 'user-wallet', // optional
  fundingAmount: 60 // optional, default: 60
});
```

#### `createUserWithDid(options: ICreateDidOptions & { password: string; role: string }): Promise<IUserWithKeyPair>`

Creates a complete user profile with DID and cryptographic keys.

```ts
const user = await didService.createUserWithDid({
  email: 'user@example.com',
  password: 'secure-password',
  role: 'organization',
  fundingAmount: 60
});
```

#### `getVerMethodKeyPair(walletId: string): Promise<IVerMethodKeyPair>`

Retrieves or creates verification method key pairs.

```ts
const keys = await didService.getVerMethodKeyPair('user-wallet');
```

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run demo with file watching
npm run demo:dev
```

### Testing

```bash
# Run health check
npm run healthcheck

# Test Docker build locally
docker-compose build
```

## 🔐 Vault Setup

### Local Development with Docker

```bash
# Start Vault only
docker-compose up -d vault

# Access Vault UI: http://localhost:8200
# Token: test
```

### Production Vault

For production, use a properly configured Vault instance with:

* TLS encryption
* Proper authentication
* Backup strategies
* Monitoring

## 📚 Usage Examples

### Example 1: Basic Integration

```ts
import { didService, ConfigManager, Network } from 'iota-did-creator';

// Configure
ConfigManager.useNetwork(Network.Testnet, {
  endpoint: process.env.VAULT_ENDPOINT,
  token: process.env.VAULT_TOKEN
});

// Use in your application
export class UserService {
  async createUser(email: string, password: string, role: string) {
    return await didService.createUserWithDid({
      email,
      password,
      role,
      fundingAmount: 100
    });
  }
}
```

### Example 2: Advanced Configuration

```ts
import { didService, ConfigManager, Network } from 'iota-did-creator';

class MyDIDService {
  constructor() {
    // Auto-configure from environment
    console.log('Network:', ConfigManager.getConfig().name);
  }

  async createOrganization(orgData) {
    const user = await didService.createUserWithDid({
      email: orgData.adminEmail,
      password: orgData.adminPassword,
      role: 'admin',
      walletId: `org-${orgData.id}-wallet`,
      fundingAmount: orgData.fundingAmount || 100
    });

    // Store additional org data
    return { ...user, orgData };
  }
}
```
