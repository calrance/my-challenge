import { ApiConstant } from "./../../src/constant/api.constant";


context("Rate List Page", () => {
  before(() => {
    cy.request(ApiConstant.EXCHANGE_RATE).then((res) => {
      expect(res.status).to.eq(200);
    }).as("getExchangeRate");
  })

  beforeEach(() => {
    cy.visit("/")
  });

  it("have an h1 on every page", () => {
    cy.get("h1").should("exist");
  });

  it("render title successfully", () => {
    cy.get("h1").contains("Rates List");
  });

  it("render table successfully", () => {
    cy.get(".el-table").should("exist");
  });

  it("cache rate list data", () => {
    cy.wait(3000).then(() => {
      expect(localStorage.getItem('rates-list')).to.exist;
    });
  })
})