import jsCookie from "js-cookie";

// User-recover-from-cookie
export function getTokenCookie() {
  return jsCookie.get("USER_SESSION_COOKIE");
}
