import { getClient } from 'store/app/api'
import {
  ServerBlueprint,
  Geometry,
} from 'store/blueprint/io'


export interface BlueprintIO {
  blueprint: ServerBlueprint
  extras: {
    ui: Record<string, Geometry>,
  },
}


export async function getItems(): Promise<Array<string>> {
  const client = getClient()
  const response = client.get('/storage')
  try {
    const { data } = await response
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function loadBlueprint(path: string): Promise<BlueprintIO | undefined> {
  const client = getClient()
  const response = client.get(`/storage/${path}?extras=ui`)
  try {
    const { data } = await response
    return data
  } catch (error) {
    console.log(error)
    return undefined
  }
}

export async function saveBlueprint(
  path: string,
  blueprint: ServerBlueprint,
  ui: Record<string, Geometry>,
): Promise<void> {
  const client = getClient()
  const payload: BlueprintIO = {
    blueprint,
    extras: {
      ui,
    },
  }
  const response = client.post(`/storage/${path}`, payload)
  try {
    const { data } = await response
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}
