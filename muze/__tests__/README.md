# Muze Testing Suite  

Muze uses **Jest** and **React Testing Library** to ensure authentication, database integrity, and UI stability. Our testing suite covers **API authentication, database operations, and frontend component rendering** to prevent regressions and maintain a seamless user experience.  

## Test Structure  

All test cases are located inside the `__tests__/` directory. At the moment, we've split them into API, database, and component folders.

| **Test**                        | **Purpose**                                      | **Test Oracle (Pass/Fail Criteria)**                            | **Edge Cases**                                  |
|----------------------------------|------------------------------------------------|----------------------------------------------------------------|------------------------------------------------|
| `refreshAccessToken.test.ts`   | Ensures expired tokens refresh correctly        | ✅ Returns new token if expired <br> ❌ Fails if token remains the same | - Token refresh success <br> - Failed refresh request |
| `authSession.test.ts`           | Ensures session contains valid user data       | ✅ Correct user info & token <br> ❌ Missing `expires` or `access_token` | - Expired vs. valid tokens <br> - Ensures session has all user details |
| `UserUpdate.test.ts`            | Ensures users are inserted only if needed      | ✅ Inserts only new users <br> ❌ Fails if duplicates exist | - Prevents duplicate user creation <br> - Ensures new users are saved correctly |
| `Dashboard.test.tsx`            | Ensures Dashboard UI renders properly          | ✅ Renders greeting text <br> ❌ Fails if UI elements are missing | - Ensures UI renders correctly <br> - Confirms user data is properly displayed |
| `Search.test.tsx`               | Ensures search queries work properly           | ✅ Results populate based on input <br> ❌ API request fails | - Valid song search returns results <br> - Searching for nonexistent song returns no results |

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
npm test __tests__/api/authSession.test.ts
```

## Links

📘 Jest documentation: https://jestjs.io/docs/getting-started 
<br> 🛠 NextAuth Docs (for session testing): https://next-auth.js.org







