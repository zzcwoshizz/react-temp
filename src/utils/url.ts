// search字符串转为对象
export function parseSearch(search?: string) {
  if (!search) {
    return {};
  }
  if (search.charAt(0) === '?') {
    search = search.slice(1);
  }
  const arr = search.split('&');
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    const p = arr[i].split('=');
    if (p.length !== 2) {
      continue;
    }
    obj[p[0]] = decodeURIComponent(p[1]);
  }
  return obj;
}
