import {prisma} from '../../src/database'
import { faker } from '@faker-js/faker';

export async function correctRecommendationData(){
    return {
        "name": "Falamansa - Xote dos Milagres",
        "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    }
}

export async function RecommendationDataWithNoName(){
    return {
        "name": "",
        "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    }
}

export async function RecommendationDataWithIncorrectLink(){
    return {
        "name": "Falamansa - Xote dos Milagres",
        "youtubeLink": "Charlie Brown Jr"
    }
}

export async function recommendationWithScore(qnt:number){
    const recommendations = []
    let recommendation:object
    for(let i=0;i<qnt;i++){
        recommendation = {
        "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
        "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
        "score":i
        }
        recommendations.push(recommendation)
    }
    await prisma.recommendation.createMany({
        data: recommendations
    })

    const response = await prisma.recommendation.findMany({})
    
    return response
}

export async function recomendantionsWithScore(score:number){
    const recomendation = {
        "name":"CB JR"+ faker.name.fullName(),
        "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
        "score":score
    }

    const result = await prisma.recommendation.create({
        data:recomendation
    })

    return result
}

export async function simpleRecomendation(){
        return {
        id:1,
        "name": "CB jr - Xote dos Milagres"+ faker.name.fullName(),
        "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y",
        "score":1
        }
}

