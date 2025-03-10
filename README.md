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