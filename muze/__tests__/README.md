# Muze Testing Suite  

Muze uses **Jest** and **React Testing Library** to ensure authentication, database integrity, and UI stability. Our testing suite covers **API authentication, database operations, frontend component rendering, and end-to-end user flows** to prevent regressions and maintain a seamless user experience.  

## Test Structure  

All test cases are located inside the `__tests__/` directory, organized by **unit, integration, and end-to-end (E2E) testing**.

## Test Coverage Summary


| **Test**                         | **Category**   | **Purpose**                                                     | **Test Oracle (Pass/Fail Criteria)**                                          | **Edge Cases**                                           |
|----------------------------------|----------------|-----------------------------------------------------------------|-------------------------------------------------------------------------------|---------------------------------------------------------|
| `auth.integration.test.ts`       | Integration    | Validates authentication flow (token refresh, login, session)    | ✅ Returns new token when expired <br> ❌ Fails if token remains unchanged         | Expired token, missing user session                     |
| `profile.integration.test.ts`    | Integration    | Validates user profile update functionality                      | ✅ Updates username, bio, and avatar <br> ❌ Fails on invalid input                    | Username too short, avatar upload failure               |
| `reviewLikes.integration.test.ts`| Integration    | Ensures review like/dislike endpoints work correctly             | ✅ Registers and removes likes accurately <br> ❌ Inconsistent like counts            | Concurrent likes/unlikes, already liked scenario         |
| `social.integration.test.ts`     | Integration    | Validates follow/unfollow API endpoints for user interactions      | ✅ Allows follow/unfollow actions <br> ❌ Prevents self-follow and errors               | Following a new user, unfollow edge conditions           |
| `spotify.integration.test.ts`    | Integration    | Tests Spotify API interactions for retrieving song details         | ✅ Retrieves song info correctly <br> ❌ Fails if API request errors                  | Missing album art, no artist data                        |
| `reviewFlow.e2e.test.ts`         | E2E            | Tests the complete song review lifecycle (create, update, delete)    | ✅ Successfully creates, updates, retrieves, and deletes a review <br> ❌ Fails on missing/invalid input | Empty title, invalid rating (e.g., 0 or 6)               |
| `socialFlow.e2e.test.ts`         | E2E            | Simulates full social interactions (follow, unfollow, list following)  | ✅ Follows and unfollows users correctly <br> ❌ Fails on self-follow or session error  | Self-follow attempt, session failure                    |
| `userFlow.e2e.test.ts`           | E2E            | Simulates a complete user journey from signup to profile updates   | ✅ Successfully registers a new user, logs in, updates profile <br> ❌ Fails on invalid input or session issues | Missing password, duplicate username                    |
| `apiReview.unit.test.ts`         | Unit           | Tests review API helper functions for creating/updating reviews      | ✅ Processes valid review inputs correctly <br> ❌ Returns error on invalid input      | Missing title, invalid rating                            |
| `avatarUtils.unit.test.ts`       | Unit           | Verifies avatar URL processing and cache busting                     | ✅ Appends a timestamp for cache busting <br> ❌ Alters base64 image data             | No profile picture, malformed URL                        |
| `fetchArtistEvents.test.ts`      | Unit           | Validates event fetching from the Ticketmaster API                   | ✅ Parses event data correctly <br> ❌ Throws error on HTTP failure                   | API error, no events returned                            |
| `followButton.component.test.tsx`| Unit           | Ensures the FollowButton component renders and handles click events   | ✅ Renders correct text and invokes click handler <br> ❌ Incorrect behavior on click    | Loading state, rapid clicking                            |
| `hero.component.test.tsx`        | Unit           | Verifies the Hero component renders dynamic album art and username     | ✅ Displays username and album covers properly <br> ❌ Fails when data is missing       | No album covers, empty username                         |
| `spotifyAlbumInfo.test.ts`       | Unit           | Tests the Spotify album info wrapper for retrieving album details      | ✅ Returns correct album information <br> ❌ Returns null on API errors                | API failure, incomplete album data                       |
| `userGet.unit.test.ts`           | Unit           | Ensures fuzzy search returns relevant, sorted user matches             | ✅ Returns sorted and relevant users <br> ❌ Fails when no matches are found            | Partial username match, no results found                 |
| `validationReview.unit.test.ts`  | Unit           | Validates review input (title and rating) for creation/updating reviews  | ✅ Accepts valid review inputs <br> ❌ Returns error for empty title or invalid rating  | Title too long, rating out of allowed range              |

## How to Run Tests  

Run all tests:  
```bash
npm run test
```

Run tests in watch mode (automatically re-runs when files change):
```bash
npm run test -- --watchAll
```

Run a specific test file (Example: Authentication session tests):
```bash
npm test __tests__/integration/auth.integration.test.ts
```

Run only unit tests:
```bash
npm test -- __tests__/unit/
```

Run only integration tests:
```bash
npm test -- __tests__/integration/
```

Run only E2E tests:
```bash
npm test -- __tests__/e2e/
```
## Dev Notes

- Unit tests cover isolated functions and components (small scope).
- Integration tests ensure multiple services interact correctly (API calls, DB queries).
- End-to-End tests (E2E) simulate real user flows (e.g., authentication, reviews).
- Tests mock database queries and external APIs to prevent unwanted changes in production.
- Mocking tools used:
    - `jest.fn()` to create function spies
    - `jest.mock()` to replace imports with mock versions
    - `@testing-library/react` for rendering components in tests

## Links

📘 Jest documentation: https://jestjs.io/docs/getting-started 
<br> 🛠 NextAuth Docs (for session testing): https://next-auth.js.org
<br> 🎵 Spotify API Docs: https://developer.spotify.com/documentation/web-api
