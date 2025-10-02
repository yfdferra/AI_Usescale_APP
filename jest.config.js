/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.js"],

  // look for tests under client/
  roots: ["<rootDir>/client"],

  moduleNameMapper: {
    // force a single React instance (point to client/node_modules)
    "^react$": "<rootDir>/client/node_modules/react",
    "^react-dom$": "<rootDir>/client/node_modules/react-dom",
    "^react-dom/client$": "<rootDir>/client/node_modules/react-dom/client",
    "^react/jsx-runtime$": "<rootDir>/client/node_modules/react/jsx-runtime",

    // map the two Star images
    "starEmpty\\.png$": "<rootDir>/test/__mocks__/starEmptyMock.js",
    "starFilled\\.png$": "<rootDir>/test/__mocks__/starFilledMock.js",
    
    // existing mappers
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|svg|webp|avif)$": "<rootDir>/test/__mocks__/fileMock.js",


  },

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(test).[tj]s?(x)",
  ],
};
