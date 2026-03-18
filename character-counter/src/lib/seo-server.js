import connectDB from '@/lib/db';
import Settings from '@/models/Settings';
import { DEFAULT_SEO_SETTINGS, normalizeSeoSettings } from '@/lib/seo-settings';

export async function getSeoSettingsServer() {
  if (!process.env.MONGODB_URI) {
    return DEFAULT_SEO_SETTINGS;
  }

  try {
    await connectDB();
    const settings = await Settings.findOne().select('seoSettings').lean();
    return normalizeSeoSettings(settings?.seoSettings || {});
  } catch {
    return DEFAULT_SEO_SETTINGS;
  }
}

export async function getPageSeoServer(pageKey) {
  const seo = await getSeoSettingsServer();
  return seo[pageKey] || DEFAULT_SEO_SETTINGS.home;
}
