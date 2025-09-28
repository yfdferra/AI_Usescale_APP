// Add jest-dom matchers (toBeInTheDocument, etc.)
import "@testing-library/jest-dom";

// Polyfill fetch, FormData, etc. for JSDOM
import "whatwg-fetch";

// (Optional) Quiet down console noise during tests:
// const origError = console.error;
// beforeAll(() => { console.error = (...args) => { /* filter if needed */ }; });
// afterAll(() => { console.error = origError; });
