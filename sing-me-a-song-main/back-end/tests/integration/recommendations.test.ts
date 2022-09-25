import { array } from 'joi';
import supertest from 'supertest'
import app from '../../src/app'
import {prisma} from '../../src/database'
import * as recommendationsFactory from '../factories/recommendationsFactory'

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE recommendations `;
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });


describe('POST /recommendations', ()=>{
    it('Retorna 201 se os dados forem enviados no formato correto', async()=>{

        const body = await recommendationsFactory.correctRecommendationData()

        const result = await supertest(app).post('/recommendations').send(body)

        const status = result.status

        expect(status).toEqual(201)
    })

    it('Retorna 422 se name não for enviado', async()=>{

        const body = await recommendationsFactory.RecommendationDataWithNoName()

        const result = await supertest(app).post('/recommendations').send(body)

        const status = result.status

        expect(status).toEqual(422)
    })

    it('Retorna 422 se não for enviado um link valido', async()=>{
        
        const body = await recommendationsFactory.RecommendationDataWithIncorrectLink()
        
        const result = await supertest(app).post('/recommendations').send(body)

        const status = result.status

        expect(status).toEqual(422)
    })
})

describe('Testa rota POST /recommendations/:id/upvote', ()=>{
    it('Retorna 201 se adicionado um ponto à pontuação da recomendação.', async()=>{

        //recommendationFactory.recommendationWithScore add a new recommendation 
        //to the db with 1 vote. Then, finds what was added and returns the data
        const body = await recommendationsFactory.recommendationWithScore(1)

        const id = body[0].id
        
        const result = await supertest(app).post(`/recommendations/${id}/upvote`)

        const status = result.status

        expect(status).toEqual(200)

        //verify if the score was added correctly for the given Id
        const isId = await prisma.recommendation.findUnique({
            where:{id}
        })
        expect(isId.score).toEqual(1)

    })

    it('Deve retornar 404 se o Id for inválido', async()=>{

        const id = 80;

        const result = await supertest(app).post(`/recommendations/${id}/upvote`)

        const status = result.status

        expect(status).toEqual(404)
        
    })
})

describe('Testa a rota /recommendations/:id/downvote', ()=>{
    it('Deve retornar 200 se a requisição for bem sucedida', async()=>{

        const body = await recommendationsFactory.recommendationWithScore(1)

        const id = body[0].id
        
        const result = await supertest(app).post(`/recommendations/${id}/downvote`)

        const status = result.status

        expect(status).toEqual(200)

        //verify if the negative score was added correctly for the given Id
        const isId = await prisma.recommendation.findUnique({
            where:{id}
        })
        expect(isId.score).toEqual(-1)
    })

    it('Deve excluir a recomendação caso fique abaixo de -5 e retornar status 200', async()=>{
        const body = await recommendationsFactory.recomendantionsWithScore(-5)

        
        const id = body.id
        
        const result = await supertest(app).post(`/recommendations/${id}/downvote`)

        const status = result.status

        expect(status).toEqual(200)

        const isRecommendation = await prisma.recommendation.findUnique({
            where:{id}
        })

        expect(isRecommendation).toEqual(null)
    })
})

describe('Testa rota /recommendations', ()=>{
    it('Deve retornar 200 se as solicitações vierem corretamente (menor que 10)', async()=>{

        const body = await recommendationsFactory.correctRecommendationData()

        await supertest(app).post('/recommendations').send(body)

        const result = await supertest(app).get('/recommendations').send({})

        const status = result.status

        expect(status).toEqual(200)

        expect(result.body.length).toBeLessThan(11) //verify if the body response is less than 10

    })

    it('Deve retornar status 200 quando mais de uma solicitação for enviada corretamente e a quantidade digitada deve vir corretamente', async()=>{
        
        const body = await recommendationsFactory.recommendationWithScore(5)

        await supertest(app).post('/recommendations').send(body)

        const result = await supertest(app).get('/recommendations').send({})

        expect(result.body).toHaveLength(5)

        const status = result.status

        expect(status).toEqual(200)

    })
})

describe('Testa rota GET /recommendations/:id', ()=>{
    it('deve retornar status 200 se as informações pelo Id vierem corretamente', async()=>{
        
        const body = await recommendationsFactory.recomendantionsWithScore(1)

        const id = body.id
        
        const result = await  supertest(app).get(`/recommendations/${id}`).send({})

        const status = result.status

        expect(status).toEqual(200)

        expect(result.body.id).toEqual(id)

    })

    it('Deve retornar 404 se o id for invalido', async()=>{

        const id=900000;

        const result = await supertest(app).get(`/recommendations/${id}`)

        const status = result.status

        expect(status).toEqual(404)


    })
})

describe('Testa a rota GET /recommendations/random', ()=>{
    it('Deve retornar status 200 se a requisição for bem sucedida', async()=>{

        const body = await recommendationsFactory.recomendantionsWithScore(10)

        const result = await supertest(app).get(`/recommendations/random`)

        console.log(result.body)

        expect(result.status).toEqual(200)

        expect(result.body).not.toBeNull

    })

    it('Deve retornar 404 se a requisição se não houver nenhuma musica cadastrada', async()=>{

        const body ={}

        const result = await supertest(app).get(`/recommendations/random`).send({})

        expect(result.status).toEqual(404)
    })
})

describe('Testa a rota GET /recommendations/top/:amount', ()=>{
    it('Deve retornar status 200 se a requisição for bem sucedida', async()=>{
        const body = await recommendationsFactory.recommendationWithScore(10)

        const amount = body.length

        const result = await supertest(app).get(`/recommendations/top/${amount}`).send({})

        const status = result.status

        expect(status).toEqual(200)

        expect(result.body.length).toBe(10)

    })

    //adicionar erros  
})