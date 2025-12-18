export {};

// Add custom Cypress commands here.
// Example:
// Cypress.Commands.add('login', () => {
//   ...
// })

declare global {
  namespace Cypress {
    interface Chainable {
      // Add command typings here.
    }
  }
}
