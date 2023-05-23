const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://valorant.fandom.com/wiki/Weapon_Skins';

// Mapping object for collection edition to star value
const collectionEditionToStar = {
  Select: 1,
  Deluxe: 2,
  Premium: 3,
  Exclusive: 4,
  Ultra: 5,
};

axios.get(url)
  .then((response) => {
    const $ = cheerio.load(response.data);
    const table = $('.wikitable.sortable');
    const rows = table.find('tbody > tr');

    const data = [];

    rows.each((index, row) => {
      const cells = $(row).find('td');
      const imageElement = cells.eq(0).find('img');
      const imageSrc = imageElement.attr('data-src');
      const collectionEditionElement = cells.eq(1).find('img');
      const collectionEdition = collectionEditionElement.attr('alt');
      const collection = cells.eq(2).find('a').text().trim();
      const weapon = cells.eq(3).find('a').text().trim();
      const star = collectionEditionToStar[collectionEdition] || 0;

      // Check if image element and source exist
      let imageUrl = 'N/A';
      if (imageElement.length > 0 && imageSrc) {
        imageUrl = imageSrc.replace(/\/revision\/.*/, '');
      }

      // Add item to data array if imageUrl is not "N/A" and star is not 0
      if (imageUrl !== 'N/A' && star !== 0) {
        data.push({
          imageUrl,
          collectionEdition,
          collection,
          weapon,
          star,
        });
      }
    });

    // Overwrite data in JSON file
    fs.writeFileSync('weapon_skins.json', JSON.stringify(data, null, 2));
    console.log('Data has been written to weapon_skins.json successfully.');
  })
  .catch((error) => {
    console.log('Error:', error);
  });
