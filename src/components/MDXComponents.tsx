import React from 'react'

import { Box, Typography, Link } from '@mui/material'

export const MDXComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Typography
      variant="h4"
      gutterBottom
      sx={{ mt: 4, mb: 2, fontWeight: 600 }}
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Typography
      variant="h5"
      gutterBottom
      sx={{ mt: 4, mb: 2, fontWeight: 600 }}
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Typography
      variant="h6"
      gutterBottom
      sx={{ mt: 3, mb: 2, fontWeight: 600 }}
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <Typography variant="body1" paragraph {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <Box component="strong" sx={{ fontWeight: 600 }} {...props} />
  ),
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isAnchor = href?.startsWith('#')
    return (
      <Link
        href={href}
        {...props}
        {...(!isAnchor && { target: '_blank', rel: 'noopener noreferrer' })}
        sx={{
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        }}
      />
    )
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <Box component="ul" sx={{ pl: 3, mb: 3 }} {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <Box component="ol" sx={{ pl: 3, mb: 3 }} {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <Typography component="li" variant="body1" sx={{ mb: 1 }} {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <Box
      component="pre"
      sx={{
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 1,
        overflow: 'auto',
        mb: 3,
        fontSize: '0.85rem',
        border: '1px solid',
        borderColor: 'divider',
      }}
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <Box
      component="code"
      sx={{
        fontFamily: 'monospace',
        fontSize: '0.9em',
      }}
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <Box
      component="blockquote"
      sx={{
        borderLeft: '4px solid',
        borderColor: 'primary.main',
        pl: 2,
        py: 0.5,
        my: 2,
        fontStyle: 'italic',
      }}
      {...props}
    />
  ),
}
