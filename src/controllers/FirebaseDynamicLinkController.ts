import axios from 'axios'
import { environment } from '../config/env'
const key = environment.firebase.webAPIKey

// See https://firebase.google.com/docs/dynamic-links/rest?authuser=0
export async function createFirebaseDynamicLink(link: string): Promise<string> {
  console.log('Creating deeplink for url ' + link)
  const resp = await axios.post(
    `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${key}`,
    {
      dynamicLinkInfo: {
        ...environment.firebase.dynamicLinkInfo,
        link,
      },
      suffix: {
        option: 'SHORT', // or change to 'UNGUESSABLE'
      },
    },
  )
  if (resp.status === 200) {
    console.log(resp.data)
    return resp.data.shortLink
  }
  throw new Error(resp.data)
}
