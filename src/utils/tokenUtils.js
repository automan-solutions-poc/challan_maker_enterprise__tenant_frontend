export function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // convert to milliseconds
    return Date.now() > exp;
  } catch (e) {
    console.error("Invalid token:", e);
    return true;
  }
}
