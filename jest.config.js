module.exports = {
    testEnvironment: 'jsdom', // Use jsdom for React testing
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect", "<rootDir>/jest.setup.js"], // Add setup file
};