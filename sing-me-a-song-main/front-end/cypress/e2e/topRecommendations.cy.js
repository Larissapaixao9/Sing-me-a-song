const data = [
    {
      name: "Charlie Brown Jr - Camisa preta",
      youtubeLink: "https://www.youtube.com/watch?v=qGXA66S8cu0",
    },
    {
      name: "Charlie Brown Jr - Como Tudo Deve Ser",
      youtubeLink: "https://www.youtube.com/watch?v=k7pr4VTk5cQ",
    },
    {
      name: "Charlie Brown Jr - senhor do tempo",
      youtubeLink: "https://www.youtube.com/watch?v=SytqxaFStHY",
    },
  ]

  describe("Testa top recommendations", () => {

    //reseta e completa o banco de acordo com a rota feita no backend para isso
    beforeEach(() => {
      cy.resetDatabase()

      cy.insertDatabase()
    })

    it('Deve retornar as "top REcommendations" com sucesso', () => {
      const recommendations = data

      const amount = 3

      cy.visit(`http://localhost:3000/`)

      //Cy.intercept match any request that exactly matches the URL 
      cy.intercept("GET", "http://localhost:5000/recommendations/top/10").as("getTopRecommendations")

      cy.contains("Top").click()

      cy.url().should("equal", `http://localhost:3000/top`)

      cy.wait("@getTopRecommendations")

      cy.contains(recommendations[0].name)

      cy.get("article").should("have.length", amount);
    })
  })