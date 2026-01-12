# 2026-Rebuilt-RobotSim

A strategy planning simulation for the 2026 FRC game season.

## What is this?
This project is a web-based simulation environment built with React, TypeScript, and Vite. It models robot movement, ball interactions, and team-based strategies on a grid-based field, providing a visual way to analyze game dynamics.

## Why is it useful?
The simulator enables teams to test and optimize gameplay strategies before building physical hardware. Key features include:
- A* pathfinding for autonomous navigation.
- Real-time scoring and ball tracking.
- Strategy evaluation based on Expected Value (EV) models.
- Support for multiple robot roles including collectors and scorers.

## Demo
<img src="./public/demo.gif" alt="2026-Rebuilt-RobotSim Demo" width="50%">

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (included with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/2026-Rebuilt-RobotSim.git
   cd 2026-Rebuilt-RobotSim
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
Start the development server with hot reload:
```bash
npm run dev
```
Then open your browser to the URL shown in the terminal (typically http://localhost:5173).

### Production Build
Build the application for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Contributing
We welcome contributions from the community. If you have improvements for the simulation engine, new robot strategies, or UI enhancements, please feel free to submit a pull request.
