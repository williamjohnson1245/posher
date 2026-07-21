import Scalekit from '@scalekit-sdk/node';

let client;

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getScalekit() {
  if (!client) {
    client = new Scalekit(
      required('SCALEKIT_ENVIRONMENT_URL'),
      required('SCALEKIT_CLIENT_ID'),
      required('SCALEKIT_CLIENT_SECRET'),
    );
  }
  return client;
}

export function getMagicLinkExpiry() {
  const parsed = Number.parseInt(process.env.MAGIC_LINK_EXPIRES_IN || '600', 10);
  if (!Number.isFinite(parsed)) return 600;
  return Math.min(3600, Math.max(60, parsed));
}

export function getAppOrigin(request) {
  const configured = process.env.APP_URL?.trim();
  const candidate = configured || request.nextUrl.origin;
  const url = new URL(candidate);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('APP_URL must use http or https');
  }

  return url.origin;
}
