import Cookie from 'js-cookie'

export const getServerCookie = (key, req) => {
  if (!req.headers.cookie) {
    return undefined
  }
  const cookie = req.headers.cookie.split(';').find(c => c.trim().startsWith(`${key}=`))
  if (!cookie) {
    return undefined
  }
  return cookie ? cookie.split('=')[1] : undefined;
}

export default {
  setItem: (key, value) => {
    if (!process.browser) return;
    Cookie.set(key, value, { expires: 1, path: '/' });
  },

  removeItem: key => {
    if (!process.browser) return;

    Cookie.remove(key, { expires: 1 });
  },

  getItem: (key, req) => {
    return req ? getServerCookie(key, req) : Cookie.get(key);
  },
};