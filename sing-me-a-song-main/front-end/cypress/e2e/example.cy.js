import { faker } from '@faker-js/faker';
import { IoReturnUpForwardOutline } from "react-icons/io5";
import React from 'react'

describe('Testa pagina home de recommendations', () => {
  it('deve acessar a pagina inicial corretamente', () => {
    cy.visit('http://localhost:3000')
  })
})

describe('Testa adicão de recomendações', () => {
  it('deve preencher inputs e clicar no botão', () => {
    cy.get('#name').type('Charlie Brown Jr'+faker.name.findName())
    cy.get('#link').type('https://www.youtube.com/watch?v=FBUDQgfN_9g')
    cy.get('#sendRecommendationButton').click()
  })
})