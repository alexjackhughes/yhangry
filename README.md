# Hangry

Docs: https://docs.google.com/document/d/10k-i1B1RUO1EK0MkBN-zW-jj3Y6-5Ql5Oyj-jfqoxqM/edit?tab=t.0

Hello, for your ease I've written down where the answers to each of the questions is:


### Part 1: Design / Reverse engineering

1. Check `prisma/schema.prisma` for the schema.
2. Check `utils/scrape.ts` for the scraping logic, you can run it by running `npm run scrape` (Note: you'll need to have deno installed and the env variables set)
3. Bonus: We could use a cache store like Redis, which would allow use to cache the most common queries, and speed up the app.

### Part 2: Backend



## Getting Started

Firstly, you'll want to copy over the `.env.example` into `.env` and fill it with your own values.

Next, run the development server:

```bash
npm run dev
```

## Running command

You can run the following command from the terminal to scrape the API:

```bash
npx prisma migrate dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
