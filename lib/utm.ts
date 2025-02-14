import { NextResponse } from "next/server";

export const UTM_COOKIE_NAME = 'utmSource';
export const UTM_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function getUtmSource(cookieStore: any) {
  const store = cookieStore;
  return store.get(UTM_COOKIE_NAME)?.value || 'direct';
}

// Only use this function in server components/API routes
// export function setUtmSourceCookie(response: NextResponse, utmSource: string) {
//   response.cookies.set({
//     name: UTM_COOKIE_NAME,
//     value: utmSource,
//     maxAge: UTM_COOKIE_MAX_AGE,
//     path: '/',
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//   });
// }

export function clearUtmSourceCookie(response: NextResponse) {
  response.cookies.set({
    name: UTM_COOKIE_NAME,
    value: '',
    maxAge: 0,
    path: '/',
  });
  // console.log('clearUtmSourceCookie', response);
  return response;
} 