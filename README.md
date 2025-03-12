# Online Voting System API

A secure and scalable REST API for managing online voting systems. This API provides functionality for voter registration, authentication, poll management, and vote casting with blockchain-based verification.

## Features

- 🔐 Secure voter authentication with OTP verification
- 📊 Real-time vote counting and statistics
- 🗳️ Multiple concurrent polls support
- 🏛️ State-wise party and poll management
- 📱 SMS-based OTP verification
- ⛓️ Blockchain-based vote verification
- 🔍 Detailed voting analytics and reports

## Tech Stack

- Node.js
- Express.js
- MySQL (with Sequelize ORM)
- JSON Web Tokens (JWT)
- SMS Gateway Integration
- Blockchain for vote verification

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd online_voting_system_api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DB_HOST=your_database_host
DB_USER=your_database_user