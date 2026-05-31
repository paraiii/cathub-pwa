# CatHub 🐾

CatHub is a beautifully designed, mobile-first Progressive Web App (PWA) built to help pet owners easily track their cat's health. Specifically tailored to monitor weight fluctuations and vomit incidents, CatHub provides an Apple-like, premium user experience with clear visual data representations.

## ✨ Features

- **Quick Health Logging**: Fast and intuitive modal forms to log your cat's weight (in kg) and vomit incidents (with optional notes), powered by MUI's advanced DateTimePicker.
- **Apple-Style Vomit Calendar**: A custom-designed health calendar that visually tracks vomit frequency. Days are marked with color-coded dots (1 time = Green, 2 times = Orange, 3+ times = Red) to quickly identify health patterns.
- **Interactive Weight Trend Chart**: Track weight progress over time via a responsive line chart with filters for "This Month", "This Year", and "All Time".
- **PWA Ready**: Fully configured as a Progressive Web App. Install it directly to your iOS or Android home screen for an app-like experience and offline access.
- **Local-First Architecture**: Currently uses `localStorage` for immediate, offline-ready data persistence, designed with a clean API service layer ready to be swapped with a real backend (e.g., Supabase) in the future.
- **Component-Driven Development**: Integrated with **Storybook** for isolated UI testing and development.

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI & Styling**: Material UI (MUI) v5 + Emotion (Custom Apple-like Theme)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Date Utility**: date-fns
- **UI Development**: Storybook

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cathub.git
   cd cathub
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to view it in the browser.

### Storybook

To view and develop UI components in isolation:
```bash
npm run storybook
```

### Build for Production

To build the app for production to the `dist` folder:
```bash
npm run build
```

## 📁 Initial Data

The project contains an `initial_data.json` file in the root directory. On the very first load, the app's `api.ts` service will automatically populate the local storage with this mock data so you can preview the charts and calendar functionalities immediately.

---
*Designed with ❤️ for our feline friends.*
