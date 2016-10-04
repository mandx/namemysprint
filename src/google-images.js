import URI from 'urijs';
import _map from 'lodash/map';

import { checkStatus } from './fetch-utilities';

const
  CSK = 'AIzaSyCIUIuW4WtrfeT3DgIF1UtYEr9-O40M7no',
  CE = '003544854047746055699:crymi0edu6k';


const CACHE = {};


export default function searchGoogleImages(query) {

  const url = URI('https://www.googleapis.com/customsearch/v1')
    .query({
      q: query,
      key: CSK,
      cx: CE,
      searchType: 'image',
    }).toString();

  if (CACHE[url]) {
    return Promise.resolve(CACHE[url]);
  }

  return fetch(url)
    .then(checkStatus)
    .then(function (responseData) {
      const results = _map(
        responseData.items,
        function (item) {
          return {
            title: item.title,
            href: item.image.contextLink,
            src: item.image.thumbnailLink,
            height: item.image.thumbnailHeight,
            width: item.image.thumbnailWidth,
          };
        });

      CACHE[url] = results;
      return results;
    });
}
