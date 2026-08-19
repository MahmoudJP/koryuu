import { next } from '@vercel/functions'

const PROJECT_SLUG = 'koryuu'
const APP_NAME = 'Koryuu'
const COOKIE_NAME = '__Host-koryuu_studio'
const SESSION_SECONDS = 12 * 60 * 60
const encoder = new TextEncoder()

type AccessPayload = { purpose: 'launch' | 'session'; projectSlug: string; expiresAt: number }

function decode(value: string) { const normalized = value.replaceAll('-', '+').replaceAll('_', '/'); const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='); return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0)) }
function encode(value: Uint8Array) { let binary = ''; for (const byte of value) binary += String.fromCharCode(byte); return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '') }
async function key(secret: string) { return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']) }
async function createToken(secret: string, payload: AccessPayload) { const body = encode(encoder.encode(JSON.stringify(payload))); const message = `v1.${body}`; const signature = await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(message)); return `${message}.${encode(new Uint8Array(signature))}` }
async function verifyToken(secret: string, token: string | null, purpose: AccessPayload['purpose']) {
  if (!token) return false
  const [version, body, signature, extra] = token.split('.')
  if (version !== 'v1' || !body || !signature || extra) return false
  try { const valid = await crypto.subtle.verify('HMAC', await key(secret), decode(signature), encoder.encode(`${version}.${body}`)); if (!valid) return false; const payload = JSON.parse(new TextDecoder().decode(decode(body))) as AccessPayload; return payload.purpose === purpose && payload.projectSlug === PROJECT_SLUG && Number.isSafeInteger(payload.expiresAt) && payload.expiresAt > Date.now() } catch { return false }
}
function readCookie(request: Request) { for (const item of (request.headers.get('cookie') ?? '').split(';')) { const [name, ...value] = item.trim().split('='); if (name === COOKIE_NAME) return decodeURIComponent(value.join('=')) } return null }
function denied() { return new Response(`<!doctype html><html><head><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width"><title>Private ${APP_NAME}</title></head><body style="font-family:system-ui;background:#080b10;color:#f8fafc;display:grid;place-items:center;min-height:100vh;margin:0"><main style="max-width:32rem;padding:2rem;text-align:center"><h1>Private ${APP_NAME}</h1><p>Open this workspace securely from Mahmoud Studio.</p><a style="color:#60a5fa" href="https://mahmoud.jp/studio">Return to Studio</a></main></body></html>`, { status: 401, headers: { 'Cache-Control': 'private, no-store', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'", 'Content-Type': 'text/html; charset=utf-8', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow, noarchive' } }) }
export default async function middleware(request: Request) {
  const secret = process.env.STUDIO_LAUNCH_SECRET
  if (!secret) return denied()
  const url = new URL(request.url)
  if (await verifyToken(secret, url.searchParams.get('studio_launch'), 'launch')) { const token = await createToken(secret, { purpose: 'session', projectSlug: PROJECT_SLUG, expiresAt: Date.now() + SESSION_SECONDS * 1000 }); url.searchParams.delete('studio_launch'); return new Response(null, { status: 303, headers: { 'Cache-Control': 'private, no-store', Location: url.toString(), 'Referrer-Policy': 'no-referrer', 'Set-Cookie': `${COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${SESSION_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Lax` } }) }
  if (await verifyToken(secret, readCookie(request), 'session')) return next({ headers: { 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow, noarchive' } })
  return denied()
}
