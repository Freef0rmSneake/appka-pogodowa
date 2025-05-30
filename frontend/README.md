
# Weather App

A modern React-based weather application that displays current weather conditions and forecasts for cities around the world. The app features a clean, responsive design and provides detailed weather information including temperature, humidity, wind speed, and more.

## Features

- Search for weather by city name
- View current weather conditions with detailed metrics
- 5-day weather forecast
- Responsive design that works on desktop and mobile devices
- Beautiful weather icons and animations
- Error handling for API requests

## Prerequisites

- Node.js (v14 or later)
- npm or yarn package manager
- Backend server for weather data (see Backend Setup)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Configuration

1. Make sure your backend server is running (see Backend Setup).
2. The app is configured to proxy API requests to `http://localhost:3000` by default. If your backend runs on a different port, update the `vite.config.ts` file.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Backend Setup

This frontend is designed to work with a backend that provides the following endpoints:

- `GET /weather?q={city}` - Get current weather for a city
- `GET /forecast?q={city}` - Get weather forecast for a city
- `GET /search?q={query}` - Search for cities

Make sure your backend is running and accessible at `http://localhost:3000` or update the proxy configuration in `vite.config.ts`.

## Environment Variables

Create a `.env` file in the root directory if you need to configure environment-specific settings:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Testing

Run the test suite with:

```bash
npm test
```

## Built With

- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Styled Components](https://styled-components.com/) - CSS-in-JS styling
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Aplikacja Pogodowa - Frontend

Aplikacja pogodowa pokazująca aktualną pogodę i prognozę dla 10 największych miast w Polsce.

## Funkcje

- Wyświetlanie aktualnej pogody
- Prognoza 5-dniowa
- Lista 10 największych polskich miast
- Automatyczne uzupełnianie nazw miast
- Interfejs w języku polskim

## Technologie

- React
- Material-UI
- Vite
- Axios

## Instalacja

```bash
npm install
```

## Uruchomienie

```bash
npm run dev
```

## Budowanie

```bash
npm run build
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
 261ace5e0aaa591daad3d06a2631c76945ae1941
