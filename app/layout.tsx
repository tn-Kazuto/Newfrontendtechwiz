import type { Metadata } from 'next';
import {
  Playfair_Display,
  Source_Serif_4,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
  Outfit,
  Bangers,
  Kalam,
  Patrick_Hand,
} from 'next/font/google';
import './globals.css';
import { CartWishlistProvider } from '../context/CartWishlistContext';
import { AuthProvider } from '../context/AuthContext';
import { PlayerProvider } from '../context/PlayerContext';
import { DomainProvider } from '../context/DomainContext';
import { GoogleTranslate } from '../components/GoogleTranslate';
import { DomPatch } from '../components/DomPatch';
import { Suspense } from 'react';
import { DomainSelectionModal } from '../components/DomainSelectionModal';
import { AnalyticsTracker } from '../components/AnalyticsTracker';

const fontOutfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-outfit',
});

const fontPlayfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair',
});

const fontSourceSerif = Source_Serif_4({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-source-serif',
});

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
});

const fontJetBrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-jetbrains',
});

const fontBangers = Bangers({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  preload: false,
  variable: '--font-bangers',
});

const fontKalam = Kalam({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-kalam',
});

const fontPatrick = Patrick_Hand({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  preload: false,
  variable: '--font-patrick',
});

export const metadata: Metadata = {
  title: 'Fan Hub Plus | Official K-Pop Album E-Commerce & Fandom Universe',
  description:
    'Explore official K-pop albums, limited photocards, world tour tickets, and merchandise from NewJeans, BLACKPINK, BTS, Stray Kids, IVE, and aespa. Counted on Hanteo & Circle Charts.',
  keywords: 'K-Pop albums, photocards, lightsticks, NewJeans, BLACKPINK, BTS, Stray Kids, IVE, aespa, Hanteo Chart',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      translate="no"
      className={`${fontOutfit.variable} ${fontPlayfair.variable} ${fontSourceSerif.variable} ${fontSans.variable} ${fontJetBrains.variable} ${fontBangers.variable} ${fontKalam.variable} ${fontPatrick.variable} notranslate`}
    >
      <head>
        <meta name="google" content="notranslate" />
        <script
          id="dom-safeguard-patch"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined' && typeof Node === 'function' && Node.prototype) {
                  var origRemove = Node.prototype.removeChild;
                  Node.prototype.removeChild = function(child) {
                    if (!child) return child;
                    if (child.parentNode !== this) {
                      if (child.parentNode) {
                        try { return child.parentNode.removeChild(child); } catch (_) { return child; }
                      }
                      return child;
                    }
                    try {
                      return origRemove.apply(this, arguments);
                    } catch (err) {
                      try {
                        if (child.parentNode) return child.parentNode.removeChild(child);
                      } catch (_) {}
                      return child;
                    }
                  };
                  var origInsert = Node.prototype.insertBefore;
                  Node.prototype.insertBefore = function(newNode, referenceNode) {
                    if (referenceNode && referenceNode.parentNode !== this) {
                      if (referenceNode.parentNode) {
                        try { return referenceNode.parentNode.insertBefore(newNode, referenceNode); } catch (_) { return newNode; }
                      }
                      return newNode;
                    }
                    try {
                      return origInsert.apply(this, arguments);
                    } catch (err) {
                      return newNode;
                    }
                  };
                  var origReplace = Node.prototype.replaceChild;
                  Node.prototype.replaceChild = function(newChild, oldChild) {
                    if (oldChild && oldChild.parentNode !== this) {
                      if (oldChild.parentNode) {
                        try { return oldChild.parentNode.replaceChild(newChild, oldChild); } catch (_) { return oldChild; }
                      }
                      return oldChild;
                    }
                    try {
                      return origReplace.apply(this, arguments);
                    } catch (err) {
                      return oldChild;
                    }
                  };
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${fontSourceSerif.className} antialiased bg-white text-black selection:bg-black selection:text-white notranslate`} translate="no">
        <DomPatch />
        <GoogleTranslate />
        <AuthProvider>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <DomainProvider>
            <CartWishlistProvider>
              <PlayerProvider>
                {children}
                <DomainSelectionModal />
              </PlayerProvider>
            </CartWishlistProvider>
          </DomainProvider>
        </AuthProvider>
      </body>
    </html>
  );
}