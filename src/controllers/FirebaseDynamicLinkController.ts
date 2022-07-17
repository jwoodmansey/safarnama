import axios from 'axios'
import { environment } from '../config/env'
const key = environment.firebase.webAPIKey

export type DynamicLinkInfo = {
  domainUriPrefix?: string;
  androidInfo?: {
    androidPackageName: string
  },
  iosInfo?: {
    iosBundleId?: string,
    iosFallbackLink?: string,
    iosCustomScheme?: string,
    iosIpadFallbackLink?: string,
    iosIpadBundleId?: string,
    iosAppStoreId?: string
  },
  link?: string
}

// See https://firebase.google.com/docs/dynamic-links/rest?authuser=0
export async function createFirebaseDynamicLink(link: string, info?: DynamicLinkInfo): Promise<string> {
  console.log('Creating deeplink for url ' + link)

  const dynamicLinkInfo: DynamicLinkInfo = {
    ...environment.firebase.dynamicLinkInfo,
    androidInfo: info && info.androidInfo ? info.androidInfo : environment.firebase.dynamicLinkInfo.androidInfo,
    iosInfo: info && info.iosInfo ? info.iosInfo : undefined,
    link,
  }

  const resp = await axios.post(
    `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${key}`,
    {
      dynamicLinkInfo,
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
