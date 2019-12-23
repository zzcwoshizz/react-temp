export const combineURL = (baseURL: string, ...restURL) => {
  return !!restURL && restURL.length > 0
    ? baseURL.replace(/\/+$/, '') +
        '/' +
        restURL.map(url => url.replace(/^\/+/, '')).join('/')
    : baseURL;
};
