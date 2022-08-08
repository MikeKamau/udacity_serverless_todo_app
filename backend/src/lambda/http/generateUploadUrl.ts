import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { createAttachmentPresignedUrl, updateAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { v4 as uuid } from 'uuid'

const logger = createLogger('uploadurl')

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    logger.info('Processing upload event')
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const uploadId = uuid()

    const uploadUrl = await createAttachmentPresignedUrl(uploadId)

    await updateAttachmentUrl(userId, todoId, uploadId)
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl
      })
    }
  }


