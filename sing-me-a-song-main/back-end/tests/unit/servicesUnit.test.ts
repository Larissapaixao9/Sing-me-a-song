import { prisma } from "../../src/database";
import { jest } from '@jest/globals';

import {recommendationRepository}  from '../../src/repositories/recommendationRepository'
import  {recommendationService} from '../../src/services/recommendationsService'
import * as recommendationFactory from '../factories/recommendationsFactory'
import exp from "constants";

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
