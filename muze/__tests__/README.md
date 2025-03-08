# Muze Testing Suite  

Muze uses **Jest** and **React Testing Library** to ensure authentication, database integrity, and UI stability. Our testing suite covers **API authentication, database operations, frontend component rendering, and end-to-end user flows** to prevent regressions and maintain a seamless user experience.  

## Test Structure  

All test cases are located inside the `__tests__/` directory, organized by **unit, integration, and end-to-end (E2E) testing**.

## Test Coverage Summary

| **Test**                      | **Category**     | **Purpose**                                      | **Test Oracle (Pass/Fail Criteria)**                           | **Edge Cases**                                  |
|--------------------------------|----------------|------------------------------------------------|----------------------------------------------------------------|------------------------------------------------|
| `auth.integration.test.ts`     | Integration    | Ensures authentication (token refresh, login, session) | ✅ New token if expired <br> ❌ Fails if token remains the same | - Expired token <br> - Missing user session |
| `profile.integration.test.ts`  | Integration    | Ensures user profile updates work correctly  | ✅ Updates username, bio, avatar <br> ❌ Fails on invalid input | - Username too short <br> - Avatar upload failure |
| `spotify.integration.test.ts`  | Integration    | Ensures Spotify API interactions work correctly | ✅ Fetches song details <br> ❌ Fails if API request fails | - Missing album art <br> - No artist data |
| `social.integration.test.ts`   | Integration    | Ensures user follow/unfollow functionality works | ✅ Users can follow/unfollow <br> ❌ Prevents self-follow | - Follows a new user <br> - Unfollows correctly |
| `review.e2e.test.ts`          | E2E            | Ensures user can create and retrieve reviews | ✅ Saves and retrieves reviews correctly <br> ❌ Fails if missing title/rating | - Invalid rating (0 or 6) <br> - Empty review |
| `auth.e2e.test.ts`            | E2E            | Simulates full authentication flow | ✅ Logs in and maintains session <br> ❌ Fails on incorrect credentials | - Invalid credentials <br> - Redirect handling |
| `userProfileWorkflow.e2e.test.ts` | E2E        | Ensures full user profile update workflow | ✅ Updates user profile successfully <br> ❌ Fails if `updatedUser` is null | - Profile update with missing fields <br> - Avatar upload error |
| `review.unit.test.ts`         | Unit           | Tests validation logic for reviews | ✅ Valid reviews pass <br> ❌ Fails on empty title | - Long review title <br> - Missing rating |
| `spotify.unit.test.ts`        | Unit           | Tests individual Spotify API wrapper functions | ✅ Fetches correct track data <br> ❌ Fails on API error | - API unavailable <br> - No track found |
| `userGet.unit.test.ts`        | Unit           | Ensures fuzzy search retrieves correct users | ✅ Returns sorted, relevant users <br> ❌ Fails if no matches | - Partial username match <br> - No results found |
| `avatarUtils.unit.test.ts`    | Unit           | Ensures avatar image processing works correctly | ✅ Cache busting applies <br> ❌ Returns same image for base64 | - No profile picture <br> - Image URL formatting |

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
