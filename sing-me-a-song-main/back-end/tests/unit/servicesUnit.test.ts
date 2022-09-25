import { prisma } from "../../src/database";
import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';


import {recommendationRepository}  from '../../src/repositories/recommendationRepository'
import  {recommendationService} from '../../src/services/recommendationsService'
import * as recommendationFactory from '../factories/recommendationsFactory'
import exp from "constants";
import { rejects } from "assert";

beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

describe('Cria uma nova recomendação', ()=>{
    it('Deve criar uma recomendação', async()=>{
        const body = recommendationFactory.simpleRecomendation()

        const recommendationData = await recommendationFactory.correctRecommendationData()
        
        jest.spyOn(recommendationRepository, 'findByName').mockImplementation(():any=>{

        })

        jest.spyOn(recommendationRepository, 'create').mockImplementation(():any=>{

        })
         await recommendationService.insert(recommendationData)

        expect(recommendationRepository.findByName).toBeCalled()

        expect(recommendationRepository.create).toBeCalled()

        //expect(recommendation).toEqual(body)
    })
})

describe('Cria upvote', ()=>{
    it('Testa upvote', async()=>{

        const data = await recommendationFactory.simpleRecomendation()

        jest.spyOn(recommendationRepository, 'find').mockImplementation(():any=>{
            return{
                id:10
            }
        })

        jest.spyOn(recommendationRepository, 'updateScore').mockImplementation(():any=>{
        })
        await recommendationService.upvote(10)

        expect(recommendationRepository.find).toBeCalled()

        expect(recommendationRepository.updateScore).toBeCalled()

        expect(recommendationRepository.updateScore).toBeCalledWith(
            10,
            "increment"
        )

    })

    it('Testa upvote com falha', async()=>{
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

        await expect(recommendationService.upvote(1)).rejects.toEqual({
            message:"",
            type: 'not_found'
        })
    })
})

describe('Cria downvote', ()=>{
    it('Testa downvote quando ocorre erro', async()=>{

        const data = await recommendationFactory.simpleRecomendation()

        const { score }=data
        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null)

        jest.spyOn(recommendationRepository, 'updateScore').mockImplementation(():any=>{
        })
        //await recommendationService.downvote(10)

        //expect(recommendationRepository.find).toBeCalled()

        //expect(recommendationRepository.updateScore).toBeCalled()

        expect(recommendationService.downvote(1)).rejects.toEqual({
            message:'',
            type:'not_found'
        })

    })

    it( 'Testa downvote com sucesso', async()=>{
        const data = await recommendationFactory.simpleRecomendation()

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(data)

        jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce(data)

        await recommendationService.downvote(data.id)

        expect(recommendationRepository.updateScore).toBeCalledTimes(1)

        expect(recommendationRepository.updateScore).toBeCalledWith(
            data.id,
            "decrement"
        )

    })
})

describe('Testa Get recommendations', ()=>{
    it('Caso de sucesso', async()=>{
        const recomendationArray = [
            {
                id:1,
                "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
                "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                "score":1
            }
        ]
        const data= await recommendationFactory.simpleRecomendation()

        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce(recomendationArray)

        const allRecommendations = await recommendationService.get()

        expect(recommendationRepository.findAll).toBeCalledTimes(1)

        expect(allRecommendations).toEqual(recomendationArray)
    })

    it('Caso de falha do get', async()=>{
      //Fazer
    })
})

describe('Get top recommendations', ()=>{
    it('Retorna caso de sucesso', async()=>{
        const recomendationArray = [
            {
                id:1,
                "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
                "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                "score":1
            }
        ]
        
        jest.spyOn(recommendationRepository,'getAmountByScore').mockResolvedValueOnce(recomendationArray)

        const allTopRecommendations = await recommendationService.getTop(1);

        expect(recommendationRepository.getAmountByScore).toBeCalledTimes(1)

        expect(allTopRecommendations).toEqual(recomendationArray)
    })
})

describe('Testa GET por id', ()=>{
    it('Retorna caso de sucesso', async()=>{
        const recomendationArray = await recommendationFactory.simpleRecomendation()
        
        jest.spyOn(recommendationRepository,'find').mockResolvedValueOnce(recomendationArray);

        const result = await recommendationService.getById(1)

        expect(recommendationRepository.find).toBeCalledTimes(1);

        expect(result).toEqual(recomendationArray)

    })

    it('Retorna caso de falha (id não encontrado)', async()=>{
        const recomendationArray = await recommendationFactory.simpleRecomendation()

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null)

        await expect(recommendationService.getById(recomendationArray.id)).rejects.toEqual({
            message:"",
            type:"not_found"
        })
    })
})

describe('Testa GET random', ()=>{
    it('Retorna caso de sucesso', async()=>{
        const recomendationArray = [
            {
                id:1,
                "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
                "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                "score":1
            },
            {
                id:2,
                "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
                "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                "score":30
            },
            {
                id:3,
                "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
                "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                "score":-5
            }
        ]

        jest.spyOn(Math, 'random').mockReturnValue(0.7)

        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([recomendationArray[0]])

        await recommendationService.getRandom()

        expect(recommendationRepository.findAll).toBeCalledTimes(1)

        expect(recommendationRepository.findAll).toBeCalledWith({
            score: 10,
            scoreFilter:'lte'
        })

    })

    it('sucesso retornando socres entre -5 e 10', async()=>{
        const recomendationArray = [
            {
                id:1,
                "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
                "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                "score":1
            },
            {
                id:2,
                "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
                "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                "score":30
            },
            {
                id:3,
                "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
                "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                "score":-5
            }
        ]
        jest.spyOn(Math, 'random').mockReturnValue(0.3)

        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([recomendationArray[0], recomendationArray[2]])
    
        await recommendationService.getRandom()
        
        expect(recommendationRepository.findAll).toBeCalledWith({
            score: 10,
            scoreFilter:'gt'
        })
    })

    it('retorna o sucesso de retorno de todos os scores maiores que 10', async()=>{
        const recomendationArray = [
            {
                id:1,
                "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
                "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                "score":1
            },
            {
                id:2,
                "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
                "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                "score":30
            },
            {
                id:3,
                "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
                "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
                "score":47
            }
        ]

        jest.spyOn(Math, 'random').mockReturnValue(0.333)

        jest.spyOn(Math, 'floor').mockReturnValue(0.333)

        jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);

        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce(recomendationArray)

        await recommendationService.getRandom()

        expect(recommendationRepository.findAll).toBeCalledTimes(2)
    })

    it('Testa erro de random', async()=>{
        jest.spyOn(Math, 'random').mockReturnValue(0.3)

        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([])

        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([])

        await expect(recommendationService.getRandom()).rejects.toEqual({
            message:"",
            type:"not_found"
        })

        expect(recommendationRepository.findAll).toBeCalledTimes(2)
    })
})