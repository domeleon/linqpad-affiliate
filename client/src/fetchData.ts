import { config } from "./config.js"
import type { AffiliateData } from "./types.js"

export const fetchData = async (userId: string) => {
  try {
    const response = await fetch(`${config.api.url}/${userId}`)    
    return await response.json() as AffiliateData
  }
  catch { return undefined }
}