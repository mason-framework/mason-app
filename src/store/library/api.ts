import { getClient } from 'store/app/api'
import { Library as _Library } from 'store/library/proto/library'
import { Library } from 'store/library/types'


export async function getLibrary(baseUrl: string): Promise<Library> {
  const client = getClient()
  const response = client.get('/library')
  try {
    const { data } = await response
    return (data as Library)
  } catch (error) {
    console.log(error)
    return _Library.fromJSON({})
  }
}
