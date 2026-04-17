module.exports = async () => {
  return [
    {
      destination: '/ie-incompatible.html',
      has: [{ type: 'header', key: 'user-agent', value: '(.*Trident.*)' }],
      permanent: false,
      source: '/:path((?!ie-incompatible.html$).*)',
    },
  ]
}
