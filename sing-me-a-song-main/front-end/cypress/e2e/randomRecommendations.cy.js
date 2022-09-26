describe("testes da aba 'random'", () => {

    //resetando o banco e inserindo os dados provenientes do backend
    beforeEach(() => {
      cy.resetDatabase();
      cy.insertDatabase();
    })

    it(" Retorna recomendações aleatorias com 'score' maior ou igual a -5", () => {
      cy.visit(`http://localhost:3000/`)
    
      //Cy.intercept match any request that exactly matches the URL
      cy.intercept("GET", "http://localhost:5000/recommendations/random").as("getRandomRecommendations")
     
      cy.contains("Random").click()

      cy.url().should("equal", `http://localhost:3000/random`)

      cy.wait("@getRandomRecommendations")

      cy.get(`article`).within(() => {
        cy.get("div:first").should(($div) => {
          const text = $div.text()

          expect(text).to.be.oneOf([
            "Charlie Brown Jr - Camisa preta",
            "Charlie Brown Jr - Como Tudo Deve Ser",
            "Charlie Brown Jr - senhor do tempo",
          ])
        })
      })

      cy.get("article").should("have.length", 1)
    })
    
  })