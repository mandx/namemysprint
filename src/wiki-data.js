import _keys from 'lodash/keys';


const CACHE = {};


function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}


export default function fetchWikiData(make, model) {
  const
    corsProxy = '//cors-anywhere.herokuapp.com/',
    url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=images%7Cextracts%7Cimageinfo&titles=${encodeURIComponent(make + ' ' + model)}&utf8=1&exintro=1&explaintext=1&iiprop=url%7Ccanonicaltitle`;

  if (CACHE[url]) {
    return Promise.resolve(CACHE[url]);
  }

  return fetch(corsProxy + url).then(checkStatus).then(function (data) {
    const
      { pages } = data.query,
      result = pages[_keys(pages)[0]];
      CACHE[url] = result;
      return result;
  });
}
