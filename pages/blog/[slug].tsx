import { GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { Page } from '../../src/components'
import { MDXComponents } from '../../src/components/MDXComponents'
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  BlogPost,
} from '../../src/lib/blog'
import { Box, Chip, Typography } from '@mui/material'

interface BlogPostPageProps {
  post: BlogPost
  mdxSource: MDXRemoteSerializeResult
}

export default function BlogPostPage({ post, mdxSource }: BlogPostPageProps) {
  return (
    <Page title={post.title} description={post.description}>
      <Box sx={{ width: '100%', maxWidth: '900px', textAlign: 'left' }}>
        {/* Tags */}
        <Box sx={{ mb: 3 }}>
          {post.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>

        {/* Summary/Comment Box — only show if comment exists or summary differs from description */}
        {(post.comment || (post.summary && post.summary !== post.description)) && (
          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 3,
              borderRadius: 2,
              mb: 4,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {post.summary && post.summary !== post.description && (
              <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                {post.summary}
              </Typography>
            )}
            {post.comment && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  💭
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {post.comment}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Date */}
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          gutterBottom
        >
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>

        {/* MDX Content */}
        <Box sx={{ mt: 4 }}>
          <MDXRemote {...mdxSource} components={MDXComponents} />
        </Box>
      </Box>
    </Page>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllBlogPosts()
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return {
      notFound: true,
    }
  }

  const mdxSource = await serialize(post.content, {
    mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
  })

  return {
    props: {
      post,
      mdxSource,
    },
  }
}
