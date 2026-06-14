import japaneseFoodData from '../public/content/japanese-food.json'
import japaneseCultureData from '../public/content/japanese-culture.json'
import japaneseHistoryData from '../public/content/japanese-history.json'
import esimData from '../public/content/esim.json'
import googleMapsData from '../public/content/google-maps.json'
import toolkitData from '../public/content/toolkit.json'

export const GUIDES: Record<string, { title: string; content: string }> = {
  'japanese-food': japaneseFoodData,
  'japanese-culture': japaneseCultureData,
  'japanese-history': japaneseHistoryData,
}

export const TOOLS: Record<string, { title: string; content: string }> = {
  'esim': esimData,
  'google-maps': googleMapsData,
  'toolkit': toolkitData,
}
