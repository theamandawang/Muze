# Muze
## Welcome
**Thanks for checking out Muze — _where listeners become storytellers_**

Muze is a social media platform designed for music lovers to connect, share, and explore. Whether you're reminiscing about an old favorite or discovering the next big hit, Muze turns your listening history into a story worth telling.

* 🎵 **Share your listening history** and let others see what’s on your playlist.  
* 📝 **Review songs and albums** to share your thoughts with the community.  
* 🎤 **Join music battles** and showcase your taste in head-to-head matchups.  
* 🎟️ **Find local music events** and never miss a great show.

Muze isn’t just about listening—it’s about experiencing music together. Join us and dive into the world of music storytelling!

## Running Muze
The technology stack for Muze uses Next.Js, Node.js, Supabase, and Postgres. Running muze locally is quite! Just follow these steps: 
1. Clone the repo using `git clone`
2. Once you clone, lets move into the `Muze` directory by doing `cd Muze` and then moving into the `muze` directory by doing `cd muze`
3. If you don't have `npm` installed follow the instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install 
4. Now lets install the dependencies by running `npm install`
5. Muze can now run be locally at `http://localhost:3000` by running the command `npm run dev`

**The .env file:** if you get any errors saying that you are missing URLs or Keys it is probably related to the `.env` file. Muze uses Supabase, the Spotifiy API, and the TicketMaster API.  Make sure you do the following: 
1. Make sure the `.env` file exists in `Muze/muze` otherwise create it

For Supabase read the [documentation](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) to and add the following:
  * `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` values and insert them in your `.env` file. 

For Spotify create a [developer account](https://developer.spotify.com/documentation/web-api) and add the following values into the `.env` file: 
* `SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, NEXTAUTH_SECRET` 

For Ticketmaster create a [developer account](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/) and add the following value to the `.env` file: 
* `TICKET_MASTER_API_KEY`

## Features
Muze is designed to make music sharing and discovery more engaging. Our initial phase focuses on key social and interactive features that bring music lovers together.

### Music Reviews

-   **Create, Edit, and Delete Reviews** – Share your thoughts on songs and albums with an intuitive text-based review system.
-   **5-Star Rating System** – A simple and visually appealing rating scale, backed by user research for quick and effective ratings.
-   **Media Integration** – Album art and track details are automatically fetched via the Spotify API for a seamless experience.
-   **Sorting & Filtering** – Reviews are ranked by recency and popularity to keep your feed fresh and relevant.

### User Profiles

-   **Custom Profiles** – Users can personalize their profiles with a bio and profile picture.
-   **Activity Feed** – Each profile showcases recent reviews and favorite tracks.
-   **Spotify Integration** – Connect your Spotify account to automatically pull in your listening history.

### Social Features

-   **Follow & Unfollow System** – Build a community by following other music lovers.
-   **Activity Feed** – Stay updated with sections like “Latest on Muze” and “Popular with Friends.”
-   **Review Likes** – Engage with content by liking reviews with a single click.

### Music Battles

-   **Voting System** – Participate in interactive music battles and vote for your favorite artists.

Muze is just getting started, and we can’t wait to grow alongside our community. Stay tuned for more exciting updates!