'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { mockArtists } from '../data/mockData';
import { Artist } from '../types';

interface CharacterDetail {
  name: string;
  role: string;
  personality: string;
  appearance: string;
  backstory: string;
}

interface UniverseDossier {
  universeLore: {
    title: string;
    concept: string;
    synopsis: string;
    erasOrThemes: string[];
  };
  characters: CharacterDetail[];
  catalog: {
    featuredMusic: string[];
    officialMerch: string[];
    themedBundle: {
      title: string;
      tag: string;
      items: string[];
      description: string;
    };
  };
  fanExperience: {
    fandomName: string;
    officialColors: { name: string; hex: string }[];
    fanchantSnippet: string;
    highlights: string[];
    mediaTeaser: {
      title: string;
      type: string;
      duration: string;
      description: string;
    };
    preOrderBenefits: string[];
    communityChannels: { name: string; platform: string; url: string }[];
  };
  quote: string;
  accentColor: string;
}

const UNIVERSE_DOSSIERS: Record<string, UniverseDossier> = {
  newjeans: {
    universeLore: {
      title: 'The Y2K Nostalgia Time-Capsule',
      concept: 'Easy-listening pop revival, authentic youthful camaraderie, and 90s/00s aesthetics.',
      synopsis: 'NewJeans embodies timeless simplicity like a pair of classic blue jeans you never tire of wearing. Rejecting high-concept over-the-top lore, their universe celebrates raw vulnerability, adolescent dreams, and VHS-textured school club nostalgia with fluid UK garage and Jersey club rhythms.',
      erasOrThemes: ['New Jeans Debut (Attention/Hype Boy)', 'OMG & Ditto Dual Timelines', 'Get Up (Powerpuff Girls Era)', 'How Sweet & Supernatural Groove']
    },
    characters: [
      { name: 'Minji', role: 'Leader & Vocalist', personality: 'Charismatic, composed, caring protector', appearance: 'Classic natural black hair, athletic poise, retro school aesthetic', backstory: 'The reliable eldest member who anchors the group; featured in early HYBE pre-debut music videos.' },
      { name: 'Hanni', role: 'Main Vocal & Performer', personality: 'Radiant, expressive, energetic polyglot', appearance: 'Dimpled smile, vintage beret styles, expressive fashion chameleon', backstory: 'Vietnamese-Australian multi-instrumentalist who co-wrote the lyrics for global hit "Hype Boy".' },
      { name: 'Danielle', role: 'Vocalist & Songwriter', personality: 'Warm, whimsical, optimistic Disney princess aura', appearance: 'Curled tendrils, radiant bohemian and fairycore outfits', backstory: 'Australian-Korean talent who voiced Ariel in the Korean dub of Disney\'s The Little Mermaid.' },
      { name: 'Haerin', role: 'Vocalist & Main Dancer', personality: 'Quiet observer, chic feline composure, introspective', appearance: 'Distinct cat-like eyes, sleek modern Y2K streetwear, minimal jewelry', backstory: 'Known for razor-sharp hip-hop isolations and viral cat-like charisma.' },
      { name: 'Hyein', role: 'Maknae & Vocalist', personality: 'Playful, sophisticated beyond her years, fashion muse', appearance: 'Tall runway silhouette, full lips, high-fashion retro editorial styling', backstory: 'Former child model who joined the industry at an early age; youngest Louis Vuitton global ambassador.' }
    ],
    catalog: {
      featuredMusic: ['Get Up 2nd EP (Bunny Beach Bag)', 'OMG / Ditto Maxi Single', 'How Sweet Vinyl Edition', 'Supernatural Japanese Debut Single'],
      officialMerch: ['Binky Bong Official Lightstick', 'Powerpuff Girls x NJ Photocard Binder', 'Embroidered Bunny Crossbody Bag', 'Club 90s Baseball Cap', 'Cassette Tape Player Edition'],
      themedBundle: {
        title: 'Supernatural Limited Bunny Bag Edition - Collector\'s Boxset',
        tag: 'VIP Collector Box',
        items: ['Exclusive Denim Crossbody Bunny Bag', '68-Page Photobook', '5-Member Holo Card Pack', 'Mini Disc & Lyric Postcard Set'],
        description: 'Complete nostalgic boxset packaged inside a bespoke bunny messenger bag with Japanese pop-art visual motifs.'
      }
    },
    fanExperience: {
      fandomName: 'Bunnies (Tokki)',
      officialColors: [
        { name: 'Powder Bunny Blue', hex: '#93C5FD' },
        { name: 'Pure Cotton White', hex: '#FFFFFF' },
        { name: 'Retro Denim Ink', hex: '#1E3A8A' }
      ],
      fanchantSnippet: 'Minji! Hanni! Danielle! Haerin! Hyein! We are NewJeans, always by your side!',
      highlights: [
        'Fastest K-pop group to surpass 1 Billion Spotify streams',
        'Billboard Hot 100 entries for "Ditto" and "OMG" in record time',
        'First K-pop girl group to perform at Lollapalooza Chicago (70,000+ crowd)'
      ],
      mediaTeaser: {
        title: 'Ditto (Side A / Side B) Cinematic Film',
        type: 'Narrative MV Drama',
        duration: '11:42',
        description: 'A haunting psychological exploration of youth, high school cameras, and fandom connection directed by Shin Woo-seok.'
      },
      preOrderBenefits: [
        'Exclusive Holographic Rabbit Photocard Set (5ea)',
        'Numbered Embossed Tin Club Badge',
        'Unreleased Behind-The-Scenes Filmstrip Bookmark'
      ],
      communityChannels: [
        { name: 'Phoning App', platform: 'Official App', url: 'https://phoning.onelink.me' },
        { name: 'Weverse Bunnies', platform: 'Weverse', url: 'https://weverse.io/newjeans' },
        { name: 'YouTube Official', platform: 'YouTube', url: 'https://youtube.com/@NewJeans_official' }
      ]
    },
    quote: '"Music is like denim — an everyday essential that never loses its effortless soul."',
    accentColor: '#3B82F6'
  },

  blackpink: {
    universeLore: {
      title: 'The Duality of Pink & Black',
      concept: 'Fierce feminine empowerment, stadium grandeur, and high-fashion royalty.',
      synopsis: 'BLACKPINK conquered the world by embodying two polar aesthetics: "Pink" represents delicate, charming melody and pastel elegance, while "Black" unleashes explosive swagger, lethal choreography, and bass-heavy trap anthems. Their universe portrays modern women who conquer arenas unapologetically.',
      erasOrThemes: ['Square One / As If It\'s Your Last', 'Kill This Love Revolution', 'THE ALBUM Era', 'BORN PINK World Domination']
    },
    characters: [
      { name: 'Jisoo', role: 'Lead Vocalist & Visual', personality: 'Witty 4D humor, serene mental fortitude, graceful leader vibe', appearance: 'Classic Korean royal beauty, refined haute couture dresses, deep voice', backstory: 'Global ambassador for Dior and Cartier; celebrated for her warm timbre and solo hit "Flower".' },
      { name: 'Jennie', role: 'Main Rapper & Lead Vocal', personality: 'Trendsetter, dual charismatic badass on-stage / sweet cat off-stage', appearance: 'Cat-eyed visual, Chanel tweed silhouettes, bold modern streetwear', backstory: 'Trained for 6 years; broke global records with "SOLO" and "You & Me"; founder of OA (ODDATELIER).' },
      { name: 'Rose', role: 'Main Vocalist & Lead Dancer', personality: 'Golden acoustic sensibility, indie-rock spirit, artistic romantic', appearance: 'Platinum blonde locks, Saint Laurent rocker-chic tailoring, slim frame', backstory: 'New Zealand-raised songstress whose unique vocal tone anchors BLACKPINK\'s signature bridges.' },
      { name: 'Lisa', role: 'Main Dancer & Lead Rapper', personality: 'Stage commander, infectious giggly energy, perfectionist dancer', appearance: 'Iconic bangs, model proportions, dazzling metallic stage pieces', backstory: 'Thai dancing prodigy who earned global acclaim; founder of LLOUD and MTV VMA Best K-Pop winner.' }
    ],
    catalog: {
      featuredMusic: ['BORN PINK 2nd Full Album', 'THE ALBUM Pink Tape Vinyl', 'Square Up Mini Album', 'Kill This Love Special Edition'],
      officialMerch: ['Hammer Bong Ver. 2 Official Lightstick', 'Born Pink World Tour Zip-up Hoodie', 'Stadium Concert Hardcover Photobook', 'Gentle Monster Collaboration Eyewear', 'Pink Venom Enamel Pin Set'],
      themedBundle: {
        title: 'BORN PINK Deluxe World Tour Vault - Limited Edition Boxset',
        tag: 'Numbered Limited Drop',
        items: ['Heavyweight Pink Splatter Double Vinyl', '120-Page Stage Photobook', '4-Member Acrylic Standees', 'Gold Foil Backstage Pass Replica'],
        description: 'Exquisite collector edition chronicling their historic world tour spanning 34 cities and 1.8M attendees.'
      }
    },
    fanExperience: {
      fandomName: 'BLINK',
      officialColors: [
        { name: 'Midnight Onyx', hex: '#000000' },
        { name: 'Shocking Neon Pink', hex: '#F43F5E' },
        { name: 'Soft Blush', hex: '#FBCFE8' }
      ],
      fanchantSnippet: 'Blackpink in your area! J-I-S-O-O! J-E-N-N-I-E! R-O-S-E! L-I-S-A! BLACKPINK!',
      highlights: [
        'First Asian act to headline Coachella Valley Music Festival and BST Hyde Park',
        'Most subscribed music artist on YouTube globally (94M+ subscribers)',
        'Highest-charting female Korean act on Billboard Hot 100 and Billboard 200'
      ],
      mediaTeaser: {
        title: 'Pink Venom & Shut Down Orchestral Teaser',
        type: 'Cinematic Visual Showcase',
        duration: '04:15',
        description: 'Traditional Korean geomungo strings colliding with lethal trap beats and baroque Paganini samples.'
      },
      preOrderBenefits: [
        'Silver-Foil Stadium Selfie Photocard Set',
        'Velvet Commemorative Tour Pass with Lanyard',
        'Full-size Double-Sided Rolled Satin Poster'
      ],
      communityChannels: [
        { name: 'Weverse BLINK', platform: 'Weverse', url: 'https://weverse.io/blackpink' },
        { name: 'YG Select', platform: 'Official Shop', url: 'https://ygselect.com' },
        { name: 'YouTube Official', platform: 'YouTube', url: 'https://youtube.com/@blackpinkofficial' }
      ]
    },
    quote: '"We are four distinct colors that fuse into an unstoppable force on any stage in the world."',
    accentColor: '#F43F5E'
  },

  bts: {
    universeLore: {
      title: 'The Bangtan Universe (BU) & Map of the Soul',
      concept: 'Youth tribulations, time-loop redemption, psychological self-discovery, and global unity.',
      synopsis: 'The Bangtan Universe (BU) began with the HYYH (The Most Beautiful Moment in Life) era, charting seven friends trapped in loops of pain, loneliness, and growing pains. As they matured into international icons, the narrative transformed into Carl Jung’s Map of the Soul — confronting inner shadows and ultimately choosing unconditional self-love.',
      erasOrThemes: ['The Most Beautiful Moment in Life (HYYH)', 'Wings / Blood Sweat & Tears', 'Love Yourself Trilogy', 'Map of the Soul & Proof Era']
    },
    characters: [
      { name: 'RM', role: 'Leader & Main Rapper', personality: 'Philosophical, introspective lyricist, commanding speaker', appearance: 'Sculpted profile, tailored artisanal robes, art curator aesthetic', backstory: 'Art connoisseur and IQ 148 mastermind who addressed the United Nations General Assembly twice.' },
      { name: 'Jin', role: 'Vocalist & Visual', personality: 'Worldwide Handsome humor, self-effacing warmth, emotional anchor', appearance: 'Broad shoulders, ethereal crystal features, classic prince styling', backstory: 'The eldest brother who sacrifices himself in the BU time loop to save his six brothers.' },
      { name: 'SUGA', role: 'Lead Rapper & Music Producer', personality: 'Calm exterior concealing fierce passion, razor-sharp wit', appearance: 'Pale complexion, understated black wardrobe, beanie & acoustic guitar', backstory: 'Agust D alter-ego who poured his soul into producing deeply therapeutic tracks on mental health.' },
      { name: 'j-hope', role: 'Main Dancer & Rapper', personality: 'Radiant sunshine persona with exacting choreographic perfectionism', appearance: 'Dynamic streetwear maven, fluid expressive posture, infectious grin', backstory: 'The choreography backbone of BTS and the first Korean artist to headline Lollapalooza solo.' },
      { name: 'Jimin', role: 'Lead Vocal & Main Dancer', personality: 'Tender-hearted perfectionist, ethereal grace, magnetic duality', appearance: 'Contemporary dancer lines, silver hair hues, fluid and genderless tailoring', backstory: 'Trained at Busan High School of Arts in modern dance; first Korean solo artist to top Billboard Hot 100.' },
      { name: 'V', role: 'Vocalist & Visual', personality: 'Soulful neo-jazz romantic, contemplative old soul, idiosyncratic', appearance: 'Sultry baritone gaze, vintage jazz-age suits, berets and trench coats', backstory: 'Possesses a rare rich baritone; created the iconic purple symbolism ("I Purple You / Borahae").' },
      { name: 'Jung Kook', role: 'Main Vocal & Center', personality: 'Golden Maknae, fiercely competitive, humble pop prodigy', appearance: 'Athletic frame, modern combat boots, tattoo sleeve and piercing flair', backstory: 'The all-around musical phenom whose solo debut "Seven" shattered global streaming records.' }
    ],
    catalog: {
      featuredMusic: ['Proof 3CD Anthology Box', 'Map of the Soul: 7', 'BE (Deluxe Edition)', 'Wings (The Final Studio Album)'],
      officialMerch: ['ARMY Bomb Special Edition Lightstick', 'Artist-Made Collection Pajamas & Wind Chimes', 'Proof Collector\'s Hardcover Monograph', 'BT21 Character Figures', 'Love Yourself World Tour Photobook'],
      themedBundle: {
        title: 'Proof Collector\'s Edition - Archival Hardcover Vault',
        tag: 'Heritage Boxset',
        items: ['3 Heavyweight CDs featuring Unreleased Demos', 'Outer Sleeve Luxury Box (4.5kg)', 'Archival 300-Page History Photobook', '7 Hand-Signed Fine-Art Prints'],
        description: 'The monumental anthology documenting BTS’s 9-year ascent from underground rookies to global pop emperors.'
      }
    },
    fanExperience: {
      fandomName: 'A.R.M.Y (Adorable Representative M.C for Youth)',
      officialColors: [
        { name: 'Royal Borahae Purple', hex: '#7E22CE' },
        { name: 'Imperial Platinum Silver', hex: '#E2E8F0' },
        { name: 'Deep Space Galaxy', hex: '#0F172A' }
      ],
      fanchantSnippet: 'Kim Namjoon! Kim Seokjin! Min Yoongi! Jung Hoseok! Park Jimin! Kim Taehyung! Jeon Jungkook! BTS!',
      highlights: [
        'Six #1 singles on the Billboard Hot 100 chart within a historic 13-month span',
        'Over 75 Million studio albums sold worldwide; highest-selling artists in Korean history',
        'Historic addresses at the United Nations and White House Oval Office advocating anti-Asian hate prevention'
      ],
      mediaTeaser: {
        title: 'Blood Sweat & Tears / Spring Day Cinematic Masterpieces',
        type: 'Mythological Visual Odyssey',
        duration: '06:04',
        description: 'Blending Herman Hesse’s Demian, Caravaggio paintings, and the Greek myth of Icarus into visual poetry.'
      },
      preOrderBenefits: [
        'Lenticular Holographic Unit Photocard Set',
        'Wax-Sealed Purple Heritage Certificate of Authenticity',
        'Embossed Brass Bookmark with Member Signatures'
      ],
      communityChannels: [
        { name: 'Weverse BTS', platform: 'Weverse', url: 'https://weverse.io/bts' },
        { name: 'BANGTANTV', platform: 'YouTube', url: 'https://youtube.com/@BTS' },
        { name: 'HYBE Insight', platform: 'Museum', url: 'https://hybeinsight.com' }
      ]
    },
    quote: '"Please use me, use BTS to love yourself. Because you taught me how to love myself."',
    accentColor: '#7E22CE'
  },

  straykids: {
    universeLore: {
      title: 'District 9 Resistance & Cyber Mala-Taste',
      concept: 'Self-produced experimental beats, dystopian rebellion, and unapologetic self-identity.',
      synopsis: 'Starting with their escape from the oppressive, brainwashed system of "District 9", Stray Kids built a world where outcasts embrace their chaotic noise. With their self-producing trio 3RACHA, they blend industrial hip-hop, traditional pansori, and hyper-kinetic beats into their signature addictive "Mala-taste" sound.',
      erasOrThemes: ['I am NOT / District 9 Escape', 'God\'s Menu / NOEASY Mala Era', '5-STAR Constellation Journey', 'ATE / Chk Chk Boom Global Domination']
    },
    characters: [
      { name: 'Bang Chan', role: 'Leader, Producer & Vocalist', personality: 'Fiercely protective captain, nocturnal studio workaholic, warm father figure', appearance: 'Broad muscular frame, silver chain accessories, dimpled laugh', backstory: 'Spent 7 years as a trainee before personally hand-picking all members of Stray Kids.' },
      { name: 'Lee Know', role: 'Dance Leader & Vocalist', personality: 'Razor-sharp variety humor, strict choreo captain, caring cat parent', appearance: 'Sculpted anime features, lethal acrobatic precision, playful glare', backstory: 'Former backup dancer for BTS who mastered choreography leadership within months.' },
      { name: 'Changbin', role: 'Main Rapper & Producer', personality: 'Rapid-fire rhyming prodigy, gym enthusiast, group’s vitamin of joy', appearance: 'Powerful muscular build, dark streetwear, charismatic menacing scowl', backstory: 'The sonic hammer of 3RACHA whose booming verse "Jutdae" became a cultural meme.' },
      { name: 'Hyunjin', role: 'Main Dancer & Visual', personality: 'Expressive fine artist, theatrical performer, emotionally sensitive', appearance: 'Flowing blond/black locks, dramatic stage facial expressions, Versailles prince elegance', backstory: 'Global ambassador for Versace and Cartier; known for fluid, painting-like choreography.' },
      { name: 'HAN', role: 'Main Rapper & Ace Vocalist', personality: 'Musical genius, relatable introverted gamer, rapid songwriter', appearance: 'Expressive squirrel-like cheeks, oversized cozy hoodies, live mic dynamo', backstory: 'Wrote emotional anthems in 30 minutes; effortlessly hits 4-octave rock high notes.' },
      { name: 'Felix', role: 'Lead Dancer & Rapper', personality: 'Gentle sunshine soul, prolific cookie baker, deep bass vocalist', appearance: 'Constellation of freckles, platinum fairy hair, and impossibly deep cavernous voice', backstory: 'Australian prodigy and Louis Vuitton ambassador whose viral bassline in "God\'s Menu" shocked the world.' },
      { name: 'Seungmin', role: 'Main Vocalist', personality: 'Methodical vocal student, savage dry wit, steadfast loyalty', appearance: 'Puppy-faced visual, crisp preppy collars, unwavering posture', backstory: 'Dedicated perfectionist who took daily vocal lessons years after debut to master rock-ballad resonance.' },
      { name: 'I.N', role: 'Maknae & Vocalist', personality: 'Beloved baby bread, trot vocal charm, resilient cheerful optimism', appearance: 'Desert fox eyes, stylish experimental high fashion, bright braces smile', backstory: 'Overcame vocal skepticism to become a confident Alexander McQueen fashion muse.' }
    ],
    catalog: {
      featuredMusic: ['5-STAR 3rd Studio Album', 'ROCK-STAR Mini Album', 'MAXIDENT (Case 143)', 'ATE (Chk Chk Boom)'],
      officialMerch: ['Nachimbong Ver. 2 Official Lightstick', 'SKZOO Plush Animal Avatars (Wolf Chan, BbokAri...)', '5-STAR Stadium Tour Bomber Jacket', 'Noeasy Recipe Photobook', 'Mala-Taste Acrylic Diorama'],
      themedBundle: {
        title: 'ATE Limited Accordion Deluxe Boxset',
        tag: 'Fan Edition Box',
        items: ['8 Accordion Concept Booklets', 'Secret 3RACHA Unreleased Track CD', 'Complete SKZOO Mini Badge Set', 'Lenticular Unit Selfie Cards'],
        description: 'Special accordion-style presentation loaded with spicy Mala-taste kitchen concept photography.'
      }
    },
    fanExperience: {
      fandomName: 'STAY',
      officialColors: [
        { name: 'Compass Amber Gold', hex: '#F59E0B' },
        { name: 'Obsidian District Black', hex: '#18181B' },
        { name: 'Crimson Mala Red', hex: '#DC2626' }
      ],
      fanchantSnippet: 'Stray Kids everywhere all around the world! You make Stray Kids STAY!',
      highlights: [
        'Five consecutive albums debuting at #1 on the US Billboard 200 chart',
        'First 4th-generation K-pop group to headline European festivals (I-Days Milan, BST Hyde Park)',
        'Won Best K-Pop at the MTV Video Music Awards with "S-Class"'
      ],
      mediaTeaser: {
        title: 'Chk Chk Boom & God\'s Menu Master Cut',
        type: 'Action Comedy Blockbuster MV',
        duration: '03:48',
        description: 'Featuring celebrity cameos from Ryan Reynolds and Hugh Jackman in a chaotic Marvel multiverse crossover.'
      },
      preOrderBenefits: [
        'Soundwave Lucky Draw Photocard Set',
        'Metal SKZ Dogtag Keychain with Embossed Coordinates',
        'Stray Kids Official Compass Sticker Pack'
      ],
      communityChannels: [
        { name: 'JYP FANS', platform: 'Official Community', url: 'https://fans.jype.com' },
        { name: 'Bubble for JYPnation', platform: 'Direct Chat', url: 'https://dear-u.co' },
        { name: 'YouTube Channel', platform: 'YouTube', url: 'https://youtube.com/@StrayKids' }
      ]
    },
    quote: '"Step out into our world — where the outcasts rewrite the rules of modern sound."',
    accentColor: '#F59E0B'
  },

  ive: {
    universeLore: {
      title: 'Narcissistic Glamour & Cupid Mythology',
      concept: 'Unapologetic self-love, high-fashion runway grace, and modern romantic mythology.',
      synopsis: 'IVE broke the conventional mold of "girl crush" or "innocent teen" by declaring bold, dignified self-obsession. Through irresistible synth-pop anthems, they portray modern Greek goddesses and confident young women who don\'t wait for Cupid\'s arrow — they shoot it themselves.',
      erasOrThemes: ['ELEVEN Debut Era', 'LOVE DIVE Cupid Revolution', 'After LIKE Retro Disco', 'I\'VE MINE Triple Title Tracks']
    },
    characters: [
      { name: 'An Yujin', role: 'Leader & Main Dancer', personality: 'Athletic, charismatic variety star, dependable anchor', appearance: 'Sharp modern haircut, runway model proportions, expressive gazes', backstory: 'Fendi brand ambassador and variety show queen (Earth Arcade) with stable live vocals.' },
      { name: 'Gaeul', role: 'Main Rapper & Lead Dancer', personality: 'Calm elder sister, introspective, punchy stage delivery', appearance: 'Chic bob hairstyle, understated luxury accessories, poised composure', backstory: 'The longest-training member whose "Gaeul Sunbae" moniker sparked a major trend.' },
      { name: 'Rei', role: 'Main Rapper & Vocalist', personality: 'Quirky Japanese charm, unique vocal cadence, artistic soul', appearance: 'Doll-like features, iconic "gyaru peace" originator, whimsical styling', backstory: 'Native of Nagoya who became fluent in Korean rap and writes poetic lyrics.' },
      { name: 'Jang Wonyoung', role: 'Vocalist & Center', personality: 'The undisputed Generation-4 IT Girl, unshakable professional mindset', appearance: 'Flawless porcelain visual, towering 173cm stature, haute couture Miu Miu muse', backstory: 'Pioneered the viral "Lucky Vicky" mindset of unwavering positive optimism in pop culture.' },
      { name: 'Liz', role: 'Main Vocalist', personality: 'Sweet dimpled laughter, shy acoustic singer, golden resonance', appearance: 'Platinum blonde locks, sweet dimples, soft elegant knitwear', backstory: 'Celebrated for having the most crystal-clear and emotive live vocal stability in the group.' },
      { name: 'Leeseo', role: 'Maknae & Vocalist', personality: 'Brimming with high school vitality, fearless on-stage camera hunter', appearance: 'Youthful fox visual, bright eyes, high-fashion student uniform cuts', backstory: 'Scouted while buying a drink; the youngest host of SBS Inkigayo music broadcast.' }
    ],
    catalog: {
      featuredMusic: ['I\'VE MINE 1st EP (Baddie / Off The Record)', 'I\'ve IVE Full Album', 'LOVE DIVE Single Album', 'After LIKE Vinyl Single'],
      officialMerch: ['IVE Official Cupid Lightstick', 'MINIVE Plush Character Keyrings (Ganganji, Dal-e...)', 'Prom Queen Commemorative Photobook', 'Silk Scarf & Gold Emblem Compact Mirror', 'Lenticular Tarot Card Deck'],
      themedBundle: {
        title: 'I\'VE MINE Deluxe Collector\'s Boxset',
        tag: 'Deluxe Vanity Pack',
        items: ['4 Unique Concept Photobooks', '24 Collectible Tarot Photocard Deck', 'Mini Poster Roll with Silk Ribbon', 'Silver Cupid Hairclip'],
        description: 'An opulent collector set featuring four distinct visual worlds: Baddie, Either Way, Off The Record, and Royal Dive.'
      }
    },
    fanExperience: {
      fandomName: 'DIVE',
      officialColors: [
        { name: 'Cupid Magenta', hex: '#EC4899' },
        { name: 'Champagne Royal Gold', hex: '#EAB308' },
        { name: 'Midnight Sapphire', hex: '#1E1B4B' }
      ],
      fanchantSnippet: 'An Yujin! Kim Gaeul! Naoi Rei! Jang Wonyoung! Kim Jiwon! Lee Hyunseo! I-V-E DIVE!',
      highlights: [
        'Swept Rookie of the Year and Song of the Year (Daesang) simultaneously with "LOVE DIVE"',
        'Completed their 1st World Tour "Show What I Have" across 27 global cities including arena sellouts',
        'Surpassed 5 million cumulative album sales faster than any 4th-gen girl group'
      ],
      mediaTeaser: {
        title: 'Either Way & Baddie Dual Concept Cinema',
        type: 'Cinematic Dual MV',
        duration: '07:22',
        description: 'A poetic contrast between raw vulnerable teardrops in London and playful rebellious anti-heroines in Seoul.'
      },
      preOrderBenefits: [
        'Exclusive Withmuu Selfie POB Photocard Set',
        'Golden Ticket Replica to IVE Prom Queen Ball',
        'Die-cut MINIVE Sticker Collection'
      ],
      communityChannels: [
        { name: 'Daum Fan Cafe', platform: 'Official Cafe', url: 'https://cafe.daum.net/IVEstarship' },
        { name: 'Starship Square', platform: 'Official Shop', url: 'https://starship-square.com' },
        { name: 'YouTube Official', platform: 'YouTube', url: 'https://youtube.com/@IVEstarship' }
      ]
    },
    quote: '"Narcissistic, my god I love it — true radiance starts from cherishing who you are."',
    accentColor: '#EC4899'
  },

  aespa: {
    universeLore: {
      title: 'SMCK Kwangya & ae-Avatar Synk Dive',
      concept: 'Metaverse cyberpunk, digital twins (ae), trans-dimensional portal warfare, and hyper-pop.',
      synopsis: 'aespa operates under the revolutionary concept: "Meeting another self through an avatar and experiencing a new world." Grounded in the SM Culture Universe (SMCU), the members connect with their virtual counterparts ("ae") via the P.O.S portal to battle the Black Mamba in Kwangya, later ascending into the multiverse of Armageddon.',
      erasOrThemes: ['Black Mamba / Next Level Synk', 'Savage / Girls in Kwangya', 'My World / Real World Return', 'Armageddon / Supernova Multiverse']
    },
    characters: [
      { name: 'Karina', role: 'Leader, Main Dancer & Lead Rapper', personality: 'AI-level perfection, protective caring mother hen, playful gamer', appearance: 'Unreal sharp jawline, high ponytail, cyber armor and high-tech weaponry', backstory: 'Her avatar is ae-Karina; represents the central pillar connecting the digital flatland to reality.' },
      { name: 'Giselle', role: 'Main Rapper & Vocalist', personality: 'Trilingual flow, chill Tokyo/Seoul cool girl, razor wit', appearance: 'Hip-hop streetwear couture, neon cyber-tinted sunglasses, effortless swagger', backstory: 'Possesses the "Xenoglossy" ability to communicate with all digital languages and beings in Kwangya.' },
      { name: 'Winter', role: 'Lead Vocalist & Visual', personality: 'Razor-sharp martial arts stage aura, comedic softie off-camera', appearance: 'Short sleek bob, cool-toned platinum locks, high-octane swordsman stance', backstory: 'Possesses the "Armamenter" ability; wields laser swords and martial cyber-weaponry.' },
      { name: 'Ningning', role: 'Main Vocalist', personality: 'Fearless R&B diva, high-fashion muse, infectious laughter', appearance: 'Cat-eyed glamour, avant-garde Versace gowns, powerful vocal posture', backstory: 'Possesses the "E.d Hacker" ability; can manipulate digital code and energy grids at will.' }
    ],
    catalog: {
      featuredMusic: ['Armageddon 1st Full Album (CD Player Edition)', 'Drama 4th Mini Album', 'My World 3rd Mini Album', 'Savage 1st Mini Album'],
      officialMerch: ['aespa Official Lightstick with Custom Avatar Emblems', 'Armageddon Portable CD Player (Real Working Hardware!)', 'Synk Dive Cyberpunk Hoodie', 'ae-Character Plush Keyrings', 'Holographic Acrylic Diorama Stand'],
      themedBundle: {
        title: 'Armageddon CDP (CD Player) Collector\'s Limited Edition',
        tag: 'Legendary Tech Drop',
        items: ['Fully Functional Custom Bluetooth CD Player Hardware', 'Exclusive CD with 10 Master Tracks', '5 Metallic Hologram Photocards', 'Sticker Sheet & Cyber Wired Earphones'],
        description: 'The viral phenomenon that sold out in 3 seconds worldwide: a retro futuristic CD player built specifically to play the album.'
      }
    },
    fanExperience: {
      fandomName: 'MY (The Most Precious Friend in Kwangya)',
      officialColors: [
        { name: 'Aurora Cyber Violet', hex: '#8B5CF6' },
        { name: 'Digital Matrix Mint', hex: '#10B981' },
        { name: 'Cosmic Obsidian', hex: '#09090B' }
      ],
      fanchantSnippet: 'Karina! Giselle! Winter! Ningning! ae-spa! Synk Out!',
      highlights: [
        'Achieved historic Perfect All-Kill (PAK) with smash hit "Supernova"',
        'First K-pop girl group invited to walk the red carpet at the Cannes Film Festival',
        'Sold out Tokyo Dome in record time for two consecutive world tours'
      ],
      mediaTeaser: {
        title: 'Supernova & Armageddon Sci-Fi Blockbuster',
        type: 'Cinematic CGI Masterwork',
        duration: '08:30',
        description: 'Multiverse collisions, telekinetic cars flying through apartment towers, and interstellar battle choreography.'
      },
      preOrderBenefits: [
        'Metallic Circuit-Board Finish Photocard Set',
        'Black Mamba Hologram Scale Sticker Sheet',
        'Digital Access Key to KWANGYA Virtual Gallery'
      ],
      communityChannels: [
        { name: 'Weverse aespa', platform: 'Weverse', url: 'https://weverse.io/aespa' },
        { name: 'SM Global Shop', platform: 'Official Merch', url: 'https://smglobalshop.com' },
        { name: 'YouTube Official', platform: 'YouTube', url: 'https://youtube.com/@aespa' }
      ]
    },
    quote: '"I bring, bring all the drama-ma-ma — we exist simultaneously across every digital reality."',
    accentColor: '#8B5CF6'
  },

  'demon-slayer': {
    universeLore: {
      title: 'Taisho Era Demon Slayer Corps vs. Muzan Kibutsuji',
      concept: 'Breathing sword techniques, tragic demons, unbreakable family bonds, and human mortal resolve.',
      synopsis: 'Set in Taisho-era Japan, young Tanjiro Kamado returns home to find his family slaughtered by demons and his sister Nezuko turned into one. Joining the clandestine Demon Slayer Corps, he masters the lost Sun Breathing art, swearing to slay the Demon Progenitor Muzan Kibutsuji and restore Nezuko’s humanity.',
      erasOrThemes: ['Final Selection & Tsuzumi Mansion', 'Mugen Train Arc', 'Entertainment District Fireworks', 'Swordsmith Village & Infinity Castle']
    },
    characters: [
      { name: 'Tanjiro Kamado', role: 'Sun Breathing Swordsman', personality: 'Compassionate, unwavering resolve, empathetic even to dying demons', appearance: 'Checkered green/black haori, hanafuda earrings, forehead scar', backstory: 'Eldest son of a charcoal maker who inherited the legendary Hinokami Kagura dance.' },
      { name: 'Nezuko Kamado', role: 'Demon Sister', personality: 'Protective, gentle, fiercely shields innocent humans despite her demon blood', appearance: 'Pink patterned kimono, bamboo muzzle, glowing pink demonic eyes', backstory: 'The only demon who retains her human heart without feeding on human flesh.' },
      { name: 'Zenitsu Agatsuma', role: 'Thunder Breathing Swordsman', personality: 'Cowardly and loud when awake; unconscious lightning-fast god when asleep', appearance: 'Yellow triangular-pattern haori, spiky yellow hair, gold Nichirin blade', backstory: 'Struck by actual lightning while training; perfected Thunder Breathing First Form to blinding speed.' },
      { name: 'Inosuke Hashibira', role: 'Beast Breathing Berserker', personality: 'Hot-headed, feral, prideful warrior who secretly values friendship', appearance: 'Feral boar head mask, bare chest, twin chipped serrated Nichirin swords', backstory: 'Raised by mountain boars; invented his own instinctive animalistic sword techniques.' },
      { name: 'Kyojuro Rengoku', role: 'Flame Hashira', personality: 'Fiery enthusiasm, noble honor, set-your-heart-ablaze moral code', appearance: 'Flamboyant flame-patterned cape, blazing yellow-red hair, booming voice', backstory: 'Died protecting 200 passengers on the Mugen Train without losing a single human life.' }
    ],
    catalog: {
      featuredMusic: ['Demon Slayer Symphonic Orchestra Live 2CD', 'Gurenge / Homura Master Vinyl Single (LiSA)', 'Zankyosanka / Asahi EP (Aimer)', 'Kamado Tanjiro Risshi-hen OST'],
      officialMerch: ['Proplica 1:1 Scale Sound-Emitting Nichirin Sword', 'Aniplex+ 1/8 Scale Rengoku Flame Battle Figure', 'Corps Uniform Haori Kimono Replicas', 'Nezuko Bamboo Handcrafted Wooden Box', 'Hanafuda Earring Replica Set'],
      themedBundle: {
        title: 'Mugen Train Deluxe Memorial Soundtrack Boxset',
        tag: 'Orchestral Boxset',
        items: ['3-Disc Uncut Orchestral Score by Yuki Kajiura & Go Shiina', 'Infinity Train Embossed Brass Replica Ticket', 'Rengoku Memorial Acrylic Flame Diorama', 'ufotable Original Keyframe Sketchbook'],
        description: 'A tribute to the highest-grossing anime film of all time, packaged in a cedar wood gift casket.'
      }
    },
    fanExperience: {
      fandomName: 'Demon Slayer Corps (Kisatsutai)',
      officialColors: [
        { name: 'Hanafuda Crimson', hex: '#DC2626' },
        { name: 'Sun Breathing Gold', hex: '#EAB308' },
        { name: 'Corps Night Indigo', hex: '#1E1B4B' }
      ],
      fanchantSnippet: 'Set your heart ablaze! Overcome your limits! For humanity and family!',
      highlights: [
        'Mugen Train became the highest-grossing Japanese film in history ($507 Million worldwide)',
        'Won Anime of the Year multiple times for ufotable’s groundbreaking fluid CGI animation',
        'Manga surpassed 150 million copies in circulation worldwide'
      ],
      mediaTeaser: {
        title: 'Infinity Castle Trilogy Official World Premiere Trailer',
        type: 'Cinematic Movie Trailer',
        duration: '02:45',
        description: 'The monumental three-part cinematic climax animated by ufotable as the Corps breaches Muzan\'s shifting fortress.'
      },
      preOrderBenefits: [
        'ufotable Gold-Foil Shikishi Art Board',
        'Die-cut Metal Corps Rank Badge (Mizunoto to Hashira)',
        'Double-sided Clear Nichirin Blade Bookmark'
      ],
      communityChannels: [
        { name: 'Aniplex Official Portal', platform: 'Official Web', url: 'https://demonslayer-anime.com' },
        { name: 'ufotable Cafe', platform: 'Events', url: 'http://www.ufotable.com/cafe' },
        { name: 'Demon Slayer Reddit', platform: 'Community', url: 'https://reddit.com/r/KimetsuNoYaiba' }
      ]
    },
    quote: '"Set your heart ablaze. Grit your teeth and look straight ahead. Time will not wait for your tears."',
    accentColor: '#DC2626'
  },

  'one-piece': {
    universeLore: {
      title: 'The Great Pirate Era & The Void Century',
      concept: 'Unbounded freedom, found family nakama, anti-authoritarian revolt, and ancient history.',
      synopsis: 'Executing legendary Pirate King Gol D. Roger ignited the Great Pirate Era. Monkey D. Luffy sets sail in a tiny dinghy to assemble the Straw Hat Pirates, navigate the perilous Grand Line, discover the legendary treasure "One Piece", and awaken the ancient warrior of liberation, Sun God Nika.',
      erasOrThemes: ['East Blue & Alabasta Saga', 'Enies Lobby & Marineford Summit War', 'Dressrosa & Wano Country Climax', 'Egghead Future Island & Final Saga']
    },
    characters: [
      { name: 'Monkey D. Luffy', role: 'Captain & Emperor of the Sea', personality: 'Free-spirited, meat lover, fiercely loyal, awakens laughter in all', appearance: 'Iconic straw hat, red vest, scar beneath left eye, white cloud Gear 5 hair', backstory: 'Ate the Mythical Zoan Hito Hito no Mi, Model: Nika; fights for the day everyone can eat as much as they want.' },
      { name: 'Roronoa Zoro', role: 'First Mate & Master Swordsman', personality: 'Stoic, hopelessly directionally challenged, iron bushido loyalty', appearance: 'Three swords at his hip, green haramaki, scar over left eye, green hair', backstory: 'Aiming to become the World\'s Greatest Swordsman to fulfill a sacred childhood promise to Kuina.' },
      { name: 'Nami', role: 'Navigator & Strategist', personality: 'Money-minded genius, compassionate heart for children, weather expert', appearance: 'Orange hair, weather Clima-Tact rod, stylish nautical attire', backstory: 'Drew maps under torture by Arlong; dedicated to mapping the entire world’s oceans.' },
      { name: 'Sanji', role: 'Chef & Martial Artist', personality: 'Chivalrous gentleman, culinary artisan, fiery kicks', appearance: 'Black double-breasted suit, blonde parted hair, curled eyebrow', backstory: 'Prince of the Germa 66 Kingdom who rejected his emotionless lineage to master cooking at the Baratie.' },
      { name: 'Uta', role: 'Diva of Elegance', personality: 'Passionate, idealistic singer yearning to create a world without suffering', appearance: 'Half-red half-white hair, angelic wings, modern techno-pop headset', backstory: 'Daughter of Emperor Red-Haired Shanks whose Sing-Sing fruit can transport souls into a song dimension.' }
    ],
    catalog: {
      featuredMusic: ['Film RED: Uta no Uta Full Album (by Ado)', 'One Piece 25th Anniversary Orchestral Suite', 'We Are! Historical Single Collection', 'Wano Kuni Epic Traditional BGM'],
      officialMerch: ['Banpresto Chronicle Gear 5 Luffy Statue', 'Straw Hat Pirates 1:1 Scale Embroidered Jolly Roger', 'Chogokin Thousand Sunny Ship Model with Secret Soldier Dock', 'Bounty Wanted Poster Brass Metal Plates', 'Gomu Gomu no Mi 1:1 Devil Fruit Replica'],
      themedBundle: {
        title: 'Film RED Collector\'s Limited 4K Trunk Box',
        tag: 'Legendary Trunk',
        items: ['4K UHD Film RED Steelbook', 'Uta no Uta Colored Vinyl LP', 'Replica 3 Billion Berry Bounty Poster of Shanks', 'Ado Concert Live Photo Diary'],
        description: 'Packaged in a miniature pirate treasure trunk finished with leather straps and brass corner guards.'
      }
    },
    fanExperience: {
      fandomName: 'Straw Hat Pirates (Nakama)',
      officialColors: [
        { name: 'Pirate Gold', hex: '#F59E0B' },
        { name: 'Grand Line Ocean Blue', hex: '#2563EB' },
        { name: 'Straw Hat Scarlet', hex: '#DC2626' }
      ],
      fanchantSnippet: 'I’m gonna become the King of the Pirates! We Are Nakama!',
      highlights: [
        'Guinness World Record for the most copies published for the same comic book series by a single author (516M+ copies)',
        'Film RED generated over $246 Million at the worldwide box office',
        'Over 27 continuous years of weekly serializations captivating three generations of readers'
      ],
      mediaTeaser: {
        title: 'Gear 5 Awakening & New Genesis Live Cut',
        type: 'Animation Masterpiece & Live Vocals',
        duration: '04:50',
        description: 'Luffy’s heartbeat drums of liberation accompanied by Ado’s explosive vocal performance.'
      },
      preOrderBenefits: [
        'Gold-foil Straw Hat Crest Metal Pin Badge',
        'Replica 3-Billion Berry Luffy Wanted Poster (Heavy Cardstock)',
        'Miniature Poneglyph Rubbing Postcard'
      ],
      communityChannels: [
        { name: 'One Piece Official', platform: 'Portal', url: 'https://one-piece.com' },
        { name: 'Shonen Jump+', platform: 'Manga App', url: 'https://shonenjumpplus.com' },
        { name: 'One Piece Card Game', platform: 'TCG Community', url: 'https://en.onepiece-cardgame.com' }
      ]
    },
    quote: '"If you don’t take risks, you can’t create a future. A man’s dream will never die!"',
    accentColor: '#F59E0B'
  },

  ghibli: {
    universeLore: {
      title: 'Enchanted Hand-Drawn Realms of Spirits & Nature',
      concept: 'Shinto animism, anti-war pacifism, nostalgic environmentalism, and aviation wonder.',
      synopsis: 'Under the visionary direction of Hayao Miyazaki and legendary composer Joe Hisaishi, Studio Ghibli crafted cinematic universes bathed in watercolor skies, bathhouses populated by deities, mechanical walking castles, and gentle forest protectors. Their stories remind humanity of the sacred magic lingering in untouched nature.',
      erasOrThemes: ['Nausicaä & Laputa Castle in the Sky', 'My Neighbor Totoro & Kiki\'s Delivery', 'Princess Mononoke & Spirited Away', 'Howl\'s Moving Castle & The Boy and the Heron']
    },
    characters: [
      { name: 'Hayao Miyazaki', role: 'Founding Director & Visionary', personality: 'Tireless animator, deeply contemplative, passionate lover of vintage flight', appearance: 'Classic white beard, black-rimmed spectacles, work apron with pencil in hand', backstory: 'Two-time Academy Award-winning animation director who preserved hand-drawn artistry in the digital age.' },
      { name: 'Joe Hisaishi', role: 'Maestro Composer', personality: 'Poetic, emotionally resonant piano virtuoso, maestro conductor', appearance: 'Tuxedo elegance, warm smile, gentle conducting hand movements', backstory: 'Composed iconic symphonic scores for nearly every Miyazaki masterpiece across four decades.' },
      { name: 'Totoro', role: 'Great Forest Guardian Spirit', personality: 'Gentle, sleepy giant who watches over ancient camphor trees and lost children', appearance: 'Furry gray rotund body, pointed ears, wide toothy grin, leaf umbrella', backstory: 'Ancient forest keeper accessible only to children whose hearts are pure and innocent.' },
      { name: 'Chihiro & Haku', role: 'Courageous Girl & River Deity Dragon', personality: 'Resilient growth, unconditional love, honoring one\'s sacred true name', appearance: 'Simple schoolgirl clothes turning into bathhouse robes; sleek silver-green dragon form', backstory: 'Navigated Yubaba\'s spirit bathhouse to rescue Chihiro\'s parents from a beastly spell.' },
      { name: 'Howl Jenkins', role: 'Wizard of the Moving Castle', personality: 'Flamboyant, vain, romantic sorcerer resisting state war machines', appearance: 'Jeweled earring, feather-adorned coats, blonde-turned-raven locks, swallow demon form', backstory: 'Traded his human heart to fire demon Calcifer in exchange for miraculous magic.' }
    ],
    catalog: {
      featuredMusic: ['Spirited Away Orchestral Suite LP', 'My Neighbor Totoro Master Vinyl Edition', 'Howl\'s Moving Castle Symphonic Band', 'The Boy and the Heron Original Score (Joe Hisaishi)'],
      officialMerch: ['Cast-Bronze Ghibli Museum Clock', 'Fluffy Giant Totoro Beanbag Plush', 'Calcifer Cast-Iron Cooking Skillet', 'Spirited Away Handcrafted Music Box (Always With Me)', 'Princess Mononoke Wolf God Kodama Glow Figures'],
      themedBundle: {
        title: 'Joe Hisaishi Symphonic Concert at Budokan - 35-Year Anniversary Master Vinyl Boxset',
        tag: 'Fine-Art Vault',
        items: ['5 Heavyweight Colored Vinyl Records', 'Full Orchestral Conductor Score Book', 'Authentic 35mm Celluloid Film Strip Frame', 'Linen-Wrapped Embossed Slipcase'],
        description: 'The definitive audio tribute recorded live with a 200-piece orchestra and 400-voice choir.'
      }
    },
    fanExperience: {
      fandomName: 'Ghibli Dreamers',
      officialColors: [
        { name: 'Ancient Forest Moss', hex: '#15803D' },
        { name: 'Miyazaki Sky Cerulean', hex: '#38BDF8' },
        { name: 'Warm Terracotta Brick', hex: '#B45309' }
      ],
      fanchantSnippet: 'Always with me, listening to the whispers of the wind and ancient trees.',
      highlights: [
        'Academy Award Winner for Best Animated Feature (Spirited Away and The Boy and the Heron)',
        'First Japanese animation studio to receive the Honorary Palme d\'Or at Cannes',
        'Beloved worldwide across multiple generations for hand-drawn aesthetic integrity'
      ],
      mediaTeaser: {
        title: 'Joe Hisaishi Conducts Ghibli Orchestra Live at Royal Albert Hall',
        type: 'Symphonic Live Concert',
        duration: '09:12',
        description: 'Legendary performance featuring sweeping strings, grand brass fanfares, and delicate piano melodies.'
      },
      preOrderBenefits: [
        'Authentic 35mm Celluloid Master Film Cell in Protective Display Frame',
        'Ghibli Park Commemorative Metal Key Replica',
        'Embossed Watercolor Postcard Set by Studio Ghibli Background Artists'
      ],
      communityChannels: [
        { name: 'Ghibli Museum Tokyo', platform: 'Museum', url: 'https://ghibli-museum.jp' },
        { name: 'Ghibli Park Official', platform: 'Park', url: 'https://ghibli-park.jp' },
        { name: 'Joe Hisaishi Official', platform: 'Maestro Portal', url: 'https://joehisaishi.com' }
      ]
    },
    quote: '"Many of my movies have strong female leads — brave, self-sufficient girls who don\'t think twice about fighting for what they believe in."',
    accentColor: '#15803D'
  },

  'spider-verse': {
    universeLore: {
      title: 'The Spider-Society & Multiversal Canon Events',
      concept: 'Interdimensional web of life, breaking predestined tragedies, and groundbreaking mixed-media animation.',
      synopsis: 'Brooklyn teenager Miles Morales is bitten by a radioactive spider from Earth-42. Discovering the Multiverse, he joins the Spider-Society — an alliance of web-slingers guarding timeline integrity. When told that tragedy is an unavoidable "canon event" required to save reality, Miles rebels, refusing to sacrifice those he loves.',
      erasOrThemes: ['Into the Spider-Verse (Leap of Faith)', 'Across the Spider-Verse (Spider-Society)', 'Earth-42 Anomaly & The Prowler', 'Beyond the Spider-Verse']
    },
    characters: [
      { name: 'Miles Morales', role: 'Spider-Man of Earth-1610', personality: 'Artistic graffiti prodigy, compassionate, fiercely loyal to his family', appearance: 'Spray-painted black & red suit, Nike Air Jordan 1s, hoodie and shorts', backstory: 'The unexpected spider-hero who learned to take his own leap of faith without fear.' },
      { name: 'Gwen Stacy', role: 'Spider-Woman of Earth-65', personality: 'Punk-rock drummer, balletic poise, protective, emotionally conflicted', appearance: 'Teal ballet slippers, white hooded suit with pink/purple watercolor webbing', backstory: 'Daughter of police captain Stacy who struggles with the tragic death of her universe\'s Peter Parker.' },
      { name: 'Miguel O\'Hara', role: 'Spider-Man 2099', personality: 'Stoic, grim, militaristic guardian burdened by timeline collapse guilt', appearance: 'Towering muscular frame, razor-sharp talons, holographic blue-red nanotech suit', backstory: 'Founder of the Spider-Society who enforces the rigid defense of multiversal canon events.' },
      { name: 'Hobie Brown', role: 'Spider-Punk of Earth-138', personality: 'Anti-establishment anarchist, cool, effortlessly stylish mentor', appearance: 'Spiked mohawk mask, studded leather battle vest, custom electric bass guitar', backstory: 'Anarchist hero animated at varying frame rates who covertly assists Miles in breaking the system.' },
      { name: 'Peter B. Parker', role: 'Earth-616 Veteran Spider-Man', personality: 'World-weary mentor, warm dad humor, bathrobe-wearing veteran', appearance: 'Tired eyes, baby carrier with Mayday Parker on his chest, vintage trench coat', backstory: 'Recovered from life burnout after mentoring Miles, discovering the joys of fatherhood.' }
    ],
    catalog: {
      featuredMusic: ['Metro Boomin Presents: Across the Spider-Verse LP', 'Into the Spider-Verse Soundtrack (Post Malone)', 'Daniel Pemberton Orchestral Synth Score Vinyl', 'Am I Dreaming / Mona Lisa Singles'],
      officialMerch: ['Sentinel SV-Action Miles Morales Articulated Figure', 'Nike Air Jordan 1 "Next Chapter" Collectible Sneakers', 'Multiverse Go-Home Watch Prop Replica', 'Spider-Punk Embroidered Denim Vest', 'Mondo Screenprinted Comic Foil Posters'],
      themedBundle: {
        title: 'Across the Spider-Verse 3LP Colored Vinyl Deluxe Boxset',
        tag: 'Hip-Hop Multiverse Box',
        items: ['3 Heavyweight Multi-Colored Splatter Vinyls', 'Concept Sketchbook by Visual Directors', 'Embossed Earth Dimension Transit Pass', 'Spider-Society Die-cast Enamel Pin'],
        description: 'Produced in collaboration with Metro Boomin, featuring exclusive unreleased instrumental mixes.'
      }
    },
    fanExperience: {
      fandomName: 'Spider-Society',
      officialColors: [
        { name: 'Neon Spray Red', hex: '#EF4444' },
        { name: 'Electric Cyan Web', hex: '#06B6D4' },
        { name: 'Hobie Punk Magenta', hex: '#E11D48' }
      ],
      fanchantSnippet: 'Everyone keeps telling me how my story is supposed to go. Nah, I\'mma do my own thing!',
      highlights: [
        'Won the Academy Award for Best Animated Feature (Into the Spider-Verse)',
        'Soundtrack album executive produced by Metro Boomin reached #1 on Billboard Top R&B/Hip-Hop',
        'Revolutionized global cinema animation by blending traditional hand-drawn comic halftones with 3D CGI'
      ],
      mediaTeaser: {
        title: 'Metro Boomin - Am I Dreaming & Mona Lisa Studio Teaser',
        type: 'Music & Film Collaboration',
        duration: '04:18',
        description: 'Deep orchestral cello basslines seamlessly fusing with modern 808 beats and multi-dimensional animation.'
      },
      preOrderBenefits: [
        'Multiversal Earth-1610 Dimensional Transit Card',
        'Street-Art Spraycan Cap Keyring with Laser Engraving',
        'Holographic Comic Cover Variant Art Print'
      ],
      communityChannels: [
        { name: 'Sony Animation', platform: 'Studio', url: 'https://sonypicturesanimation.com' },
        { name: 'Spider-Verse Community', platform: 'Reddit', url: 'https://reddit.com/r/SpiderVerse' },
        { name: 'Metro Boomin Official', platform: 'Music Hub', url: 'https://metroboomin.net' }
      ]
    },
    quote: '"Everyone keeps telling me how my story is supposed to go. Nah... I’mma do my own thing."',
    accentColor: '#EF4444'
  },

  dune: {
    universeLore: {
      title: 'The Arrakis Spice Imperium & Desert Prophecy',
      concept: 'Feudal space politics, ecological preservation, religious messianism, and giant sandworms.',
      synopsis: 'The desert planet Arrakis is the sole source of the Spice Melange — the sacred substance that extends human lifespan and enables faster-than-light space navigation. When House Atreides is betrayed by House Harkonnen, young Duke Paul Atreides unites the indigenous Fremen warriors to claim the imperial throne.',
      erasOrThemes: ['House Atreides Fall on Arrakis', 'Fremen Desert Survival & Sietch Tabr', 'Sandworm Riding (Shai-Hulud)', 'The Holy Desert Jihad']
    },
    characters: [
      { name: 'Paul Atreides / Muad\'Dib', role: 'Kwisatz Haderach & Desert Messiah', personality: 'Haunted by prophetic visions, reluctant conqueror, razor intellect', appearance: 'Dark curly hair, piercing blue-within-blue spice eyes, Fremen stillsuit', backstory: 'Trained in Bene Gesserit prana-bindu disciplines and Atreides military leadership.' },
      { name: 'Chani', role: 'Fremen Fedaykin Warrior', personality: 'Fierce warrior, skeptical of imported prophecies, passionate moral compass', appearance: 'Weather-beaten desert robes, crysknife at her waist, glowing sapphire eyes', backstory: 'Northern Fremen scout who taught Paul the desert ways and sand-walking steps.' },
      { name: 'Hans Zimmer', role: 'Mastermind Composer', personality: 'Pioneering sound sculptor, relentless acoustic experimenter', appearance: 'All-black studio elegance, piano conductor presence', backstory: 'Invented entirely novel instruments and vocal languages to imagine soundscapes of another planet.' },
      { name: 'Denis Villeneuve', role: 'Visionary Director', personality: 'Brutalist architect of cinema, atmospheric titan, reverent to literature', appearance: 'Quiet commanding presence on massive Jordan desert sets', backstory: 'Brought Frank Herbert’s supposedly "unfilmable" sci-fi epic to historic cinematic life.' }
    ],
    catalog: {
      featuredMusic: ['Dune: Part Two Original Motion Picture Soundtrack', 'The Dune Sketchbook (Extended Experimental Suite)', 'Hans Zimmer Live in Prague Double LP', 'Soundtrack of the Desert 2CD Edition'],
      officialMerch: ['Hand-Carved Crysknife Sandworm Tooth Replica Prop', 'House Atreides Heavy Brass Signet Ring', 'Shai-Hulud Sandworm Resin Tabletop Sculpture', 'Authentic Desert Spice Sand Glass Hourglass', 'Stillsuit Filtration Mask Display Model'],
      themedBundle: {
        title: 'Dune: Part Two Collector\'s Sand-Filled Vinyl Edition',
        tag: 'Spice Vault',
        items: ['2LP Sand-Filled Colored Vinyls (Authentic Desert Color)', 'Chakobsa Fremen Language Field Guide', 'Embossed Atreides Wax Stamp & Red Sealing Wax', 'Behind the Lens Hardcover Art Book'],
        description: 'A heavyweight luxury collector\'s boxset filled with genuine sand aesthetic accents and foil-stamped glyphs.'
      }
    },
    fanExperience: {
      fandomName: 'Fremen / Fedaykin',
      officialColors: [
        { name: 'Desert Spice Amber', hex: '#D97706' },
        { name: 'Eyes of Ibad Deep Blue', hex: '#0284C7' },
        { name: 'Basalt Rock Charcoal', hex: '#1C1917' }
      ],
      fanchantSnippet: 'Long live the fighters! Bi-la kaifa! Power over spice is power over all!',
      highlights: [
        'Hans Zimmer won the Academy Award for Best Original Score for Dune: Part One',
        'Part Two received widespread acclaim as the definitive modern space epic',
        'Frank Herbert’s literary masterpiece revitalized for a new generation of millions'
      ],
      mediaTeaser: {
        title: 'Hans Zimmer: The Sound of Arrakis Orchestral Masterclass',
        type: 'Acoustic Documentary & Track Teaser',
        duration: '06:14',
        description: 'Custom female vocal choirs, scraped metal horns, and bagpipes recording the soundtrack of holy war.'
      },
      preOrderBenefits: [
        'House Atreides Golden Signet Seal Wax Stamp',
        'Arrakis Sand Specimen Vial with Certification Plaque',
        'Chakobsa Script Foil-Printed Fabric Bookmark'
      ],
      communityChannels: [
        { name: 'Legendary Pictures', platform: 'Studio', url: 'https://legendary.com' },
        { name: 'Dune Official Website', platform: 'Movie Hub', url: 'https://dunemovie.com' },
        { name: 'Dune Reddit Hub', platform: 'Community', url: 'https://reddit.com/r/dune' }
      ]
    },
    quote: '"Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear."',
    accentColor: '#D97706'
  },

  genshin: {
    universeLore: {
      title: 'The Seven Nations of Teyvat & The Loom of Fate',
      concept: 'Elemental symphony, celestial kingdoms, cyclic cataclysms, and divine governance.',
      synopsis: 'Teyvat is a fantasy world governed by seven Elemental Archons, each presiding over a distinct nation inspired by world civilizations. When an unknown god separates two cosmic twin travelers, the Traveler awakens in Mondstadt, venturing across nations to solve the mysteries of ancient Khaenri\'ah and Celestia.',
      erasOrThemes: ['Mondstadt Winds of Freedom', 'Liyue Jade Chamber Contracts', 'Inazuma Lightning Eternity', 'Fontaine Justice & Opera Masquerade']
    },
    characters: [
      { name: 'Furina', role: 'Regina of All Waters (Fontaine)', personality: 'Dramatic stage presence, selfless actress who suffered in silence for 500 years', appearance: 'Victorian top hat, ruffled royal coat with droplet crystals, dual blue eyes', backstory: 'Human vessel of the Hydro Archon Focalors who tricked the heavenly principles to save Fontaine.' },
      { name: 'Raiden Shogun / Ei', role: 'Electro Archon (Inazuma)', personality: 'Solemn, martial perfectionist seeking eternity, sweet tooth lover', appearance: 'Braided purple hair, flowing kimono, katana drawn from her chest', backstory: 'Slit mountains with a single sword strike; secluded herself in the Plane of Euthymia.' },
      { name: 'Zhongli', role: 'Geo Archon / Morax (Liyue)', personality: 'Sophisticated historian, tea connoisseur, strict adherence to contracts', appearance: 'Immaculately tailored amber suit, amber eyes, towering calm demeanor', backstory: 'The Prime of Adepti who shaped the geography of Liyue with giant stone lances.' },
      { name: 'Neuvillette', role: 'Iudex of Fontaine', personality: 'Impartial judicial supreme, solemn observer of human emotions, water dragon', appearance: 'Flowing white-blue hair, royal court cane, judicial robes', backstory: 'The reincarnation of the Sovereign Dragon of Water who restored complete elemental authority.' }
    ],
    catalog: {
      featuredMusic: ['The Stellar Moments Vol. 1-4 4CD', 'Fontaine Symphony Live at Royal Albert Hall', 'Islands of the Lost and Forgotten OST Box', 'City of Winds and Idylls Vinyl Edition'],
      officialMerch: ['Genshin Concert 2024 Interactive Lightstick', 'Apex-Toys 1/7 Scale Keqing / Raiden Shogun Figures', 'Vision Element LED Glowing Metal Keychains', 'Paimon Emergency Food Handcrafted Plush', 'Genshin Impact Live Orchestra Music Box'],
      themedBundle: {
        title: 'Fontaine Hydro Symphony Commemorative Music Box & Score Boxset',
        tag: 'Orchestral Jewel',
        items: ['Mechanical Handcrafted Music Box (La Vaguelette)', 'Full Conductor Score Book (HOYO-MiX)', '5 Archon Metal Commemorative Medallions', 'Focalors Opera Mask Replica Display'],
        description: 'Exquisite wooden collector’s box dedicated to the unforgettable music of the Fontaine grand opera.'
      }
    },
    fanExperience: {
      fandomName: 'Travelers of Teyvat',
      officialColors: [
        { name: 'Celestial Primogem Gold', hex: '#FBBF24' },
        { name: 'Fontaine Hydro Azure', hex: '#38BDF8' },
        { name: 'Celestia Deep Violet', hex: '#6366F1' }
      ],
      fanchantSnippet: 'Ad astra abyssosque! Welcome to the Adventurers\' Guild!',
      highlights: [
        'Global symphonic world tours performed by the London Philharmonic and Tokyo Philharmonic',
        'Over 70 Million active players monthly across PlayStation, PC, and Mobile',
        'Won The Game Awards "Players\' Voice" and "Best Ongoing Game"'
      ],
      mediaTeaser: {
        title: 'La Vaguelette (Furina French Opera Performance)',
        type: 'Original French Operatic PV',
        duration: '04:32',
        description: 'Recorded with a live symphonic choir, recounting Furina\'s 500-year solitary masquerade on stage.'
      },
      preOrderBenefits: [
        'Solid Zinc-Alloy Vision Element Keyring (Choose Your Element)',
        'Genshin Concert Holographic VIP Ticket Pass',
        'Acrylic Character Standee with Stand Base'
      ],
      communityChannels: [
        { name: 'HoYoLAB Community', platform: 'Official App', url: 'https://hoyolab.com' },
        { name: 'Official Genshin Discord', platform: 'Discord', url: 'https://discord.gg/genshinimpact' },
        { name: 'Genshin Impact YouTube', platform: 'YouTube', url: 'https://youtube.com/@GenshinImpact' }
      ]
    },
    quote: '"The stage never ends as long as there is an audience. A star must shine brightest before its final bow."',
    accentColor: '#38BDF8'
  },

  'elden-ring': {
    universeLore: {
      title: 'The Lands Between & The Shattering of the Elden Ring',
      concept: 'Dark fantasy mythos, golden order dogmatism, tragic demigod wars, and cosmic runes.',
      synopsis: 'World-building crafted by Hidetaka Miyazaki and George R.R. Martin. When Queen Marika shattered the Elden Ring, her demigod offspring claimed its shards (Great Runes), sparking an endless civil war. Guided by the lost grace of gold, the Tarnished return across the fog to repair the Ring and claim the mantle of Elden Lord.',
      erasOrThemes: ['Age of the Erdtree & Crucible Era', 'The Night of the Black Knives', 'The Shattering Wars', 'Realm of Shadow (Miquella\'s Ascendance)']
    },
    characters: [
      { name: 'Malenia', role: 'Blade of Miquella', personality: 'Fiercely proud, undefeated swordsman, tragic victim of Scarlet Rot', appearance: 'Unalloyed gold prosthetic arm, winged helm, fluttering orange cape', backstory: 'Fought General Radahn to a standstill; famously declared: "I have never known defeat."' },
      { name: 'Ranni the Witch', role: 'Lunar Princess', personality: 'Enigmatic, quiet revolutionary seeking freedom from the Greater Will', appearance: 'Four-armed porcelain doll body, wide witch hat, spectral ghost visage', backstory: 'Stole the Rune of Death to cast away her Empyrean flesh and inaugurate the Age of the Stars.' },
      { name: 'General Radahn', role: 'Starscourge Conqueror', personality: 'Honorable warrior, titan gravity sorcerer, devoted to his tiny warhorse Leonard', appearance: 'Towering lion armor, dual colossal curved greatswords, red mane', backstory: 'Single-handedly held back the movement of the stars and the fate of the cosmos with gravity magic.' },
      { name: 'Miquella the Kind', role: 'Empyrean Saint', personality: 'Gentle, charismatic messiah seeking to divest himself of all worldly sin', appearance: 'Golden braided locks, childlike grace, ethereal glowing crown', backstory: 'Cast aside his golden lineage, his flesh, and even his love to ascend in the Realm of Shadow.' }
    ],
    catalog: {
      featuredMusic: ['Elden Ring Original Soundtrack 4LP Boxset', 'Shadow of the Erdtree Original Game Score', 'The Tarnished Symphonic Suite Live in Tokyo', 'Malenia Battle Theme Audiophile Single'],
      officialMerch: ['1:1 Scale Malenia Prosthetic Arm Wall Display Replica', 'Dark Moon Greatsword Full-Metal Replica Prop', 'Ranni the Witch 1/4 Scale Hand-Painted Resin Statue', 'Solid Brass Erdtree Site of Grace Desk Lamp', 'Pureblood Knight Medal Enamel Pin'],
      themedBundle: {
        title: 'Shadow of the Erdtree Collector\'s Edition with Messmer Statue',
        tag: 'God-Tier Vault',
        items: ['46cm Messmer the Impaler Statue with Flame Spear', 'Hardcover 40-Page Concept Artbook', 'Official Digital Soundtrack Voucher', 'Exclusive SteelBook Display Case'],
        description: 'The monumental collector edition featuring the dreaded tyrant Messmer standing upon a throne of ashes.'
      }
    },
    fanExperience: {
      fandomName: 'Tarnished (Guidance of Grace)',
      officialColors: [
        { name: 'Grace Radiant Gold', hex: '#EAB308' },
        { name: 'Crimson Scarlet Rot', hex: '#991B1B' },
        { name: 'Deep Space Lunar Silver', hex: '#64748B' }
      ],
      fanchantSnippet: 'Foul Tarnished, in search of the Elden Ring. Emboldened by the flame of ambition!',
      highlights: [
        'Game of the Year at The Game Awards 2022 and over 400 global accolades',
        'Over 25 Million copies sold worldwide across consoles and PC',
        'Shadow of the Erdtree praised as one of the greatest DLC expansions ever crafted'
      ],
      mediaTeaser: {
        title: 'Shadow of the Erdtree Cinematic Story Trailer',
        type: 'Cinematic Masterwork',
        duration: '03:15',
        description: 'Miquella\'s quiet pilgrimage into the Land of Shadow, accompanied by Tsukasa Saitoh\'s haunting choral score.'
      },
      preOrderBenefits: [
        'Pure Brass Tarnished Erdtree Compass with Functional Needle',
        'Fabric Microfiber World Map of the Lands Between',
        'Roundtable Hold Wax-Sealed Parchment Lore Scroll'
      ],
      communityChannels: [
        { name: 'FromSoftware Official', platform: 'Developer Hub', url: 'https://fromsoftware.jp' },
        { name: 'Bandai Namco Games', platform: 'Publisher Portal', url: 'https://bandainamcoent.com' },
        { name: 'Elden Ring Subreddit', platform: 'Reddit (2.5M+ Members)', url: 'https://reddit.com/r/Eldenring' }
      ]
    },
    quote: '"I am Malenia, Blade of Miquella. And I have never known defeat."',
    accentColor: '#EAB308'
  },

  ffvii: {
    universeLore: {
      title: 'The Planet Gaia, Mako Energy & The Lifestream',
      concept: 'Eco-terrorism against corporate tyranny, genetic experimentation, memory identity trauma, and cosmic horror.',
      synopsis: 'The corrupt Shinra Electric Power Company drains the planet\'s spiritual lifeblood (Mako energy) through massive mako reactors. Rebel group Avalanche bombs Reactor 1 with mercenary Cloud Strife. Soon, the struggle expands into an existential war against legendary super-soldier Sephiroth, who seeks to absorb the Lifestream and become a god.',
      erasOrThemes: ['Midgar Slums & Avalanche Rebellion', 'Nibelheim Incident & Jenova Awakening', 'Temple of the Ancients & Aerith\'s Prayer', 'Northern Crater & Advent Children']
    },
    characters: [
      { name: 'Cloud Strife', role: 'Ex-SOLDIER 1st Class & Mercenary', personality: 'Aloof, cynical facade shielding deeply fragmented memories, fiercely protective', appearance: 'Spiky blonde hair, SOLDIER uniform with single pauldron, massive Buster Sword', backstory: 'Underwent Jenova cell infusions and mako poisoning; inherited the Buster Sword and dreams from Zack Fair.' },
      { name: 'Sephiroth', role: 'The One-Winged Angel', personality: 'Eerily calm, aristocratic cruelty, driven mad by discovering his alien origin', appearance: 'Silver hair reaching his ankles, black trench coat, seven-foot Masamune katana', backstory: 'Shinra\'s greatest military war hero who burned Nibelheim to ashes upon discovering he was forged from Jenova.' },
      { name: 'Aerith Gainsborough', role: 'Last of the Cetra (Ancients)', personality: 'Playful, radiant, deeply in tune with the Planet\'s sorrow, brave', appearance: 'Pink dress, leather bolero jacket, braided hair tied with pink ribbon, Holy Materia', backstory: 'The sole living Cetra who can commune with the Lifestream; sacrificed herself at the Forgotten Capital.' },
      { name: 'Tifa Lockhart', role: 'Martial Artist & Emotional Anchor', personality: 'Warm, empathic, grounded, fierce fist fighter with Seventh Heaven bartending charm', appearance: 'White tank top, black suspenders and skirt, red leather combat boxing gloves', backstory: 'Cloud\'s childhood companion who helps him reconstruct his true shattered identity inside the Lifestream.' }
    ],
    catalog: {
      featuredMusic: ['Final Fantasy VII Rebirth Original Soundtrack Special Edit 8CD', 'Distant Worlds: Music from Final Fantasy Vinyl Box', 'One-Winged Angel Master Symphonic Score', 'No Promises to Keep (Loren Allred Single)'],
      officialMerch: ['Play Arts Kai Cloud Strife & Daytona Motorcycle Figure', 'Buster Sword 1:1 Scale Floor Ambient LED Lamp', 'Aerith Silver Ribbon & Materia Pendant Jewelry', 'Seventh Heaven Handcrafted Beer Mug', 'Sephiroth Black Wing Enamel Pin'],
      themedBundle: {
        title: 'Final Fantasy VII Rebirth Deluxe Collector\'s Edition with Sephiroth Statue',
        tag: 'Titan Collector Pack',
        items: ['48cm High-Detail Sephiroth Static Arts Statue', 'Original Mini Soundtrack CD with Gold Foil Trim', 'SteelBook Case featuring Key Artwork', 'Hardcover World Concept Artbook'],
        description: 'The premier collector\'s edition celebrating the epic middle chapter of the Final Fantasy VII remake trilogy.'
      }
    },
    fanExperience: {
      fandomName: 'SOLDIER / Avalanche',
      officialColors: [
        { name: 'Lifestream Mako Teal', hex: '#14B8A6' },
        { name: 'Meteor Cataclysm Silver', hex: '#94A3B8' },
        { name: 'Shinra Red', hex: '#DC2626' }
      ],
      fanchantSnippet: 'Those who fight further! The Planet has a will of its own!',
      highlights: [
        'The original 1997 release sold over 14 million copies and redefined video game cinematic storytelling',
        'Nobuo Uematsu\'s orchestral compositions ("One-Winged Angel", "Aerith\'s Theme") performed in global concert halls for 25+ years',
        'Final Fantasy VII Rebirth received universal acclaim, earning over 92+ Metacritic ratings'
      ],
      mediaTeaser: {
        title: 'Loren Allred & Nobuo Uematsu - No Promises to Keep (Orchestral Live)',
        type: 'Theme Song Live Performance',
        duration: '05:22',
        description: 'Aerith\'s emotional song performed with the Tokyo Philharmonic Orchestra, celebrating hope across timelines.'
      },
      preOrderBenefits: [
        'Metallic Buster Sword Cutout Bookmark with Chain',
        'Seventh Heaven Drink Coaster Set (Tifa Special)',
        'Shinra Electric Power Company Employee ID Pass Prop'
      ],
      communityChannels: [
        { name: 'Square Enix Portal', platform: 'Official Portal', url: 'https://square-enix-games.com' },
        { name: 'Distant Worlds Concerts', platform: 'Concerts', url: 'https://ffdistantworlds.com' },
        { name: 'FFVII Subreddit', platform: 'Reddit', url: 'https://reddit.com/r/FFVIIRemake' }
      ]
    },
    quote: '"The dream is not dead as long as you carry it forward. Embrace your dreams, and protect your honor as SOLDIER."',
    accentColor: '#14B8A6'
  }
};

