import { Album, Artist, TourEvent } from '../types';
import { DomainThemeId } from '../context/DomainContext';

export function filterAlbumsByDomain(
  albums: Album[],
  domain: DomainThemeId,
  subCategory: string = 'all'
): Album[] {
  if (domain === 'classic' && subCategory === 'all') return albums;

  return albums.filter((album) => {
    const cat = album.category ? album.category.toLowerCase() : '';
    const type = album.type ? album.type.toLowerCase() : '';
    const artistId = album.artistId ? album.artistId.toLowerCase() : '';

    if (domain === 'music') {
      if (subCategory === 'all') return cat === 'k-pop' || cat === 'v-pop' || cat === 'anime' || cat === 'movie' || type.includes('ost') || type.includes('vinyl');
      if (subCategory === 'kpop') return cat === 'k-pop';
      if (subCategory === 'vpop') return cat === 'v-pop';
      if (subCategory === 'usuk') return cat === 'movie' || artistId === 'spider-verse' || artistId === 'dune';
      if (subCategory === 'ost') return cat === 'anime' || cat === 'movie' || cat === 'gaming' || type.includes('ost');
      if (subCategory === 'edm') return type.includes('vinyl') || album.id === 'ghibli-vinyl' || album.id === 'dune2-ost' || album.id === 'aespa-armageddon';
    }

    if (domain === 'tech') {
      if (subCategory === 'all') return cat === 'gaming' || cat === 'anime' || artistId === 'aespa' || type.includes('lightstick') || type.includes('kit');
      if (subCategory === 'gaming') return cat === 'gaming' || artistId === 'genshin' || artistId === 'elden-ring' || artistId === 'ffvii';
      if (subCategory === 'cyber') return artistId === 'aespa' || artistId === 'spider-verse' || cat === 'gaming';
      if (subCategory === 'hardware') return type.includes('lightstick') || type.includes('kit') || type.includes('box');
      if (subCategory === 'anime_tech') return cat === 'anime';
    }

    if (domain === 'art') {
      if (subCategory === 'all') return artistId === 'ghibli' || artistId === 'blackpink' || artistId === 'dune' || type.includes('vinyl') || type.includes('box');
      if (subCategory === 'ghibli') return artistId === 'ghibli';
      if (subCategory === 'editorial') return artistId === 'blackpink' || artistId === 'dune' || type.includes('vinyl');
      if (subCategory === 'artbook') return type.includes('box') || type.includes('kit') || album.id === 'bts-proof';
      if (subCategory === 'indie') return artistId === 'ghibli' || type.includes('vinyl');
    }

    if (domain === 'sports') {
      if (subCategory === 'all') return artistId === 'blackpink' || artistId === 'bts' || artistId === 'straykids' || artistId === 'aespa' || cat === 'gaming';
      if (subCategory === 'stadium') return artistId === 'blackpink' || artistId === 'bts' || artistId === 'straykids';
      if (subCategory === 'workout') return artistId === 'straykids' || artistId === 'aespa' || artistId === 'one-piece';
      if (subCategory === 'athletic') return type.includes('lightstick') || type.includes('kit');
      if (subCategory === 'esports') return cat === 'gaming';
    }

    if (domain === 'fandom') {
      if (subCategory === 'all') return cat === 'k-pop' || cat === 'v-pop' || cat === 'anime';
      if (subCategory === 'kpop_fandom') return cat === 'k-pop';
      if (subCategory === 'vpop_fandom') return cat === 'v-pop';
      if (subCategory === 'anime_fandom') return cat === 'anime';
      if (subCategory === 'vocaloid') return artistId === 'one-piece' || artistId === 'aespa';
      if (subCategory === 'fanart') return type.includes('box') || type.includes('kit') || type.includes('lightstick');
    }

    if (domain === 'classic') {
      if (subCategory === 'kpop') return cat === 'k-pop';
      if (subCategory === 'vpop') return cat === 'v-pop';
      if (subCategory === 'anime') return cat === 'anime' || cat === 'movie';
      if (subCategory === 'gaming') return cat === 'gaming';
      if (subCategory === 'art') return artistId === 'ghibli' || cat === 'movie';
    }

    return true;
  });
}

export function filterArtistsByDomain(
  artists: Artist[],
  domain: DomainThemeId,
  subCategory: string = 'all'
): Artist[] {
  if (domain === 'classic' && subCategory === 'all') return artists;

  return artists.filter((artist) => {
    const cat = artist.category ? artist.category.toLowerCase() : '';
    const id = artist.id.toLowerCase();

    if (domain === 'music') {
      if (subCategory === 'all') return cat === 'k-pop' || cat === 'v-pop' || cat === 'anime' || cat === 'movie';
      if (subCategory === 'kpop') return cat === 'k-pop';
      if (subCategory === 'vpop') return cat === 'v-pop';
      if (subCategory === 'usuk') return cat === 'movie' || id === 'spider-verse' || id === 'dune';
      if (subCategory === 'ost') return cat === 'anime' || cat === 'movie' || cat === 'gaming';
      if (subCategory === 'edm') return id === 'ghibli' || id === 'aespa' || cat === 'gaming';
    }

    if (domain === 'tech') {
      if (subCategory === 'all') return cat === 'gaming' || cat === 'anime' || id === 'aespa';
      if (subCategory === 'gaming') return cat === 'gaming';
      if (subCategory === 'cyber') return id === 'aespa' || id === 'spider-verse';
      if (subCategory === 'hardware') return cat === 'gaming' || id === 'bts';
      if (subCategory === 'anime_tech') return cat === 'anime';
    }

    if (domain === 'art') {
      if (subCategory === 'all') return id === 'ghibli' || id === 'blackpink' || id === 'dune' || cat === 'movie';
      if (subCategory === 'ghibli') return id === 'ghibli';
      if (subCategory === 'editorial') return id === 'blackpink' || id === 'dune';
      if (subCategory === 'artbook') return id === 'bts' || id === 'one-piece';
      if (subCategory === 'indie') return id === 'ghibli';
    }

    if (domain === 'sports') {
      if (subCategory === 'all') return cat === 'k-pop' || cat === 'gaming';
      if (subCategory === 'stadium') return id === 'blackpink' || id === 'bts' || id === 'straykids';
      if (subCategory === 'workout') return id === 'straykids' || id === 'aespa';
      if (subCategory === 'athletic') return cat === 'k-pop';
      if (subCategory === 'esports') return cat === 'gaming';
    }

    if (domain === 'fandom') {
      if (subCategory === 'all') return cat === 'k-pop' || cat === 'v-pop' || cat === 'anime';
      if (subCategory === 'kpop_fandom') return cat === 'k-pop';
      if (subCategory === 'vpop_fandom') return cat === 'v-pop';
      if (subCategory === 'anime_fandom') return cat === 'anime';
      if (subCategory === 'vocaloid') return id === 'one-piece' || id === 'aespa';
      if (subCategory === 'fanart') return cat === 'k-pop' || cat === 'v-pop' || cat === 'anime';
    }

    if (domain === 'classic') {
      if (subCategory === 'kpop') return cat === 'k-pop';
      if (subCategory === 'vpop') return cat === 'v-pop';
      if (subCategory === 'anime') return cat === 'anime';
      if (subCategory === 'gaming') return cat === 'gaming';
      if (subCategory === 'art') return cat === 'movie' || id === 'ghibli';
    }

    return true;
  });
}
