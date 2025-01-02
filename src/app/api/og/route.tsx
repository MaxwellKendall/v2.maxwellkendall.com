import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  // Load your custom fonts
  const inter = fetch(
    new URL('../../fonts/Inter/static/Inter_24pt-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const montserrat = fetch(
    new URL(
      '../../fonts/Montserrat/static/Montserrat-Bold.ttf',
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  const jetbrainsMono = fetch(
    new URL(
      '../../fonts/JetBrainsMono/fonts/ttf/JetBrainsMono-Bold.ttf',
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          backgroundImage: 'linear-gradient(to bottom right, #1a1a1a, #2a2a2a)',
        }}
      >
        <div
          style={{
            marginLeft: 190,
            marginRight: 190,
            display: 'flex',
            fontSize: 130,
            fontFamily: 'Inter',
            letterSpacing: '-0.05em',
            fontStyle: 'normal',
            color: 'white',
            lineHeight: '120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: await inter,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Montserrat',
          data: await montserrat,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'JetBrains Mono',
          data: await jetbrainsMono,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
