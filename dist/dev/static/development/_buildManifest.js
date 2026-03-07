self.__BUILD_MANIFEST = {
  '/articles': ['static/chunks/pages/articles.js'],
  __rewrites: {
    afterFiles: [],
    beforeFiles: [],
    fallback: [],
  },
  sortedPages: [
    '/',
    '/_app',
    '/_error',
    '/about',
    '/articles',
    '/blog',
    '/blog/welcome-ai-native-web',
  ],
}
self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()
