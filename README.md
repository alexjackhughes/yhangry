# Hangry

Hello, thanks for taking the time to look through this. To make it easier for you, I've written down where the answers to each of the questions is:

### Part 1: Design / Reverse engineering

1. Check `prisma/schema.prisma` for the schema.
2. Check `utils/scrape.ts` for the scraping logic. I've added an API to make it easier to run your side, you just need to use Postman on the url `http://localhost:3000/scraper`
3. Bonus: We could use a cache store like Redis, which would allow use to cache the most common queries, and speed up the app.

### Part 2: Backend

1. Check `app/set-menus/[cuisineSlug]/route.ts` for the logic, or call it directly from `http://localhost:3000/set-menus/indian`
2. Bonus:
   - We could use a cache store like Redis, which would allow use to cache the most common queries, and speed up the app.
   - We could use something like OAuth to authenticate every request to the API, so that it can't be accessed by everyone.
   - We could use a service like Cloudflare, so that we are protected from DDoS attacks.
   - We could use some kind of rate-limiting middleware, to prevent excessive requests.
   - On a live app, we could set-up trusted domains, so that we only accept requests from our (or trusted) services.

### Part 3: Frontend

1. All of the page is in `app/page.tsx`, and the components are in `components/`.
2. Rather than use Redux, I've used the url to pass the state around; I think this would be a better user experience as it means you could set the guests and the type of food and share with your friends etc.
3. Bonus: In a real app, obviously we would want to make the items clickable and allow ordering as well as the sharing of individual options.

## Getting Started

Firstly, you'll want to copy over the `.env.example` into `.env` and fill it with your own values for the database.

Next, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
