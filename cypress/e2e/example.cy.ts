// https://docs.cypress.io/api/introduction/api.html

describe('Test Title Display', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'Rates List')
  })
})
