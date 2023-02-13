import './globals.css'
import Script from 'next/script'
import { GOOGLE_ANALYRICS_MEASUREMENT_ID } from '@/config'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>{children}</body>
      {GOOGLE_ANALYRICS_MEASUREMENT_ID && <Script async={true} src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYRICS_MEASUREMENT_ID}`} />}
      {GOOGLE_ANALYRICS_MEASUREMENT_ID && <Script id="onRouteChange">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', '${GOOGLE_ANALYRICS_MEASUREMENT_ID}');
      `}</Script>}


    </html>
  )
}
