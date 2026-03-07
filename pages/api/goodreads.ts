import type { NextApiRequest, NextApiResponse } from 'next'

export interface GoodreadsBook {
  title: string
  author: string
  link: string
  coverUrl?: string
  userRating?: number
  averageRating?: number
  review?: string
  dateAdded: string
  shelf: string
  numPages?: number
  published?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GoodreadsBook[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userId = '96474981' // Your Goodreads user ID

  try {
    // Fetch currently reading
    const currentlyReadingUrl = `https://www.goodreads.com/review/list_rss/${userId}?shelf=currently-reading`
    const readUrl = `https://www.goodreads.com/review/list_rss/${userId}?shelf=read`

    const [currentlyReadingResponse, readResponse] = await Promise.all([
      fetch(currentlyReadingUrl, {
        headers: {
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
      }),
      fetch(readUrl, {
        headers: {
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
      }),
    ])

    const books: GoodreadsBook[] = []

    if (currentlyReadingResponse.ok) {
      const xmlText = await currentlyReadingResponse.text()
      const currentlyReading = parseGoodreadsRSS(xmlText, 'currently-reading')
      books.push(...currentlyReading.slice(0, 6)) // Limit to 6 currently reading
    }

    if (readResponse.ok) {
      const xmlText = await readResponse.text()
      const recentlyRead = parseGoodreadsRSS(xmlText, 'read').slice(0, 4)
      books.push(...recentlyRead)
    }

    res.status(200).json(books)
  } catch (error) {
    console.error('Goodreads fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch Goodreads data' })
  }
}

function parseGoodreadsRSS(xmlText: string, shelf: string): GoodreadsBook[] {
  const books: GoodreadsBook[] = []

  // Extract items using regex
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemXml = match[1]

    // Extract fields directly from XML tags (handling CDATA)
    const title = extractTag(itemXml, 'title') || 'Unknown Book'
    const link = extractTag(itemXml, 'link') || ''
    const author = extractTag(itemXml, 'author_name') || 'Unknown Author'
    const coverUrl = extractTag(itemXml, 'book_large_image_url')
    const userRating =
      parseInt(extractTag(itemXml, 'user_rating') || '0') || undefined
    const averageRating =
      parseFloat(extractTag(itemXml, 'average_rating') || '0') || undefined
    const dateAdded =
      extractTag(itemXml, 'user_date_added') ||
      extractTag(itemXml, 'pubDate') ||
      ''
    const numPages =
      parseInt(extractTag(itemXml, 'num_pages') || '0') || undefined
    const published = extractTag(itemXml, 'book_published') || undefined

    // Only include books with valid titles
    if (title && title !== 'Unknown Book') {
      books.push({
        title,
        author,
        link,
        coverUrl,
        userRating: userRating && userRating > 0 ? userRating : undefined,
        averageRating:
          averageRating && averageRating > 0 ? averageRating : undefined,
        dateAdded,
        shelf,
        numPages,
        published,
      })
    }
  }

  return books
}

function extractTag(xml: string, tagName: string): string | undefined {
  // Try with CDATA first
  const cdataRegex = new RegExp(
    `<${tagName}><!\\[CDATA\\[([^\\]]*)\\]\\]><\\/${tagName}>`,
    'i'
  )
  const cdataMatch = xml.match(cdataRegex)
  if (cdataMatch) {
    return cdataMatch[1].trim()
  }

  // Try without CDATA
  const regex = new RegExp(`<${tagName}>([^<]*)<\\/${tagName}>`, 'i')
  const match = xml.match(regex)
  if (match) {
    const value = match[1].trim()
    return value || undefined
  }

  return undefined
}