interface IdolProfilesProps {
  onSelectArtist: (artistId: string) => void;
  fandomCategory?: string;
}

import { useDomainTheme } from '../context/DomainContext';
import { filterArtistsByDomain } from '../utils/domainFilters';
import { Bookmark, Share2, Check, Copy, X } from 'lucide-react';

const getCategoryBadgeStyles = (cat?: string) => {
  const c = (cat || '').toLowerCase();
  if (c.includes('gaming')) {
    return {
      badgeBg: '#00f0ff',
      badgeText: '#000000',
      tagColor: '#00f0ff',
      avatarShadow: '3px 3px 0px #00f0ff',
      hoverBorder: 'hover:border-[#00f0ff]',
      hoverShadow: 'hover:shadow-[4px_4px_0px_#00f0ff]'
    };
  }
  if (c.includes('manga')) {
    return {
      badgeBg: '#ff4d4d',
      badgeText: '#ffffff',
      tagColor: '#ff4d4d',
      avatarShadow: '3px 3px 0px #ff4d4d',
      hoverBorder: 'hover:border-[#ff4d4d]',
      hoverShadow: 'hover:shadow-[4px_4px_0px_#ff4d4d]'
    };
  }
  if (c.includes('anime')) {
    return {
      badgeBg: '#a3e635',
      badgeText: '#000000',
      tagColor: '#84cc16',
      avatarShadow: '3px 3px 0px #a3e635',
      hoverBorder: 'hover:border-[#84cc16]',
      hoverShadow: 'hover:shadow-[4px_4px_0px_#84cc16]'
    };
  }
  if (c.includes('cosplay')) {
    return {
      badgeBg: '#D02020',
      badgeText: '#ffffff',
      tagColor: '#D02020',
      avatarShadow: '3px 3px 0px #D02020',
      hoverBorder: 'hover:border-[#D02020]',
      hoverShadow: 'hover:shadow-[4px_4px_0px_#D02020]'
    };
  }
  if (c.includes('comic')) {
    return {
      badgeBg: '#38bdf8',
      badgeText: '#000000',
      tagColor: '#38bdf8',
      avatarShadow: '3px 3px 0px #ffd60a',
      hoverBorder: 'hover:border-[#38bdf8]',
      hoverShadow: 'hover:shadow-[4px_4px_0px_#38bdf8]'
    };
  }
  if (c.includes('movie') || c.includes('cinema')) {
    return {
      badgeBg: '#d4af37',
      badgeText: '#000000',
      tagColor: '#d4af37',
      avatarShadow: '3px 3px 0px #d4af37',
      hoverBorder: 'hover:border-[#d4af37]',
      hoverShadow: 'hover:shadow-[4px_4px_0px_#d4af37]'
    };
  }
  if (c.includes('tv')) {
    return {
      badgeBg: '#c084fc',
      badgeText: '#000000',
      tagColor: '#c084fc',
      avatarShadow: '3px 3px 0px #ffd60a',
      hoverBorder: 'hover:border-[#c084fc]',
      hoverShadow: 'hover:shadow-[4px_4px_0px_#c084fc]'
    };
  }
  return {
    badgeBg: '#d91470',
    badgeText: '#ffffff',
    tagColor: '#d91470',
    avatarShadow: '3px 3px 0px #ff2e93',
    hoverBorder: 'hover:border-[#d91470]',
    hoverShadow: 'hover:shadow-[4px_4px_0px_#ff2e93]'
  };
};

