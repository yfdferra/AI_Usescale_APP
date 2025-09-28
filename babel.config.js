// babel.config.js (at the SAME level as package.json / jest.config.js)
module.exports = {
  presets: [
    // Target the current Node version for tests
    ["@babel/preset-env", { targets: { node: "current" } }],
    // Enable JSX transform
    ["@babel/preset-react", { runtime: "automatic" }]
  ],
};
