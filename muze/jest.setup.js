// jest.setup.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// Optionally, include other test setup logic here:
import '@testing-library/jest-dom';