export const IdolProfiles: React.FC<IdolProfilesProps> = ({ onSelectArtist, fandomCategory }) => {
  const { currentDomain, activeSubCategory, activeConfig } = useDomainTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDossierArtist, setActiveDossierArtist] = useState<Artist | null>(null);
  const [activeCardTab, setActiveCardTab] = useState<Record<string, 'lore' | 'catalog' | 'fan'>>({});
  const [modalActiveTab, setModalActiveTab] = useState<'lore' | 'characters' | 'catalog' | 'fan'>('lore');

  const isManga = selectedCategory === 'manga' || fandomCategory?.toLowerCase().includes('manga');
  const isGaming = selectedCategory === 'gaming' || fandomCategory?.toLowerCase().includes('gaming') || fandomCategory?.toLowerCase().includes('game');
  const isAnime = selectedCategory === 'anime' || fandomCategory?.toLowerCase().includes('anime');
  const isCosplay = selectedCategory === 'cosplay' || fandomCategory?.toLowerCase().includes('cosplay');
  const isComics = selectedCategory === 'comics' || fandomCategory?.toLowerCase().includes('comic');
  const isCinema = selectedCategory === 'movie' || selectedCategory === 'cinema' || fandomCategory?.toLowerCase().includes('movie') || fandomCategory?.toLowerCase().includes('cinema');
  const isTv = selectedCategory === 'tv' || fandomCategory?.toLowerCase().includes('tv');
  const isKpop = selectedCategory === 'k-pop' || fandomCategory?.toLowerCase().includes('kpop') || fandomCategory?.toLowerCase().includes('k-pop');

  // SRS 1.6: Bookmarking & Sharing characters & artists
  const [bookmarkedArtists, setBookmarkedArtists] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('fanhub_bookmarked_artists');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [bookmarkedCharacters, setBookmarkedCharacters] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('fanhub_bookmarked_characters');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [sharingItem, setSharingItem] = useState<{ title: string; subtitle: string; url: string; type: 'Artist' | 'Character' } | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [dossierToast, setDossierToast] = useState<string | null>(null);

  const toggleBookmarkArtist = (artist: Artist) => {
    setBookmarkedArtists((prev) => {
      const isSaved = !!prev[artist.id];
      const next = { ...prev, [artist.id]: !isSaved };
      try {
        localStorage.setItem('fanhub_bookmarked_artists', JSON.stringify(next));
      } catch {}
      setDossierToast(!isSaved ? `★ Saved artist "${artist.name}" to Bookmarks!` : `Removed artist from Bookmarks.`);
      setTimeout(() => setDossierToast(null), 3000);
      return next;
    });
  };

  const toggleBookmarkCharacter = (char: CharacterDetail, artist: Artist) => {
    const charId = `${artist.id}-${char.name}`;
    setBookmarkedCharacters((prev) => {
      const isSaved = !!prev[charId];
      const next = { ...prev, [charId]: !isSaved };
      try {
        const existingListRaw = localStorage.getItem('fanhub_bookmarked_characters_list');
        let list: any[] = existingListRaw ? JSON.parse(existingListRaw) : [];
        if (!isSaved) {
          list.push({
            id: charId,
            name: char.name,
            role: char.role,
            artistName: artist.name,
            artistId: artist.id,
            appearance: char.appearance,
            personality: char.personality,
            backstory: char.backstory,
            savedAt: new Date().toLocaleDateString('en-US'),
          });
        } else {
          list = list.filter((c: any) => c.id !== charId);
        }
        localStorage.setItem('fanhub_bookmarked_characters_list', JSON.stringify(list));
        localStorage.setItem('fanhub_bookmarked_characters', JSON.stringify(next));
      } catch {}
      setDossierToast(!isSaved ? `★ Saved character "${char.name}" (${artist.name}) to Bookmarks!` : `Removed character from Bookmarks.`);
      setTimeout(() => setDossierToast(null), 3000);
      return next;
    });
  };

  // Sync with page fandom category
  React.useEffect(() => {
    if (fandomCategory) {
      const fc = fandomCategory.toLowerCase();
      if (fc.includes('kpop') || fc.includes('k-pop')) {
        setSelectedCategory('k-pop');
      } else if (fc.includes('anime')) {
        setSelectedCategory('anime');
      } else if (fc.includes('gaming') || fc.includes('game')) {
        setSelectedCategory('gaming');
      } else if (fc.includes('cosplay')) {
        setSelectedCategory('cosplay');
      } else if (fc.includes('manga')) {
        setSelectedCategory('manga');
      } else if (fc.includes('comic')) {
        setSelectedCategory('comics');
      } else if (fc.includes('movie') || fc.includes('cinema')) {
        setSelectedCategory('movie');
      } else if (fc.includes('tv')) {
        setSelectedCategory('tv');
      } else if (fc === 'all' || fc.includes('all')) {
        setSelectedCategory('all');
      }
    }
  }, [fandomCategory]);

  const domainFilteredArtists = useMemo(() => {
    // When a fandom category is selected or provided by the page, use mockArtists directly
    // so non-music domains (Gaming, Anime, Manga, Cosplay, Comics, Cinema, TV) are not filtered out
    if (fandomCategory || selectedCategory !== 'all') {
      return mockArtists;
    }
    const filtered = filterArtistsByDomain(mockArtists, currentDomain, activeSubCategory);
    return filtered.length > 0 ? filtered : mockArtists;
  }, [fandomCategory, selectedCategory, currentDomain, activeSubCategory]);

  // Filter artists
  const filteredArtists = useMemo(() => {
    return domainFilteredArtists.filter((artist) => {
      const matchCat = 
        selectedCategory === 'all' 
          ? true 
          : selectedCategory === 'v-pop'
            ? artist.category === 'V-Pop'
            : selectedCategory === 'k-pop' 
              ? artist.category === 'K-Pop' 
              : selectedCategory === 'anime' 
                ? artist.category === 'Anime' 
                : (selectedCategory === 'movie' || selectedCategory === 'cinema' || selectedCategory === 'movies')
                  ? (artist.category === 'Movies' || artist.category === 'Movie') 
                  : selectedCategory === 'gaming' 
                    ? artist.category === 'Gaming' 
                    : selectedCategory === 'cosplay'
                      ? artist.category === 'Cosplay'
                      : selectedCategory === 'manga'
                        ? artist.category === 'Manga'
                        : selectedCategory === 'comics'
                          ? artist.category === 'Comics'
                          : (selectedCategory === 'tv' || selectedCategory === 'tv shows')
                            ? artist.category === 'TV Shows'
                            : true;

      const q = searchQuery.toLowerCase().trim();
      const matchQuery = 
        !q 
          ? true 
          : artist.name.toLowerCase().includes(q) ||
            artist.koreanName.toLowerCase().includes(q) ||
            artist.agency.toLowerCase().includes(q) ||
            artist.fandomName.toLowerCase().includes(q) ||
            artist.members.some(m => m.toLowerCase().includes(q));

      return matchCat && matchQuery;
    });
  }, [domainFilteredArtists, selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'All Universes', count: mockArtists.length },
    { id: 'gaming', label: 'Gaming Arena', count: mockArtists.filter(a => a.category === 'Gaming').length },
    { id: 'k-pop', label: 'K-Pop', count: mockArtists.filter(a => a.category === 'K-Pop').length },
    { id: 'anime', label: 'Anime Sakuga', count: mockArtists.filter(a => a.category === 'Anime').length },
    { id: 'manga', label: 'Manga Guild', count: mockArtists.filter(a => a.category === 'Manga').length },
    { id: 'cosplay', label: 'Cosplay Atelier', count: mockArtists.filter(a => a.category === 'Cosplay').length },
    { id: 'comics', label: 'Comics Pop-Art', count: mockArtists.filter(a => a.category === 'Comics').length },
    { id: 'movie', label: '70mm Cinema', count: mockArtists.filter(a => a.category === 'Movies' || a.category === 'Movie').length },
    { id: 'tv', label: 'TV Shows', count: mockArtists.filter(a => a.category === 'TV Shows').length },
    { id: 'v-pop', label: 'V-Pop (Vietnam)', count: mockArtists.filter(a => a.category === 'V-Pop').length },
  ];

  const getCardTab = (artistId: string) => activeCardTab[artistId] || 'lore';
  const setCardTab = (artistId: string, tab: 'lore' | 'catalog' | 'fan') => {
    setActiveCardTab(prev => ({ ...prev, [artistId]: tab }));
  };

  const activeDossierData = activeDossierArtist ? (UNIVERSE_DOSSIERS[activeDossierArtist.id] || {
    universeLore: {
      title: activeDossierArtist.name,
      concept: activeDossierArtist.bio,
      synopsis: activeDossierArtist.bio,
      erasOrThemes: ['Debut Phase', 'Live Stadium Tour Era', 'Global Fandom Worldwide Movement']
    },
    characters: activeDossierArtist.members.map(m => ({
      name: m,
      role: 'Core Member / Lead Artist',
      personality: 'Artistic charisma, high passion, captivating stage presence',
      appearance: 'Trendsetting styling, signature performance outfit',
      backstory: `Key performer defining the musical direction and global identity of ${activeDossierArtist.name}.`
    })),
    catalog: {
      featuredMusic: ['Official Albums & Singles', 'Live Concert Master Recording', 'Chart-Topping Global Hit Tracks'],
      officialMerch: ['Deluxe Stage Photobook', 'Random Metallic Hologram Photocard', 'Official Bluetooth Concert Lightstick'],
      themedBundle: {
        title: `${activeDossierArtist.name} - Special Commemorative Boxset`,
        tag: 'Official Collector Box',
        items: ['Limited 120-Page Photobook', 'Foil-Stamped Hologram Photocard Set', 'Signed Commemorative Poster', 'LED Concert Wristband'],
        description: `Official authentic merchandise collection curated exclusively for the global ${activeDossierArtist.fandomName} community.`
      }
    },
    fanExperience: {
      fandomName: activeDossierArtist.fandomName,
      officialColors: [
        { name: 'Flame Red', hex: '#EF4444' },
        { name: 'Royal Gold', hex: '#F59E0B' },
        { name: 'Pure White', hex: '#FFFFFF' }
      ],
      fanchantSnippet: `${activeDossierArtist.fandomName} forever united and shining bright with ${activeDossierArtist.name}!`,
      highlights: [
        'Record-breaking sell-out time across stadium venues',
        'Top trending artist across major international streaming platforms',
        'Passionate, global-scale fandom network spanning multiple continents'
      ],
      mediaTeaser: {
        title: `${activeDossierArtist.name} Live Stage Performance`,
        type: 'Concert Highlights',
        duration: '04:30',
        description: 'Spectacular live stagecraft with state-of-the-art visuals and world-class sound design.'
      },
      preOrderBenefits: [
        'Exclusive limited edition unreleased photocard',
        'Commemorative metallic tour pin badge'
      ],
      communityChannels: [
        { name: `${activeDossierArtist.fandomName} Official`, platform: 'Fandom Community', url: '#' },
        { name: 'Official Channel', platform: 'YouTube / Media', url: '#' }
      ]
    },
    quote: activeDossierArtist.bio,
    accentColor: '#000000'
  }) : null;

  return (
    <section 
      id="artists" 
      style={{
        backgroundColor: 'transparent',
        color: '#0f172a',
      }}
      className="py-16 md:py-24 lg:py-28 w-full border-t border-slate-200/60"
    >
      <div 
        className="max-w-[1440px] mx-auto px-4 sm:px-8"
      >
        
        {/* ==================== 1. Editorial Header (Matching AlbumGrid Signature) ==================== */}
        <div style={{ marginBottom: '40px' }}>
          
          {/* Title Row: Heading on Left + Compact Search Box on Right */}
          <div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-7 border-b border-slate-200"
          >
            <div className="flex-1 max-w-2xl">
              <h2
                style={{
                  fontFamily: isManga ? "'Kalam', cursive" : isCinema ? "'Playfair Display', Georgia, serif" : isComics ? "'Bangers', cursive" : isGaming ? "var(--font-mono)" : undefined
                }}
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-tight text-black m-0"
              >
                {isGaming ? (
                  <>Roster Index <em style={{ fontStyle: 'normal', color: '#0891b2' }}>// Canonical Character Dossiers</em></>
                ) : isManga ? (
                  <>Mangaka Roster <em style={{ fontStyle: 'italic', color: '#e11d48' }}>&amp; Character Archives</em></>
                ) : isAnime ? (
                  <>Voice Cast &amp; Studios <em style={{ fontStyle: 'normal', color: '#4d7c0f' }}>// Canonical Dossiers</em></>
                ) : isCosplay ? (
                  <>Constructors &amp; Ateliers <em style={{ fontStyle: 'italic', color: '#D02020' }}>&amp; Costume Archives</em></>
                ) : isComics ? (
                  <>Multiverse Registry <em style={{ fontStyle: 'normal', color: '#dc2626' }}>// Character Archives</em></>
                ) : isCinema ? (
                  <>Auteurs &amp; Directors <em style={{ fontStyle: 'italic', color: '#d4af37' }}>&amp; Film Monographs</em></>
                ) : isTv ? (
                  <>Ensemble Casts <em style={{ fontStyle: 'normal', color: '#c084fc' }}>&amp; Episode Dossiers</em></>
                ) : isKpop ? (
                  <>Idol Roster{' '}
                    <em className="font-serif italic font-normal text-[#d91470] drop-shadow-[1px_1px_0px_#000000]">
                      &amp; Member Matrices
                    </em>
                  </>
                ) : (
                  <>Character Dossiers{' '}
                    <em className="font-serif italic font-normal text-[#d91470] drop-shadow-[1px_1px_0px_#000000]">
                      &amp; Fandom Archives
                    </em>
                  </>
                )}
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  color: '#64748b',
                  margin: '8px 0 0 0',
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                {isGaming
                  ? 'Official dossiers of World Champion esports icons, Riot Games legends, and HoYo-MiX symphonic orchestrators.'
                  : isManga
                  ? 'Weekly Shonen Jump archives, master mangaka manuscripts, and legendary pirate & ninja lore.'
                  : isAnime
                  ? 'Curated archive of landmark anime studios, premier seiyuu voice talents, and supernatural sorcery.'
                  : isCosplay
                  ? 'Bauhaus theatrical ateliers, avant-garde constructivism, geometric silhouettes, and living architecture.'
                  : isComics
                  ? 'Pop-art superhero multiverse, vintage comic panels, variant cover editions, and iconic graphic lore.'
                  : isCinema
                  ? '70mm photochemical cinema archives, auteur director monographs, and uncompressed analog scores.'
                  : isTv
                  ? 'Retro television binge vault, 80s synthwave mysteries, and ensemble cast character biographies.'
                  : 'Curated archive of legendary K-Pop groups, Anime icons, and Gaming franchises. Explore key character dossiers, canonical universe lore, catalog collections, and official fandom perks.'}
              </p>
            </div>

            {/* Compact Right-Aligned Search Box & Counter */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
              <div 
                className="relative w-full sm:w-72 h-[40px] border border-black bg-white flex items-center"
                style={{ borderRadius: '0px' }}
              >
                <span className="font-mono text-xs font-bold pl-3 text-neutral-400 select-none">[//]</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH // ARTIST, UNIVERSE..."
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    outline: 'none',
                    padding: '0 30px 0 10px',
                    fontSize: '11px',
                    fontFamily: "var(--font-mono), monospace",
                    backgroundColor: 'transparent',
                    color: '#000000',
                    fontWeight: 700,
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    type="button"
                    style={{
                      position: 'absolute',
                      right: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#000000',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      fontWeight: 800,
                    }}
                    aria-label="Clear search"
                  >
                    [×]
                  </button>
                )}
              </div>

              {/* Counter Badge */}
              <div 
                style={{
                  height: '40px',
                  padding: '0 16px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  borderRadius: '0px',
                  whiteSpace: 'nowrap',
                  border: '1px solid #000000',
                }}
              >
                {filteredArtists.length} DOSSIERS
              </div>
            </div>

          </div>
        </div>

        {/* ==================== 2. Universe Cards Grid ==================== */}
        {filteredArtists.length === 0 ? (
          <div 
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              border: '2px solid #000000',
              backgroundColor: '#ffffff',
              margin: '20px 0',
              borderRadius: '0px',
            }}
          >
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
              [ARCHIVE EMPTY // NO MATCH]
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: 700, margin: '0 0 6px' }}>
              No Universes Found
            </h3>
            <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 16px', fontFamily: 'monospace' }}>
              We could not find any artists or characters matching "{searchQuery}".
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              type="button"
              style={{
                padding: '10px 20px',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                border: '1.5px solid #000000',
                cursor: 'pointer',
                borderRadius: '0px',
              }}
            >
              Reset Filters [×]
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-10">
            {filteredArtists.map((artist) => {
              const dossier = UNIVERSE_DOSSIERS[artist.id];
              const currentTab = getCardTab(artist.id);
              const badgeStyle = getCategoryBadgeStyles(artist.category);

              return (
                <div
                  key={artist.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #000000',
                    borderRadius: '0px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  className={`group ${badgeStyle.hoverBorder} ${badgeStyle.hoverShadow} transition-all`}
                >
                  
                  {/* Card Banner Image & Integrated Avatar */}
                  <div 
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '220px',
                      backgroundColor: '#000000',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={artist.bannerImage}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{
                        objectFit: 'cover',
                        opacity: 0.95,
                        transition: 'transform 0.5s ease',
                      }}
                      className="group-hover:scale-105 contrast-105"
                    />
                    
                    {/* Y2K Pop Gradient Overlay */}
                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.9) 100%)',
                      }} 
                    />

                    {/* Top Badges (Vibrant Category Badges) */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        right: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        zIndex: 10,
                      }}
                    >
                      <span 
                        style={{
                          fontSize: '10px',
                          fontFamily: "var(--font-mono), monospace",
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          padding: '4px 10px',
                          backgroundColor: badgeStyle.badgeBg,
                          color: badgeStyle.badgeText,
                          borderRadius: '0px',
                          border: '2px solid #000000',
                          boxShadow: '2px 2px 0px #000000',
                        }}
                      >
                        ★ [{artist.category}]
                      </span>
                      <span 
                        style={{
                          fontSize: '10px',
                          fontFamily: "var(--font-mono), monospace",
                          fontWeight: 800,
                          padding: '4px 10px',
                          backgroundColor: '#ffd60a',
                          color: '#000000',
                          borderRadius: '0px',
                          border: '2px solid #000000',
                          boxShadow: '2px 2px 0px #000000',
                        }}
                      >
                        {artist.totalAlbums} RELEASES
                      </span>
                    </div>

                    {/* Integrated Bottom Profile: Avatar + Typography */}
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '14px',
                        right: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        zIndex: 10,
                      }}
                    >
                      <div 
                        style={{
                          position: 'relative',
                          width: '56px',
                          height: '56px',
                          border: '2px solid #000000',
                          borderRadius: '0px',
                          backgroundColor: '#ffd60a',
                          overflow: 'hidden',
                          flexShrink: 0,
                          boxShadow: badgeStyle.avatarShadow,
                        }}
                      >
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          fill
                          sizes="56px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <h3 
                          style={{
                            fontFamily: "var(--font-serif), 'Playfair Display', Georgia, serif",
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#ffffff',
                            margin: 0,
                            letterSpacing: '-0.02em',
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '6px',
                            textShadow: '2px 2px 0px #000000',
                          }}
                        >
                          <span className="truncate">{artist.name}</span>
                          <span style={{ fontSize: '11px', fontFamily: "var(--font-mono), monospace", color: '#ffd60a', fontWeight: 700 }}>
                            ({artist.koreanName})
                          </span>
                        </h3>
                        <p 
                          style={{
                            fontSize: '10px',
                            fontFamily: 'var(--font-mono), monospace',
                            color: '#e5e5e5',
                            margin: '2px 0 0 0',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {artist.agency} · EST. {artist.debutYear}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '24px 26px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Fandom Info Row */}
                      <div 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingBottom: '12px',
                          borderBottom: '2px solid #000000',
                          fontSize: '11px',
                          fontFamily: "var(--font-mono), monospace",
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: badgeStyle.tagColor, fontWeight: 800, textTransform: 'uppercase' }}>
                            FANDOM //
                          </span>
                          <span style={{ fontWeight: 900, color: '#000000' }}>
                            {artist.fandomName}
                          </span>
                        </div>
                        <span style={{ color: '#000000', fontWeight: 800, letterSpacing: '0.08em', backgroundColor: '#ecfeff', padding: '2px 6px', border: '1px solid #000000' }}>
                          ★ VERIFIED FANCLUB
                        </span>
                      </div>

                      {/* Editorial Concept Quote */}
                      <div 
                        style={{
                          borderLeft: '4px solid #ff2e93',
                          backgroundColor: '#fefce8',
                          padding: '12px 14px',
                          margin: '16px 0',
                          fontSize: '12px',
                          fontStyle: 'italic',
                          fontFamily: "var(--font-serif), 'Playfair Display', Georgia, serif",
                          color: '#000000',
                          lineHeight: 1.5,
                          border: '1px solid #000000',
                          borderLeftWidth: '4px',
                        }}
                      >
                        "{dossier?.universeLore.concept || artist.bio}"
                      </div>

                      {/* 3-Tab Segment Switcher (Vibrant Colors) */}
                      <div 
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          backgroundColor: '#ffffff',
                          padding: '0px',
                          border: '2px solid #000000',
                          margin: '16px 0',
                          gap: '0px',
                        }}
                      >
                        {(['lore', 'catalog', 'fan'] as const).map((tId, tIdx) => {
                          const isTActive = currentTab === tId;
                          const labels = ['01 LORE', '02 CATALOG', '03 PERKS'];
                          
                          let activeBg = '#ffd60a';
                          let activeColor = '#000000';
                          if (tId === 'catalog') {
                            activeBg = '#00f0ff';
                            activeColor = '#000000';
                          } else if (tId === 'fan') {
                            activeBg = '#d91470';
                            activeColor = '#ffffff';
                          }

                          return (
                            <button
                              key={tId}
                              type="button"
                              onClick={() => setCardTab(artist.id, tId)}
                              style={{
                                padding: '8px 4px',
                                cursor: 'pointer',
                                border: 'none',
                                borderRight: tIdx < 2 ? '2px solid #000000' : 'none',
                                borderRadius: '0px',
                                backgroundColor: isTActive ? activeBg : '#ffffff',
                                color: isTActive ? activeColor : '#000000',
                                fontWeight: 800,
                                fontSize: '10px',
                                fontFamily: "var(--font-mono), monospace",
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                transition: 'all 0.1s ease',
                              }}
                            >
                              {labels[tIdx]}
                            </button>
                          );
                        })}
                      </div>

                      {/* Tab 1 Content: Lore & Roles */}
                      {currentTab === 'lore' && (
                        <div style={{ minHeight: '135px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 800, fontFamily: "var(--font-mono), monospace", color: '#000000', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              KEY CHARACTERS // ROLES:
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {(dossier?.characters || artist.members.map(m => ({ name: m, role: 'Member' }))).slice(0, 4).map((char, idx) => (
                                <span 
                                  key={idx}
                                  style={{
                                    fontSize: '10px',
                                    fontFamily: "var(--font-mono), monospace",
                                    padding: '3px 7px',
                                    backgroundColor: idx % 2 === 0 ? '#fdf2f8' : '#ecfeff',
                                    color: '#000000',
                                    border: '1.5px solid #000000',
                                    fontWeight: 800,
                                    borderRadius: '0px',
                                  }}
                                >
                                  {char.name}
                                </span>
                              ))}
                              {artist.members && artist.members.length > 4 && (
                                <span 
                                  style={{
                                    fontSize: '10px',
                                    fontFamily: "var(--font-mono), monospace",
                                    padding: '3px 7px',
                                    border: '1.5px solid #000000',
                                    backgroundColor: '#ffd60a',
                                    color: '#000000',
                                    fontWeight: 800,
                                    borderRadius: '0px',
                                  }}
                                >
                                  +{artist.members.length - 4} MORE
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab 2 Content: Catalog & Boxsets */}
                      {currentTab === 'catalog' && (
                        <div style={{ minHeight: '135px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 800, fontFamily: "var(--font-mono), monospace", color: '#000000', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              OFFICIAL CATALOG DROPS:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {dossier?.catalog.officialMerch.slice(0, 2).map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: "var(--font-mono), monospace", color: '#000000' }}>
                                  <span className="font-bold text-[#d91470]">0{idx + 1} //</span>
                                  <span className="truncate font-semibold">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {dossier?.catalog.themedBundle && (
                            <div 
                              style={{
                                padding: '8px 10px',
                                backgroundColor: '#ecfeff',
                                color: '#000000',
                                border: '1.5px solid #000000',
                                borderRadius: '0px',
                                marginTop: '8px',
                              }}
                            >
                              <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#d91470', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>
                                ★ COLLECTOR BOXSET:
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#000000', fontFamily: 'monospace' }} className="truncate block">
                                {dossier.catalog.themedBundle.title}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tab 3 Content: Fan Perks & POB */}
                      {currentTab === 'fan' && (
                        <div style={{ minHeight: '135px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 800, fontFamily: "var(--font-mono), monospace", color: '#000000', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              MILESTONE RECORD:
                            </div>
                            <p style={{ fontSize: '11px', fontFamily: "var(--font-mono), monospace", color: '#000000', lineHeight: 1.4, margin: 0 }} className="line-clamp-2">
                              {dossier?.fanExperience.highlights[0] || 'Historical album records and global tours.'}
                            </p>
                          </div>

                          <div 
                            style={{
                              backgroundColor: '#fdf2f8',
                              border: '1.5px solid #000000',
                              borderRadius: '0px',
                              padding: '8px 10px',
                              marginTop: '8px',
                            }}
                          >
                            <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#d91470', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>
                              PRE-ORDER BENEFIT (POB):
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#000000', fontFamily: 'monospace' }} className="truncate block">
                              ★ {dossier?.fanExperience.preOrderBenefits[0] || 'Exclusive Holo Card Set'}
                            </span>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Dual Action Buttons (Vibrant Y2K Pop Buttons) */}
                    <div 
                      style={{
                        marginTop: '20px',
                        paddingTop: '16px',
                        borderTop: '2px solid #000000',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {/* SRS 1.6: Bookmark & Share Actions Bar */}
                      <div className="grid grid-cols-2 gap-2 mb-1">
                        <button
                          type="button"
                          onClick={() => toggleBookmarkArtist(artist)}
                          className={`py-1.5 px-2 border-2 border-black text-[10px] font-mono font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                            bookmarkedArtists[artist.id]
                              ? 'bg-[#ccff00] text-black shadow-[2px_2px_0px_#000]'
                              : 'bg-white text-black hover:bg-neutral-100 shadow-[2px_2px_0px_#000]'
                          }`}
                        >
                          <Bookmark className={`w-3 h-3 ${bookmarkedArtists[artist.id] ? 'fill-black' : ''}`} />
                          <span>{bookmarkedArtists[artist.id] ? 'SAVED' : 'SAVE'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSharingItem({
                            title: `${artist.name} (${artist.koreanName})`,
                            subtitle: `${artist.agency} · Fandom: ${artist.fandomName}`,
                            url: `${typeof window !== 'undefined' ? window.location.origin : ''}/#artists?id=${artist.id}`,
                            type: 'Artist',
                          })}
                          className="py-1.5 px-2 bg-white text-black hover:bg-neutral-100 border-2 border-black text-[10px] font-mono font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-[2px_2px_0px_#000]"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>SHARE</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setActiveDossierArtist(artist);
                          setModalActiveTab('lore');
                        }}
                        type="button"
                        style={{
                          width: '100%',
                          height: '40px',
                          backgroundColor: '#d91470',
                          color: '#ffffff',
                          border: '2px solid #000000',
                          borderRadius: '0px',
                          fontSize: '11px',
                          fontFamily: "var(--font-mono), monospace",
                          fontWeight: 900,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '3px 3px 0px #000000',
                        }}
                        className="hover:bg-[#be185d] transition-colors duration-100"
                      >
                        <span>[VIEW DOSSIER ARCHIVE →]</span>
                      </button>

                      <button
                        onClick={() => onSelectArtist(artist.id)}
                        type="button"
                        style={{
                          width: '100%',
                          height: '40px',
                          backgroundColor: '#ffd60a',
                          color: '#000000',
                          border: '2px solid #000000',
                          borderRadius: '0px',
                          fontSize: '11px',
                          fontFamily: "var(--font-mono), monospace",
                          fontWeight: 900,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '3px 3px 0px #000000',
                        }}
                        className="hover:bg-[#fde047] transition-colors duration-100"
                      >
                        <span>[EXPLORE RELEASES ({artist.totalAlbums}) ↓]</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ==================== 3. Complete Dossier Modal ==================== */}
        {activeDossierArtist && activeDossierData && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              overflowY: 'auto',
            }}
            onClick={() => setActiveDossierArtist(null)}
          >
            <div 
              style={{
                backgroundColor: '#ffffff',
                width: '100%',
                maxWidth: '920px',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '2px solid #000000',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Modal Banner */}
              <div 
                style={{
                  position: 'relative',
                  height: '210px',
                  backgroundColor: '#0f172a',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                <Image 
                  src={activeDossierArtist.bannerImage} 
                  alt={activeDossierArtist.name} 
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  style={{ objectFit: 'cover', opacity: 0.82 }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.95) 100%)',
                  }}
                />
                
                {/* Close Button */}
                <button
                  onClick={() => setActiveDossierArtist(null)}
                  type="button"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: 20,
                    width: '44px',
                    height: '44px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: '1.5px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Close dossier"
                  className="font-mono text-sm font-bold"
                >
                  [×]
                </button>

                {/* Banner Content */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '20px',
                    right: '20px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                    zIndex: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px' }}>
                    <div 
                      style={{
                        position: 'relative',
                        width: '70px',
                        height: '70px',
                        border: '2px solid #ffffff',
                        backgroundColor: '#000',
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      }}
                    >
                      <Image 
                        src={activeDossierArtist.image} 
                        alt={activeDossierArtist.name} 
                        fill
                        sizes="70px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <span 
                        style={{
                          fontSize: '9px',
                          fontFamily: 'monospace',
                          textTransform: 'uppercase',
                          backgroundColor: '#000',
                          color: '#fff',
                          padding: '2px 6px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          letterSpacing: '0.15em',
                        }}
                      >
                        {activeDossierArtist.category} UNIVERSE DOSSIER
                      </span>
                      <h3 
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: '26px',
                          fontWeight: 800,
                          color: '#ffffff',
                          margin: '4px 0 2px 0',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {activeDossierArtist.name}
                        <span style={{ fontSize: '13px', fontFamily: 'sans-serif', color: '#cbd5e1', fontWeight: 400, marginLeft: '8px' }}>
                          ({activeDossierArtist.koreanName})
                        </span>
                      </h3>
                      <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', margin: 0, textTransform: 'uppercase' }}>
                        {activeDossierArtist.agency} · EST. {activeDossierArtist.debutYear} · FANDOM: {activeDossierArtist.fandomName}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const id = activeDossierArtist.id;
                      setActiveDossierArtist(null);
                      onSelectArtist(id);
                    }}
                    type="button"
                    style={{
                      height: '36px',
                      padding: '0 16px',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: '1.5px solid #ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderRadius: '0px',
                    }}
                  >
                    <span>[VIEW ALL ALBUMS ↓]</span>
                  </button>
                </div>
              </div>

              {/* Modal Tabs Bar */}
              <div 
                style={{
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  padding: '0 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  overflowX: 'auto',
                  flexShrink: 0,
                  position: 'sticky',
                  top: 0,
                  zIndex: 20,
                }}
              >
                {[
                  { id: 'lore', label: '1. Universe Lore & Eras' },
                  { id: 'characters', label: `2. Character Profiles (${activeDossierData.characters.length})` },
                  { id: 'catalog', label: '3. Catalog & Boxsets' },
                  { id: 'fan', label: '4. Fan Experience & POB' },
                ].map((t) => {
                  const isActive = modalActiveTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setModalActiveTab(t.id as any)}
                      style={{
                        padding: '12px 16px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: isActive ? 800 : 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        border: 'none',
                        borderBottom: isActive ? '2px solid #000000' : '2px solid transparent',
                        backgroundColor: isActive ? '#ffffff' : 'transparent',
                        color: isActive ? '#000000' : '#64748b',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Modal Body Panels */}
              <div style={{ padding: '24px 28px' }}>
                
                {/* Panel 1: Lore */}
                {modalActiveTab === 'lore' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '4px' }}>
                        CONCEPT & PHILOSOPHY
                      </span>
                      <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>
                        {activeDossierData.universeLore.title}
                      </h4>
                      <p 
                        style={{
                          borderLeft: '2px solid #000000',
                          backgroundColor: '#f8fafc',
                          padding: '12px 16px',
                          fontSize: '13px',
                          fontStyle: 'italic',
                          fontFamily: "'Playfair Display', Georgia, serif",
                          color: '#334155',
                          margin: '0 0 14px 0',
                          lineHeight: 1.6,
                        }}
                      >
                        {activeDossierData.quote}
                      </p>
                      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                        {activeDossierData.universeLore.synopsis}
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
                        CANONICAL ERAS & TIMELINE PHASES
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeDossierData.universeLore.erasOrThemes.map((era, i) => (
                          <div 
                            key={i} 
                            style={{
                              padding: '12px 14px',
                              border: '1px solid #e2e8f0',
                              backgroundColor: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                            }}
                          >
                            <span 
                              style={{
                                width: '22px',
                                height: '22px',
                                backgroundColor: '#000000',
                                color: '#ffffff',
                                fontSize: '10px',
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {i + 1}
                            </span>
                            <div>
                              <p style={{ fontSize: '12px', fontWeight: 700, margin: 0, color: '#0f172a' }}>{era}</p>
                              <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>Official Universe Phase</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Panel 2: Characters */}
                {modalActiveTab === 'characters' && (
                  <div>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>
                      Detailed dossier of key figures, personality matrices, stage traits, and canonical backgrounds.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeDossierData.characters.map((char, i) => {
                        const charId = `${activeDossierArtist?.id}-${char.name}`;
                        const isCharSaved = !!bookmarkedCharacters[charId];

                        return (
                          <div 
                            key={i} 
                            style={{
                              padding: '16px',
                              border: '2px solid #000000',
                              backgroundColor: '#ffffff',
                              boxShadow: '3px 3px 0px #000000',
                            }}
                            className="flex flex-col justify-between"
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9', marginBottom: '10px' }}>
                                <div>
                                  <h5 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '15px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                                    {char.name}
                                  </h5>
                                  <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#64748b', textTransform: 'uppercase' }}>
                                    {char.role}
                                  </span>
                                </div>
                                <span style={{ fontSize: '9px', fontFamily: 'monospace', backgroundColor: '#f1f5f9', color: '#1e293b', padding: '2px 6px', border: '1px solid #e2e8f0' }}>
                                  KEY ROLE
                                </span>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#475569' }}>
                                <p style={{ margin: 0 }}>
                                  <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: '10px', textTransform: 'uppercase' }}>Personality:</strong> {char.personality}
                                </p>
                                <p style={{ margin: 0 }}>
                                  <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: '10px', textTransform: 'uppercase' }}>Appearance:</strong> {char.appearance}
                                </p>
                                <p style={{ margin: '4px 0 0 0', paddingTop: '6px', borderTop: '1px solid #f8fafc', fontStyle: 'italic', fontSize: '11px', color: '#334155', lineHeight: 1.5 }}>
                                  "{char.backstory}"
                                </p>
                              </div>
                            </div>

                            {/* SRS 1.6: Character Bookmark & Share */}
                            <div className="pt-3 mt-3 border-t border-black/10 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => activeDossierArtist && toggleBookmarkCharacter(char, activeDossierArtist)}
                                className={`px-2.5 py-1 text-[10px] font-mono font-black border-2 border-black flex items-center gap-1 cursor-pointer transition-colors ${
                                  isCharSaved
                                    ? 'bg-[#ccff00] text-black shadow-[1.5px_1.5px_0px_#000]'
                                    : 'bg-white hover:bg-neutral-100 text-black shadow-[1.5px_1.5px_0px_#000]'
                                }`}
                              >
                                <Bookmark className={`w-3 h-3 ${isCharSaved ? 'fill-black' : ''}`} />
                                <span>{isCharSaved ? 'SAVED TO DOSSIER' : 'BOOKMARK'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setSharingItem({
                                  title: `${char.name} (${activeDossierArtist?.name})`,
                                  subtitle: `Role: ${char.role} · ${char.personality}`,
                                  url: `${typeof window !== 'undefined' ? window.location.origin : ''}/#artists?character=${encodeURIComponent(char.name)}`,
                                  type: 'Character',
                                })}
                                className="px-2.5 py-1 text-[10px] font-mono font-black bg-white hover:bg-neutral-100 text-black border-2 border-black flex items-center gap-1 cursor-pointer shadow-[1.5px_1.5px_0px_#000]"
                              >
                                <Share2 className="w-3 h-3" />
                                <span>SHARE</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Panel 3: Catalog & Boxsets */}
                {modalActiveTab === 'catalog' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Themed Boxset Banner */}
                    <div 
                      style={{
                        padding: '18px 20px',
                        border: '2px solid #000000',
                        backgroundColor: '#f8fafc',
                        position: 'relative',
                      }}
                    >
                      <span 
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          backgroundColor: '#000000',
                          color: '#ffffff',
                          padding: '3px 8px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {activeDossierData.catalog.themedBundle.tag}
                      </span>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                        FLAGSHIP COLLECTOR'S BOXSET
                      </span>
                      <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>
                        {activeDossierData.catalog.themedBundle.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 14px 0', lineHeight: 1.6 }}>
                        {activeDossierData.catalog.themedBundle.description}
                      </p>

                      <div style={{ backgroundColor: '#ffffff', padding: '12px', border: '1px solid #000000' }}>
                        <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#737373', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                          BUNDLE CONTENTS:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {activeDossierData.catalog.themedBundle.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#000000', fontFamily: 'monospace' }}>
                              <span style={{ fontWeight: 800 }}>0{idx + 1} //</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Official Music & Merch Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div style={{ padding: '16px', border: '1px solid #000000', backgroundColor: '#ffffff' }}>
                        <h5 style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          [AUDIO // FEATURED ALBUMS & VINYLS]
                        </h5>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {activeDossierData.catalog.featuredMusic.map((m, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#000000', paddingBottom: '6px', borderBottom: '1px solid #f5f5f5', fontFamily: 'monospace' }}>
                              <span style={{ width: '4px', height: '4px', backgroundColor: '#000', flexShrink: 0 }} />
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ padding: '16px', border: '1px solid #000000', backgroundColor: '#ffffff' }}>
                        <h5 style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          [GOODS // OFFICIAL MERCH & FIGURES]
                        </h5>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {activeDossierData.catalog.officialMerch.map((g, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#000000', paddingBottom: '6px', borderBottom: '1px solid #f5f5f5', fontFamily: 'monospace' }}>
                              <span style={{ width: '4px', height: '4px', backgroundColor: '#000', flexShrink: 0 }} />
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Panel 4: Fan Experience & POB */}
                {modalActiveTab === 'fan' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Media Spotlight */}
                    <div 
                      style={{
                        padding: '16px',
                        border: '1px solid #000000',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '16px',
                        alignItems: 'center',
                      }}
                      className="flex-col sm:flex-row"
                    >
                      <div 
                        style={{
                          width: '180px',
                          height: '96px',
                          backgroundColor: '#000000',
                          color: '#ffffff',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          textAlign: 'center',
                          padding: '8px',
                        }}
                      >
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">[FILM TEASER]</span>
                        <span style={{ fontSize: '9px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#a3a3a3' }}>
                          {activeDossierData.fanExperience.mediaTeaser.type}
                        </span>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#ffffff', fontWeight: 800 }}>
                          {activeDossierData.fanExperience.mediaTeaser.duration}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#737373', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                          SPOTLIGHT TEASER
                        </span>
                        <h5 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '16px', fontWeight: 800, margin: '0 0 4px 0', color: '#000000' }}>
                          {activeDossierData.fanExperience.mediaTeaser.title}
                        </h5>
                        <p style={{ fontSize: '12px', color: '#525252', margin: 0, lineHeight: 1.5 }}>
                          {activeDossierData.fanExperience.mediaTeaser.description}
                        </p>
                      </div>
                    </div>

                    {/* Fandom Colors & Fanchant */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div style={{ padding: '16px', border: '1px solid #000000', backgroundColor: '#ffffff' }}>
                        <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#737373', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                          OFFICIAL FANDOM COLOR PALETTE
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {activeDossierData.fanExperience.officialColors.map((color, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span 
                                  style={{
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '0px',
                                    backgroundColor: color.hex,
                                    border: '1px solid #000000',
                                    display: 'inline-block',
                                  }} 
                                />
                                <span style={{ fontWeight: 700, color: '#000000', fontFamily: 'monospace' }}>{color.name}</span>
                              </div>
                              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#737373' }}>{color.hex}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ padding: '16px', border: '1px solid #000000', backgroundColor: '#ffffff' }}>
                        <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#737373', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                          CANONICAL FANCHANT MOTTO
                        </span>
                        <p 
                          style={{
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            backgroundColor: '#f5f5f5',
                            padding: '10px 12px',
                            border: '1px solid #000000',
                            color: '#000000',
                            lineHeight: 1.5,
                            margin: 0,
                            fontStyle: 'italic',
                          }}
                        >
                          "{activeDossierData.fanExperience.fanchantSnippet}"
                        </p>
                      </div>
                    </div>

                    {/* Pre-Order Benefits (POB) */}
                    <div 
                      style={{
                        padding: '16px',
                        border: '1.5px solid #000000',
                        backgroundColor: '#f5f5f5',
                      }}
                    >
                      <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#000000', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        PRE-ORDER BENEFITS (POB) & EXCLUSIVE EARLY-BUYER PERKS:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {activeDossierData.fanExperience.preOrderBenefits.map((pob, idx) => (
                          <div 
                            key={idx} 
                            style={{
                              padding: '8px 10px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #000000',
                              fontSize: '11px',
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: '#000000',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span className="font-bold">★</span>
                            <span>{pob}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Community Links */}
                    <div>
                      <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#737373', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        OFFICIAL COMMUNITY & GLOBAL FAN HUBS
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {activeDossierData.fanExperience.communityChannels.map((ch, i) => (
                          <a
                            key={i}
                            href={ch.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #000000',
                              fontSize: '11px',
                              fontFamily: 'monospace',
                              color: '#000000',
                              textDecoration: 'none',
                              fontWeight: 700,
                            }}
                            className="hover:bg-black hover:text-white transition-colors"
                          >
                            <span>{ch.name} ({ch.platform})</span>
                            <span className="font-mono">↗</span>
                          </a>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div 
                style={{
                  padding: '14px 24px',
                  borderTop: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8' }}>
                  ARCHIVE ID: #{activeDossierArtist.id.toUpperCase()}-2026
                </span>
                <button
                  onClick={() => setActiveDossierArtist(null)}
                  type="button"
                  style={{
                    padding: '8px 18px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: '1.5px solid #000000',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  Close Dossier
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Toast Notification */}
        {dossierToast && (
          <div className="fixed bottom-6 right-6 z-50 p-3 bg-[#ccff00] text-black border-2 border-black font-mono font-black text-xs shadow-[4px_4px_0px_#000] flex items-center gap-2 animate-in fade-in duration-150">
            <Bookmark className="w-4 h-4 fill-black" />
            <span>{dossierToast}</span>
          </div>
        )}

        {/* Share Dialog Modal */}
        {sharingItem && (
          <div 
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => {
              setSharingItem(null);
              setCopiedShareLink(false);
            }}
          >
            <div 
              style={{ borderRadius: '0px' }}
              className="bg-white max-w-sm w-full p-5 border-3 border-black shadow-[6px_6px_0px_#000] space-y-4 font-mono text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#ff2e93]" />
                  <span className="text-xs font-black uppercase">SHARE {sharingItem.type.toUpperCase()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSharingItem(null);
                    setCopiedShareLink(false);
                  }}
                  className="text-xs font-black hover:text-[#ff2e93] cursor-pointer"
                >
                  [✕]
                </button>
              </div>

              <div>
                <h4 className="font-bold text-sm truncate font-sans text-black">{sharingItem.title}</h4>
                <p className="text-[11px] text-neutral-600 line-clamp-1 mt-0.5">{sharingItem.subtitle}</p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(sharingItem.url);
                    setCopiedShareLink(true);
                    setTimeout(() => setCopiedShareLink(false), 2000);
                  }}
                  className="w-full py-2 px-3 bg-[#ffd60a] hover:bg-[#ff2e93] hover:text-white border-2 border-black text-xs font-black uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-[2px_2px_0px_#000]"
                >
                  {copiedShareLink ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedShareLink ? 'COPIED TO CLIPBOARD!' : 'COPY DIRECT LINK'}</span>
                </button>

                <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-center font-bold">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${sharingItem.title} on Fan Hub Plus! ${sharingItem.url}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border-2 border-black bg-neutral-100 hover:bg-black hover:text-white transition-colors"
                  >
                    X / TWITTER
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharingItem.url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border-2 border-black bg-neutral-100 hover:bg-[#1877f2] hover:text-white transition-colors"
                  >
                    FACEBOOK
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(sharingItem.url)}&text=${encodeURIComponent(sharingItem.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border-2 border-black bg-neutral-100 hover:bg-[#229ed9] hover:text-white transition-colors"
                  >
                    TELEGRAM
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
