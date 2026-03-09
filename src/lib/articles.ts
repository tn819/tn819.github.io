import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Article {
  slug: string
  title: string
  author: string
  source: string
  url: string
  description: string
  tags: string[]
  comment: string
  date: string
  published: boolean
  content: string
}

const articlesDirectory = path.join(process.cwd(), 'content/articles')

export function getAllArticles(): Article[] {
  // Ensure directory exists
  if (!fs.existsSync(articlesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(articlesDirectory)
  const allArticles = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(articlesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || '',
        author: data.author || '',
        source: data.source || '',
        url: data.url || '',
        description: data.description || '',
        tags: data.tags || [],
        comment: data.comment || '',
        date: data.date ? String(data.date) : '',
        published: data.published === true,
        content,
      }
    })

  // Filter published articles and sort by date
  return allArticles
    .filter((article) => article.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
