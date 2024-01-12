async function getCookie() {
  return chrome.cookies.get({
    name: "accessToken",
    url: FRONTEND_URL,
  });
}

async function setCookie() {
  const cookie = await getCookie();
  if (cookie) {
    const extensionCookie = {
      url: API_URL,
      name: cookie.name,
      value: cookie.value,
    };
    const cookieRes = await chrome.cookies.set(extensionCookie);
    if (cookieRes) {
      return cookie;
    }
  }
  return false;
}

setCookie();
