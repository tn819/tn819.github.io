import type { NextApiRequest, NextApiResponse } from 'next'

export interface LetterboxdFilm {
  title: string
  link: string
  watchedDate: string
  rating?: number
  review?: string
  imageUrl?: string
  directors: string[]
  year?: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LetterboxdFilm[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const username = 'tommylvberlin'

  try {
    const rssUrl = `https://letterboxd.com/${username}/rss/`
    const response = await fetch(rssUrl, {
      headers: {
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
    })

    if (!response.ok) {
      throw new Error(`Letterboxd RSS fetch failed: ${response.status}`)
    }

    const xmlText = await response.text()
    const films = parseLetterboxdRSS(xmlText)

    res.status(200).json(films.slice(0, 6))
  } catch (error) {
    console.error('Letterboxd fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch Letterboxd data' })
  }
}

function parseLetterboxdRSS(xmlText: string): LetterboxdFilm[] {
  const films: LetterboxdFilm[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemXml = match[1]

    const title = extractTag(itemXml, 'title') || 'Unknown Film'
    const link = extractTag(itemXml, 'link') || ''
    const description = extractCdata(itemXml, 'description') || ''

    const watchedDateMatch = itemXml.match(
      /<letterboxd:watchedDate>([^<]*)<\/letterboxd:watchedDate>/
    )
    const watchedDate = watchedDateMatch ? watchedDateMatch[1] : ''

    const ratingMatch = itemXml.match(
      /<letterboxd:memberRating>([^<]*)<\/letterboxd:memberRating>/
    )
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined

    const filmTitleMatch = itemXml.match(
      /<letterboxd:filmTitle>([^<]*)<\/letterboxd:filmTitle>/
    )
    const filmTitle = filmTitleMatch ? filmTitleMatch[1] : title

    const yearMatch = itemXml.match(
      /<letterboxd:filmYear>([^<]*)<\/letterboxd:filmYear>/
    )
    const year = yearMatch ? parseInt(yearMatch[1]) : undefined

    const directors: string[] = []
    const directorMatch = description.match(/Directed by ([^<.]*)/)
    if (directorMatch) {
      directors.push(...directorMatch[1].split(',').map((d) => d.trim()))
    }

    const imgMatch = description.match(/<img[^>]+src="([^"]+)"/)
    const imageUrl = imgMatch ? imgMatch[1] : undefined

    const reviewMatch = description.match(/<p>([\s\S]*?)<\/p>/g)
    let review = ''
    if (reviewMatch && reviewMatch.length > 1) {
      review = reviewMatch[1].replace(/<[^>]*>/g, '').trim()
    }

    films.push({
      title: filmTitle,
      link,
      watchedDate,
      rating,
      review: review || undefined,
      imageUrl,
      directors,
      year,
    })
  }

  return films
}

function extractTag(xml: string, tagName: string): string | null {
  const regex = new RegExp(`<${tagName}>([^<]*)<\\/${tagName}>`, 'i')
  const match = xml.match(regex)
  return match ? match[1] : null
}

function extractCdata(xml: string, tagName: string): string | null {
  const startTag = `<${tagName}><![CDATA[`
  const endTag = `]]></${tagName}>`
  const startIndex = xml.indexOf(startTag)
  if (startIndex === -1) return null
  const endIndex = xml.indexOf(endTag, startIndex)
  if (endIndex === -1) return null
  return xml.substring(startIndex + startTag.length, endIndex)
}
