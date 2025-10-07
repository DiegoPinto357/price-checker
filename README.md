# price-checker

## Project Description

price-checker is a cross-platform application built with React, Ionic React, and Capacitor. It provides users with tools to plan meals, manage shopping lists, browse recipes, and scan NF (Nota Fiscal) documents via QR code. The app leverages modern web and mobile technologies to deliver a seamless experience on both web and Android platforms.

## Table of Contents

- [Features](#features)
- [Mobile App Capabilities](#mobile-app-capabilities)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Project Structure Overview](#project-structure-overview)
- [Additional Documentation](#additional-documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Meals Planner**: Plan your meals with an intuitive calendar interface.
- **Shopping List**: Create and manage shopping lists with product search and grouping capabilities.
- **Recipes**: Browse and view detailed recipes to inspire your cooking.
- **NF Scanner**: Scan and process NF (Nota Fiscal) documents using QR code scanning for easy data entry.

## Mobile App Capabilities

- Built with Capacitor to enable native mobile functionality.
- Supports Android platform with dedicated build and run scripts.
- Integrates native device features such as:
  - Barcode scanning via `@capacitor-community/barcode-scanner`.
  - Filesystem access for local data storage.
  - Haptic feedback for enhanced user experience.
- Uses CapacitorNodeJS plugin for Node.js integration within the mobile app.
- Android-specific resources and configurations are located in the `android/` directory.
- Supports running on Android emulators and physical devices with provided npm scripts.

## Technology Stack

- React with TypeScript for frontend development.
- Ionic React UI components for mobile-friendly interface.
- Capacitor for native mobile integration.
- Vite as the build tool and development server.
- Fastify backend server for API and data handling.
- React Query for efficient data fetching and caching.
- TailwindCSS for utility-first styling.
- Testing with Vitest and Testing Library.

## Setup Instructions

### Prerequisites

- Node.js and npm installed.
- Android Studio installed for Android development and emulation.
- MongoDB Atlas account with a cluster set up.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd price-checker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure MongoDB connection:
   - Create a `src/nodejs/env.json` file based on `src/nodejs/env.example.json`
   - Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB Atlas credentials
   - Get your connection string from MongoDB Atlas dashboard:
     1. Go to your cluster in MongoDB Atlas
     2. Click "Connect"
     3. Choose "Connect your application"
     4. Copy the connection string and update the `MONGODB_URI` in `env.json`

## Running the Application

### Development Mode

Run the development server and backend concurrently:

```bash
npm run dev
```

### Build for Production

Build the frontend and backend:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Android Platform

- Open Android project in Android Studio:
  ```bash
  npm run android:project
  ```
- Run on Android emulator (Pixel 6 API 31):
  ```bash
  npm run android:sim
  ```
- Run on connected Android device:
  ```bash
  npm run android
  ```

## Project Structure Overview

- `src/`: Main source code including frontend React components, backend server, and Node.js services.
- `android/`: Android platform-specific code and configuration.
- `docs/`: Architecture and storage diagrams in Excalidraw format.
- `mockData/`: Sample data used for testing and development.
- `public/`: Static assets for the web app.
- `scripts/`: Utility scripts for data updates and maintenance.

## Additional Documentation

Architecture and storage design diagrams are available in the `docs/` folder:

- `architecture.excalidraw`
- `storage-mobile.excalidraw`
- `storage-web.excalidraw`

## Testing

Run unit and integration tests:

```bash
npm run test
```

Run tests with interactive UI:

```bash
npm run test:ui
```

## Contributing

Contributions are welcome. Please fork the repository and submit pull requests for review. Follow existing code style and ensure tests pass before submitting.

## License

This is a private project. License information is not provided.
