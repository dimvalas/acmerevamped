# ACME Revamped

![ACME Revamped](https://cdn.discordapp.com/attachments/1352694840617472010/1402543884248289340/image.png?ex=68944c48&is=6892fac8&hm=44a282465643fddb2acc43d3b82b0fb35336e0805ce7a6987cc626db5dbecfd0&)

Live demo is https://acmerevamped.vercel.app/

A modern webstore built with Next.js using pages routing, inspired by Vercel's ACME demo but redesigned with a fresh aesthetic.

## Features

- Next.js with Pages Router
- Modern, clean design
- Product catalog browsing
- Shopping cart functionality
- Responsive layout

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/dimvalas/acmerevamped.git
cd acmerevamped
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Deployment

This project is configured for GitHub Pages deployment. Note that cart functionality may have limitations when deployed on GitHub Pages due to static hosting constraints.

To deploy:

```bash
npm run build
npm run export
```

The `out/` directory can then be deployed to GitHub Pages.

## Tech Stack

- Next.js
- React
- CSS Modules / Styled Components
- GitHub Pages (deployment)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
