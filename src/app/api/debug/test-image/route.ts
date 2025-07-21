import { NextResponse } from 'next/server';

export async function GET() {
  // Test one of your album art URLs
  const testImageUrl = "https://i.scdn.co/image/ab67616d00001e0217696caf00b6e0ac16cbbba4";
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Image Test</title>
      <meta http-equiv="Content-Security-Policy" content="img-src 'self' data: https://i.scdn.co; default-src 'self' 'unsafe-inline' 'unsafe-eval';">
    </head>
    <body>
      <h1>Spotify Image Test</h1>
      <p>Testing image: ${testImageUrl}</p>
      <img src="${testImageUrl}" alt="Test" style="width: 200px; height: 200px;" />
      <br><br>
      <img src="${testImageUrl}" alt="Test Regular" />
    </body>
    </html>
  `;
  
  return new NextResponse(html, {
    headers: { 
      'content-type': 'text/html',
      'Content-Security-Policy': "img-src 'self' data: https://i.scdn.co; default-src 'self' 'unsafe-inline' 'unsafe-eval';"
    }
  });
}