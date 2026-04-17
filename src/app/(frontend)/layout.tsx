import type { Metadata } from 'next'
import { Baskervville, Prompt, Playfair_Display, Poppins } from 'next/font/google'
import Script from 'next/script'
import { cn } from '@/utilities/ui'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import Footer from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { fontMap } from '@/lib/fonts'
import ThemeInit from '@/components/ThemeInit'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { SiteSettingsProvider } from '@/providers/SiteSettingsProvider'

// Load fonts
const baskervville = Baskervville({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-baskervville',
  display: 'swap',
})
const prompt = Prompt({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-prompt',
  display: 'swap',
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

// Helper to safely extract URL from media field
const getMediaUrl = (media: any): string | null => {
  if (!media) return null
  if (typeof media === 'string') return null
  return media.url || null
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'settings' })
  const footer = await payload.findGlobal({ slug: 'footer' })
  const fontPreset = settings?.typography?.fontPreset || 'luxury'
  const fonts = fontMap[fontPreset as keyof typeof fontMap] ?? fontMap.luxury
  const bodyBgColor = settings?.colors?.bodyBgColor || '#FFFFFF'
  const heroHeadingFont = settings?.hero?.headingFontFamily || 'Baskervville, serif'
  const heroSubheadingFont = settings?.hero?.subheadingFontFamily || 'Prompt, sans-serif'

  // Favicon URLs
  const favicon = getMediaUrl(settings?.branding?.favicon)
  const favicon16 = getMediaUrl(settings?.branding?.favicon16)
  const appleTouchIcon = getMediaUrl(settings?.branding?.appleTouchIcon)
  const androidChrome192 = getMediaUrl(settings?.branding?.androidChrome192)
  const androidChrome512 = getMediaUrl(settings?.branding?.androidChrome512)
  const manifest = getMediaUrl(settings?.branding?.manifest)

  // Tracking & Analytics
  const tracking = settings?.tracking || {}
  const googleAnalyticsId = tracking.googleAnalyticsId
  const googleTagManagerId = tracking.googleTagManagerId
  const metaPixelId = tracking.metaPixelId
  const customHeadScripts = tracking.customHeadScripts
  const customBodyScripts = tracking.customBodyScripts

  const fontClasses = cn(
    fonts.heading.variable,
    fonts.body.variable,
    baskervville.variable,
    prompt.variable,
    playfair.variable,
    poppins.variable,
  )

  return (
    <html
      className={fontClasses}
      lang="en"
      suppressHydrationWarning
      style={
        {
          '--font-heading': `var(${fonts.heading.variable})`,
          '--font-body': `var(${fonts.body.variable})`,
          '--hero-heading-font': heroHeadingFont,
          '--hero-subheading-font': heroSubheadingFont,
        } as React.CSSProperties
      }
    >
      <head>
        {/* Preconnects */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicons */}
        {favicon && <link rel="icon" type="image/png" sizes="32x32" href={favicon} />}
        {favicon16 && <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />}
        {appleTouchIcon && <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />}
        {androidChrome192 && (
          <link rel="icon" type="image/png" sizes="192x192" href={androidChrome192} />
        )}
        {androidChrome512 && (
          <link rel="icon" type="image/png" sizes="512x512" href={androidChrome512} />
        )}
        {manifest && <link rel="manifest" href={manifest} />}

        {/* Google Fonts loader */}
        <Script
          id="google-fonts-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function loadFont(family) {
                  if (!family || family.includes(' ')) return;
                  const firstFont = family.split(',')[0].trim();
                  if (!firstFont.includes(' ')) return;
                  const link = document.createElement('link');
                  link.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(firstFont) + ':wght@400;500;600;700&display=swap';
                  link.rel = 'stylesheet';
                  document.head.appendChild(link);
                }
                const rootStyles = getComputedStyle(document.documentElement);
                const headingFont = rootStyles.getPropertyValue('--hero-heading-font');
                const subheadingFont = rootStyles.getPropertyValue('--hero-subheading-font');
                loadFont(headingFont);
                loadFont(subheadingFont);
              })();
            `,
          }}
        />

        {/* Google Analytics (GA4) */}
        {googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}

        {/* Google Tag Manager */}
        {googleTagManagerId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${googleTagManagerId}');
              `,
            }}
          />
        )}

        {/* Meta Pixel */}
        {metaPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}

        {/* Custom head scripts */}
        {customHeadScripts && <script dangerouslySetInnerHTML={{ __html: customHeadScripts }} />}
      </head>

      <body suppressHydrationWarning style={{ backgroundColor: bodyBgColor }}>
        {/* Google Tag Manager (noscript fallback) */}
        {googleTagManagerId && (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}

        <SiteSettingsProvider settings={settings as any}>
          <ThemeInit />
          <Providers>
            <AdminBar adminBarProps={{ preview: isEnabled }} />
            <Header settings={settings} />
            <main className="w-full">{children}</main>
            <Footer footer={footer} />
          </Providers>
        </SiteSettingsProvider>

        {/* Custom body scripts */}
        {customBodyScripts && <script dangerouslySetInnerHTML={{ __html: customBodyScripts }} />}
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
