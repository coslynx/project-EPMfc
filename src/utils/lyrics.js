const fetch = require('node-fetch');
const { geniusAccessToken } = require('../config.js');

/**
 * Retrieves lyrics for a song using the Genius API.
 *
 * @param {string} songTitle The title of the song.
 * @param {string} artistName The name of the artist.
 * @returns {Promise<string>} A promise that resolves to the lyrics, or null if no lyrics are found.
 */
const getLyrics = async (songTitle, artistName) => {
  try {
    const response = await fetch(
      `https://api.genius.com/search?q=${encodeURIComponent(
        `${songTitle} ${artistName}`
      )}`,
      {
        headers: {
          Authorization: `Bearer ${geniusAccessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Genius API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.response.hits.length === 0) {
      return null;
    }

    const song = data.response.hits[0].result;

    // Extract lyrics from the song's page
    const lyricsUrl = song.path;
    const lyricsResponse = await fetch(lyricsUrl);

    if (!lyricsResponse.ok) {
      throw new Error(
        `Failed to fetch lyrics from Genius: ${lyricsResponse.status}`
      );
    }

    const lyricsHtml = await lyricsResponse.text();

    // Parse lyrics from the HTML using a library like Cheerio
    // const $ = cheerio.load(lyricsHtml);
    // const lyrics = $('.lyrics').text().trim();
    // return lyrics;

    // Example for demonstration (without Cheerio):
    const startIndex = lyricsHtml.indexOf('<div class="lyrics">');
    const endIndex = lyricsHtml.indexOf('</div>', startIndex);
    const lyrics = lyricsHtml
      .substring(startIndex + '<div class="lyrics">'.length, endIndex)
      .trim();
    return lyrics;
  } catch (error) {
    console.error('Error retrieving lyrics:', error);
    return null;
  }
};

module.exports = {
  getLyrics,
};