addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const pathParts = url.pathname.split('/')

  if (pathParts[1] === 'secure') {
    const email = request.headers.get('cf-access-authenticated-user-email')
    const country = request.headers.get('cf-ipcountry')
    const timestamp = new Date().toISOString()

    if (pathParts.length === 3 && pathParts[2]) {
      // Handle /secure/${COUNTRY}
      const country = pathParts[2]
      const flagUrl = `https://<pub-r2-bucket>/${country}.png`
      return new Response(
        `<html><body><img src="${flagUrl}" alt="${country} flag"/></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      )
    } else {
      // Handle /secure
      const responseHTML = `
        <html>
          <body>
            <p>${email} authenticated at ${timestamp} from 
            <a href="/secure/${country}">${country}</a></p>
          </body>
        </html>
      `
      return new Response(responseHTML, { headers: { 'Content-Type': 'text/html' } })
    }
  }

  return new Response('Not Found', { status: 404 })
}

