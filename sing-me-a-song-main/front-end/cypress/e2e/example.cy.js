
describe("Testes para a pagina home :)", () => {
  beforeEach(() => {

    //reseta e completa o banco de acordo com a rota feita no backend para isso
    cy.resetDatabase()

    cy.insertDatabase();
  });

  it("Adiciona recomendações", () => {
    const recommendation = {
      name: "Charlie Brown Jr - Camisa preta",
      youtubeLink: "https://www.youtube.com/watch?v=qGXA66S8cu0",
    }

    cy.visit("http://localhost:3000/")

    cy.get('input[placeholder="Name"').type(recommendation.name);

    cy.get('input[placeholder="https://youtu.be/..."').type(recommendation.youtubeLink)

    cy.intercept("POST", "http://localhost:5000/recommendations").as("insertRecommendation")
    
    cy.get("button").click()

    cy.wait("@insertRecommendation")
  })

  it("emite erro se nome já estiver cadastrado", () => {
    const recommendation = {
      name: "Charlie Brown Jr - Camisa preta",
      youtubeLink: "https://www.youtube.com/watch?v=qGXA66S8cu0",
    }

    cy.visit("http://localhost:3000/")

    cy.get('input[placeholder="Name"]').type(recommendation.name)

    cy.get('input[placeholder="https://youtu.be/..."]').type(recommendation.youtubeLink)

    cy.intercept("POST", "http://localhost:5000/recommendations").as("insertRecommendation")
    
    cy.get("button").click()

    cy.wait("@insertRecommendation")

    cy.on("window:alert", (text) => {
      expect(text).to.contains("Error creating recommendation!")
    })
  })

  it("Aumenta like quando clicado", () => {
    cy.visit("http://localhost:3000/")

    cy.get(`article:first`).within(() => {
      cy.get("div:last").should("have.text", "0")

    })

    cy.get(`article:first`).within(() => {
      cy.get("svg:first").click()
    })

    cy.get(`article:first`).within(() => {
      cy.get("div:last").should("have.text", "1")
    })
  })

  it("Diminui like quando clicado", () => {
    cy.visit("http://localhost:3000/")

    cy.get(`article:first`).within(() => {
      cy.get("div:last").should("have.text", "0")
    })

    cy.get(`article:first`).within(() => {
      cy.get("svg:last").click()
    })

    cy.get(`article:first`).within(() => {
      cy.get("div:last").should("have.text", "-1")
    })
  })

  it("Realiza a exclusão quando existir uma pontuação menor que -5", () => {
    cy.visit("http://localhost:3000/")

    cy.get(`article:first`).within(() => {
      cy.get("div:last").should("have.text", "0")
    })

    for (let i = 0; i < 6; i++) {
      cy.get(`article:first`).within(() => {
        cy.get("svg:last").click()
      })

    }
    cy.get(`article`).should("have.length", 2)
  })
})



