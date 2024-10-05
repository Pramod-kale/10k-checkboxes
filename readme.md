<p align="center">
  <img height="100" width="100" src="./web-app/public/checkbox.png" alt="Project Image">
</p>

# 10k-checkboxes 

Welcome to **10k-checkboxes**, a web application inspired by [one-million-checkboxes](https://onemillioncheckboxes.com/), designed to provide 10,000 checkboxes for everyone to access, without authentication. This app leverages frontend virtualization for performance and uses **Supabase** on the backend for real-time updates.

You can view the live application [here](https://ten-thousand-checkboxes.onrender.com).


## Features

- **10,000 Checkboxes**: Users can interact with checkboxes, and changes are reflected in real-time.
- **Virtualized Rendering**: The app uses `react-window` to render checkboxes efficiently, ensuring smooth performance even with a large number of elements.
- **Supabase Backend**: Real-time updates and state management are powered by **Supabase**, allowing for seamless synchronization across multiple users.

## Tech Stack

- **Frontend**: React with `react-window` for virtualized rendering.
- **Backend**: Supabase for real-time data handling.
- **Build Tool**: Vite for fast development and builds.

## Getting Started

Follow these instructions to clone the repository and run the app locally.

### Prerequisites

- Node.js and npm/yarn installed.

### Clone the Repository and run locally

```bash
git clone git@github.com:Pramod-kale/10k-checkboxes.git
cd 10k-checkboxes
yarn/npm install
yarn/npm run dev
```