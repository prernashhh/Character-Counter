'use client';

import { useState, useEffect } from 'react';
import RichTextEditor from '@/components/admin/RichTextEditor';

const defaultSeoSettings = {
  home: { metaTitle: 'Character Counter', metaDescription: 'Count characters, words, sentences, paragraphs, and spaces instantly with the Character Count Online Tool.', ogImage: '/og-image.svg', ogImagePublicId: '' },
  aboutUs: { metaTitle: 'About Us | Character Count Online Tool', metaDescription: 'Learn about Character Count Online Tool, our mission, and how we help users analyze text quickly and accurately.', ogImage: '/og-image.svg', ogImagePublicId: '' },
  contactUs: { metaTitle: 'Contact Us | Character Count Online Tool', metaDescription: 'Contact Character Count Online Tool for support, questions, or feedback.', ogImage: '/og-image.svg', ogImagePublicId: '' },
  termsConditions: { metaTitle: 'Terms and Conditions | Character Count Online Tool', metaDescription: 'Read the terms and conditions for using Character Count Online Tool.', ogImage: '/og-image.svg', ogImagePublicId: '' },
  disclaimer: { metaTitle: 'Disclaimer | Character Count Online Tool', metaDescription: 'Read the legal disclaimer for Character Count Online Tool.', ogImage: '/og-image.svg', ogImagePublicId: '' },
  privacyPolicy: { metaTitle: 'Privacy Policy | Character Count Online Tool', metaDescription: 'Read the privacy policy for Character Count Online Tool.', ogImage: '/og-image.svg', ogImagePublicId: '' },
  blog: { metaTitle: 'Blog | Character Count Online Tool', metaDescription: 'Read the latest blog posts from Character Count Online Tool.', ogImage: '/og-image.svg', ogImagePublicId: '' },
};

const pageSeoOptions = [
  { key: 'home', label: 'Home Page' },
  { key: 'aboutUs', label: 'About Us Page' },
  { key: 'contactUs', label: 'Contact Us Page' },
  { key: 'termsConditions', label: 'Terms & Conditions Page' },
  { key: 'privacyPolicy', label: 'Privacy Policy Page' },
  { key: 'disclaimer', label: 'Disclaimer Page' },
  { key: 'blog', label: 'Blog Page' },
];

const DB_PAGE_BY_UI = {
  home: 'home',
  aboutUs: 'aboutus',
  contactUs: 'contactus',
  termsConditions: 'termsconditions',
  privacyPolicy: 'privacypolicy',
  disclaimer: 'disclaimer',
  blog: 'blog',
};

const UI_PAGE_BY_DB = Object.entries(DB_PAGE_BY_UI).reduce((acc, [uiKey, dbKey]) => {
  acc[dbKey] = uiKey;
  return acc;
}, {});

const contentLocaleOptions = [
  { code: 'en', label: 'English (Default)' },
  { code: 'af', label: 'Afrikaans' },
  { code: 'ar', label: 'Arabic' },
  { code: 'bs', label: 'Bosnian' },
  { code: 'de', label: 'German' },
  { code: 'el', label: 'Greek' },
  { code: 'es', label: 'Spanish' },
  { code: 'fi', label: 'Finnish' },
  { code: 'fr', label: 'French' },
  { code: 'hi', label: 'Hindi' },
  { code: 'hu', label: 'Hungarian' },
  { code: 'id', label: 'Indonesian' },
  { code: 'it', label: 'Italian' },
  { code: 'nl', label: 'Dutch' },
  { code: 'no', label: 'Norwegian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'sv', label: 'Swedish' },
  { code: 'tr', label: 'Turkish' },
  { code: 'zh', label: 'Chinese' },
];

export default function AdminSettings() {
  const [selectedSeoPage, setSelectedSeoPage] = useState('contactUs');
  const [selectedContentLocale, setSelectedContentLocale] = useState('en');
  const [settings, setSettings] = useState({
    aboutContent: '',
    aboutUsContent: {
      sections: [],
      closingText: '',
    },
    socialLinks: {
      instagramUrl: 'https://instagram.com/prerna.9_',
      linkedinUrl: 'https://linkedin.com/in/prerna.9_',
      emailAddress: 'charactercountonlinetool@gmail.com',
    },
    instagramHandle: '',
    instagramUrl: '',
    privacyPolicyContent: '',
    contactUsContent: '',
    contactUsEmail: 'charactercountonlinetool@gmail.com',
    termsConditionsContent: '',
    disclaimerContent: '',
    pageClosingTexts: {
      aboutUs: 'We value your trust and will keep improving this tool for you.',
      contactUs: 'Thank you for reaching out. We appreciate your time and feedback.',
      termsConditions: 'By continuing to use this service, you agree to these terms and conditions.',
      privacyPolicy: 'Your privacy matters to us and we are committed to protecting your data.',
      disclaimer: 'Please use this tool responsibly and review this disclaimer regularly.',
      blog: 'Thanks for reading. Check back soon for more helpful updates.',
    },
    footerCopyrightYear: new Date().getFullYear(),
    headingSettings: {
      h1Text: 'Character Counter',
      h2Text: '',
      h3Text: 'Statistics',
      h4Text: 'About This Tool',
      tone: 'professional',
    },
    seoSettings: defaultSeoSettings,
    localizedContent: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
  });
  const [securityVerified, setSecurityVerified] = useState(false);
  const [securityVerifying, setSecurityVerifying] = useState(false);
  const [securityMessage, setSecurityMessage] = useState('');
  const [adminIdForm, setAdminIdForm] = useState({
    email: '',
  });
  const [adminIdSaving, setAdminIdSaving] = useState(false);
  const [adminIdMessage, setAdminIdMessage] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [ogUploading, setOgUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchAdminProfile();
  }, []);

  const fetchSettings = async () => {
    try {
      const [settingsResponse, seoResponse] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/seo'),
      ]);

      const data = await settingsResponse.json();
      const seoData = await seoResponse.json();

      if (data.success) {
        const aboutUsContent = data.settings.aboutUsContent || { sections: [], closingText: '' };
        const headingSettings = data.settings.headingSettings || {
          h1Text: 'Character Counter',
          h2Text: '',
          h3Text: 'Statistics',
          h4Text: 'About This Tool',
          tone: 'professional',
        };
        const socialLinks = data.settings.socialLinks || {};
        const aboutUsContacts = data.settings.aboutUsContacts || {};
        const seoFromDb = Array.isArray(seoData?.seo)
          ? seoData.seo.reduce((acc, item) => {
              const uiPageKey = UI_PAGE_BY_DB[item.page] || item.page;
              if (!defaultSeoSettings[uiPageKey]) return acc;
              acc[uiPageKey] = {
                metaTitle: item.title || defaultSeoSettings[uiPageKey].metaTitle,
                metaDescription: item.description || defaultSeoSettings[uiPageKey].metaDescription,
                ogImage: item.ogImage || defaultSeoSettings[uiPageKey].ogImage,
                ogImagePublicId: item.ogImagePublicId || '',
              };
              return acc;
            }, {})
          : {};

        setSettings({
          ...data.settings,
          aboutUsContent: {
            sections: aboutUsContent.sections || [],
            closingText: aboutUsContent.closingText || '',
          },
          footerCopyrightYear: data.settings.footerCopyrightYear || new Date().getFullYear(),
          headingSettings: {
            h1Text: headingSettings.h1Text || 'Character Counter',
            h2Text: headingSettings.h2Text || '',
            h3Text: headingSettings.h3Text || 'Statistics',
            h4Text: headingSettings.h4Text || 'About This Tool',
            tone: headingSettings.tone || 'professional',
          },
          socialLinks: {
            instagramUrl: socialLinks.instagramUrl || aboutUsContacts.instagramUrl || 'https://instagram.com/prerna.9_',
            linkedinUrl: socialLinks.linkedinUrl || aboutUsContacts.linkedinUrl || 'https://linkedin.com/in/prerna.9_',
            emailAddress: socialLinks.emailAddress || aboutUsContacts.gmail || 'charactercountonlinetool@gmail.com',
          },
          contactUsContent: data.settings.contactUsContent || '',
          contactUsEmail: data.settings.contactUsEmail || socialLinks.emailAddress || 'charactercountonlinetool@gmail.com',
          termsConditionsContent: data.settings.termsConditionsContent || '',
          disclaimerContent: data.settings.disclaimerContent || '',
          pageClosingTexts: {
            aboutUs: data.settings.pageClosingTexts?.aboutUs || 'We value your trust and will keep improving this tool for you.',
            contactUs: data.settings.pageClosingTexts?.contactUs || 'Thank you for reaching out. We appreciate your time and feedback.',
            termsConditions: data.settings.pageClosingTexts?.termsConditions || 'By continuing to use this service, you agree to these terms and conditions.',
            privacyPolicy: data.settings.pageClosingTexts?.privacyPolicy || 'Your privacy matters to us and we are committed to protecting your data.',
            disclaimer: data.settings.pageClosingTexts?.disclaimer || 'Please use this tool responsibly and review this disclaimer regularly.',
            blog: data.settings.pageClosingTexts?.blog || 'Thanks for reading. Check back soon for more helpful updates.',
          },
          seoSettings: {
            ...defaultSeoSettings,
            ...seoFromDb,
          },
          localizedContent: data.settings.localizedContent || {},
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch('/api/admin/me');
      const data = await response.json();

      if (data.authenticated && data.admin?.email) {
        setAdminEmail(data.admin.email);
        setAdminIdForm({ email: data.admin.email });
      }
    } catch {
      setAdminEmail('');
    }
  };

  const addAboutUsSection = () => {
    setSettings((prev) => {
      const current = getCurrentAboutUsContent(prev);
      const nextSections = [...(current.sections || []), { heading: '', content: '' }];

      if (selectedContentLocale === 'en') {
        return {
          ...prev,
          aboutUsContent: {
            ...current,
            sections: nextSections,
          },
        };
      }

      const localeBlock = getCurrentLocaleBlock(prev);
      return {
        ...prev,
        localizedContent: {
          ...(prev.localizedContent || {}),
          [selectedContentLocale]: {
            ...localeBlock,
            aboutUsContent: {
              ...current,
              sections: nextSections,
            },
          },
        },
      };
    });
  };

  const removeAboutUsSection = (index) => {
    setSettings((prev) => {
      const current = getCurrentAboutUsContent(prev);
      const nextSections = (current.sections || []).filter((_, i) => i !== index);

      if (selectedContentLocale === 'en') {
        return {
          ...prev,
          aboutUsContent: {
            ...current,
            sections: nextSections,
          },
        };
      }

      const localeBlock = getCurrentLocaleBlock(prev);
      return {
        ...prev,
        localizedContent: {
          ...(prev.localizedContent || {}),
          [selectedContentLocale]: {
            ...localeBlock,
            aboutUsContent: {
              ...current,
              sections: nextSections,
            },
          },
        },
      };
    });
  };

  const updateAboutUsSection = (index, field, value) => {
    setSettings((prev) => {
      const current = getCurrentAboutUsContent(prev);
      const updatedSections = [...(current.sections || [])];
      updatedSections[index] = {
        ...(updatedSections[index] || {}),
        [field]: value,
      };

      if (selectedContentLocale === 'en') {
        return {
          ...prev,
          aboutUsContent: {
            ...current,
            sections: updatedSections,
          },
        };
      }

      const localeBlock = getCurrentLocaleBlock(prev);
      return {
        ...prev,
        localizedContent: {
          ...(prev.localizedContent || {}),
          [selectedContentLocale]: {
            ...localeBlock,
            aboutUsContent: {
              ...current,
              sections: updatedSections,
            },
          },
        },
      };
    });
  };

  const getCurrentLocaleBlock = (source = settings) => {
    return source.localizedContent?.[selectedContentLocale] || {};
  };

  const getCurrentAboutUsContent = (source = settings) => {
    if (selectedContentLocale === 'en') {
      return source.aboutUsContent || { sections: [], closingText: '' };
    }

    return getCurrentLocaleBlock(source).aboutUsContent || source.aboutUsContent || { sections: [], closingText: '' };
  };

  const getCurrentFieldValue = (field, fallback = '') => {
    if (selectedContentLocale === 'en') {
      return settings[field] ?? fallback;
    }

    const localeBlock = getCurrentLocaleBlock();
    return localeBlock[field] ?? settings[field] ?? fallback;
  };

  const updateCurrentFieldValue = (field, value) => {
    setSettings((prev) => {
      if (selectedContentLocale === 'en') {
        return { ...prev, [field]: value };
      }

      const localeBlock = prev.localizedContent?.[selectedContentLocale] || {};
      return {
        ...prev,
        localizedContent: {
          ...(prev.localizedContent || {}),
          [selectedContentLocale]: {
            ...localeBlock,
            [field]: value,
          },
        },
      };
    });
  };

  const getCurrentClosingText = (key) => {
    if (selectedContentLocale === 'en') {
      return settings.pageClosingTexts?.[key] || '';
    }

    const localeClosings = getCurrentLocaleBlock().pageClosingTexts || {};
    return localeClosings[key] ?? settings.pageClosingTexts?.[key] ?? '';
  };

  const updateCurrentClosingText = (key, value) => {
    setSettings((prev) => {
      if (selectedContentLocale === 'en') {
        return {
          ...prev,
          pageClosingTexts: {
            ...prev.pageClosingTexts,
            [key]: value,
          },
        };
      }

      const localeBlock = prev.localizedContent?.[selectedContentLocale] || {};
      return {
        ...prev,
        localizedContent: {
          ...(prev.localizedContent || {}),
          [selectedContentLocale]: {
            ...localeBlock,
            pageClosingTexts: {
              ...(localeBlock.pageClosingTexts || {}),
              [key]: value,
            },
          },
        },
      };
    });
  };

  const updateSeoField = (pageKey, field, value) => {
    setSettings((prev) => ({
      ...prev,
      seoSettings: {
        ...prev.seoSettings,
        [pageKey]: {
          ...prev.seoSettings[pageKey],
          [field]: value,
        },
      },
    }));
  };

  const handleSeoOgUpload = async (file) => {
    if (!file) return;

    setOgUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'seo-og');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(`Error: ${data.error || 'Failed to upload OG image'}`);
        return;
      }

      updateSeoField(selectedSeoPage, 'ogImage', data.url || '');
      updateSeoField(selectedSeoPage, 'ogImagePublicId', data.public_id || '');
      setMessage('OG image uploaded. Click Save Settings to apply this change.');
    } catch {
      setMessage('Error: Failed to upload OG image');
    } finally {
      setOgUploading(false);
    }
  };

  const handleRemoveSeoOg = () => {
    updateSeoField(selectedSeoPage, 'ogImage', '');
    updateSeoField(selectedSeoPage, 'ogImagePublicId', '');
    setMessage('OG image removed for selected page. Click Save Settings to apply this change.');
  };

  const handleVerifyCurrentPassword = async (e) => {
    e.preventDefault();
    setSecurityMessage('');
    setSecurityVerified(false);

    if (!securityForm.currentPassword) {
      setSecurityMessage('Error: Enter current password to continue.');
      return;
    }

    setSecurityVerifying(true);
    try {
      const response = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: securityForm.currentPassword }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSecurityMessage(`Error: ${data.error || 'Current password is incorrect.'}`);
        return;
      }

      setSecurityVerified(true);
      setSecurityMessage('Current password verified. You can now update Admin ID or password.');
    } catch {
      setSecurityMessage('Error: Could not verify current password.');
    } finally {
      setSecurityVerifying(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    if (!securityVerified) {
      setPasswordMessage('Error: Verify current password first.');
      return;
    }

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage('Error: New password and confirm password are required.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage('Error: New password must be at least 8 characters.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('Error: New password and confirm password do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      const response = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setPasswordMessage(`Error: ${data.error || 'Could not update password.'}`);
        return;
      }

      setPasswordMessage('Password updated successfully.');
      setPasswordForm({
        newPassword: '',
        confirmPassword: '',
      });
      setSecurityForm({ currentPassword: '' });
      setSecurityVerified(false);
    } catch {
      setPasswordMessage('Error: Failed to update password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleAdminIdUpdate = async (e) => {
    e.preventDefault();
    setAdminIdMessage('');

    const nextEmail = (adminIdForm.email || '').trim().toLowerCase();

    if (!securityVerified) {
      setAdminIdMessage('Error: Verify current password first.');
      return;
    }

    if (!nextEmail) {
      setAdminIdMessage('Error: Admin ID (email) is required.');
      return;
    }

    setAdminIdSaving(true);
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: nextEmail,
          currentPassword: securityForm.currentPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setAdminIdMessage(`Error: ${data.error || 'Could not update admin ID.'}`);
        return;
      }

      setAdminEmail(nextEmail);
      setAdminIdForm({
        email: nextEmail,
      });
      setAdminIdMessage('Admin ID updated successfully.');
      setSecurityForm({ currentPassword: '' });
      setSecurityVerified(false);
    } catch {
      setAdminIdMessage('Error: Failed to update admin ID.');
    } finally {
      setAdminIdSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const { seoSettings, ...nonSeoSettings } = settings;
      const selectedSeo = seoSettings?.[selectedSeoPage] || defaultSeoSettings[selectedSeoPage];

      const settingsResponse = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nonSeoSettings,
          locale: selectedContentLocale,
        }),
      });

      const seoResponse = await fetch('/api/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: DB_PAGE_BY_UI[selectedSeoPage] || selectedSeoPage,
          title: selectedSeo.metaTitle || '',
          description: selectedSeo.metaDescription || '',
          ogImage: selectedSeo.ogImage || '',
          ogImagePublicId: selectedSeo.ogImagePublicId || '',
        }),
      });

      const data = await settingsResponse.json();
      const seoData = await seoResponse.json();

      if (data.success && seoData.success) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + (data.error || seoData.error || 'Unable to save settings'));
      }
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="mt-2 text-gray-600">Manage site settings and configurations</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Content Language</label>
          <select
            value={selectedContentLocale}
            onChange={(e) => setSelectedContentLocale(e.target.value)}
            className="w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            {contentLocaleOptions.map((option) => (
              <option key={option.code} value={option.code}>{option.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Changes are saved for the selected language. English remains the fallback.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Tool</h3>
          <label className="block text-sm font-medium text-gray-700 mb-2">About This Tool Content</label>
          <RichTextEditor
            value={getCurrentFieldValue('aboutContent', '')}
            onChange={(value) => {
              updateCurrentFieldValue('aboutContent', value);
            }}
            minHeightClass="min-h-64"
            placeholder="Enter about this tool content..."
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            About Us Page Content
          </h3>
          
          <div className="space-y-6">
            {/* Sections */}
            <div className="space-y-4">
              {getCurrentAboutUsContent().sections.map((section, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Section {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeAboutUsSection(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heading
                      </label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => updateAboutUsSection(index, 'heading', e.target.value)}
                        placeholder="e.g., Our Mission, Features, Why Choose Us"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <RichTextEditor
                        value={section.content}
                        onChange={(value) => updateAboutUsSection(index, 'content', value)}
                        minHeightClass="min-h-44"
                        placeholder="Enter the content for this section..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">About Us Closing Text</label>
                <textarea
                  rows={2}
                  value={getCurrentClosingText('aboutUs')}
                  onChange={(e) => updateCurrentClosingText('aboutUs', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Social Media Links
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Used across About Us and homepage Connect with us section. Update once here.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.socialLinks?.instagramUrl || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: {
                    ...settings.socialLinks,
                    instagramUrl: e.target.value,
                  },
                })}
                placeholder="https://instagram.com/yourusername"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={settings.socialLinks?.linkedinUrl || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: {
                    ...settings.socialLinks,
                    linkedinUrl: e.target.value,
                  },
                })}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.socialLinks?.emailAddress || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: {
                    ...settings.socialLinks,
                    emailAddress: e.target.value,
                  },
                })}
                placeholder="youremail@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email (used on Contact Us page)</label>
                <input
                  type="email"
                  value={getCurrentFieldValue('contactUsEmail', '')}
                  onChange={(e) => updateCurrentFieldValue('contactUsEmail', e.target.value)}
                  placeholder="charactercountonlinetool@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <label className="block text-sm font-medium text-gray-700">Contact Us Content</label>
              <RichTextEditor
                value={getCurrentFieldValue('contactUsContent', '')}
                onChange={(value) => updateCurrentFieldValue('contactUsContent', value)}
                minHeightClass="min-h-64"
                placeholder="Enter contact page content..."
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Us Closing Text</label>
                <textarea
                  rows={2}
                  value={getCurrentClosingText('contactUs')}
                  onChange={(e) => updateCurrentClosingText('contactUs', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions Section</h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Terms & Conditions Content</label>
              <RichTextEditor
                value={getCurrentFieldValue('termsConditionsContent', '')}
                onChange={(value) => updateCurrentFieldValue('termsConditionsContent', value)}
                minHeightClass="min-h-64"
                placeholder="Enter terms and conditions content..."
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions Closing Text</label>
                <textarea
                  rows={2}
                  value={getCurrentClosingText('termsConditions')}
                  onChange={(e) => updateCurrentClosingText('termsConditions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Privacy Policy
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Privacy Policy Content
                </label>
                <RichTextEditor
                  value={getCurrentFieldValue('privacyPolicyContent', '')}
                  onChange={(value) => updateCurrentFieldValue('privacyPolicyContent', value)}
                  minHeightClass="min-h-64"
                  placeholder="Enter your privacy policy content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Policy Closing Text</label>
                <textarea
                  rows={2}
                  value={getCurrentClosingText('privacyPolicy')}
                  onChange={(e) => updateCurrentClosingText('privacyPolicy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Disclaimer Section</h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Disclaimer Content</label>
              <RichTextEditor
                value={getCurrentFieldValue('disclaimerContent', '')}
                onChange={(value) => updateCurrentFieldValue('disclaimerContent', value)}
                minHeightClass="min-h-64"
                placeholder="Enter disclaimer content..."
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disclaimer Closing Text</label>
                <textarea
                  rows={2}
                  value={getCurrentClosingText('disclaimer')}
                  onChange={(e) => updateCurrentClosingText('disclaimer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage SEO title, description, and OG image from one place.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Page</label>
                <select
                  value={selectedSeoPage}
                  onChange={(e) => setSelectedSeoPage(e.target.value)}
                  className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                >
                  {pageSeoOptions.map((option) => (
                    <option key={option.key} value={option.key}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={settings.seoSettings?.[selectedSeoPage]?.metaTitle || ''}
                    onChange={(e) => updateSeoField(selectedSeoPage, 'metaTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    placeholder="SEO title for selected page"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea
                    rows={3}
                    value={settings.seoSettings?.[selectedSeoPage]?.metaDescription || ''}
                    onChange={(e) => updateSeoField(selectedSeoPage, 'metaDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900"
                    placeholder="SEO description for selected page"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">OG Image Upload</label>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleSeoOgUpload(file);
                      e.target.value = '';
                    }}
                    className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-3 file:py-2 file:text-indigo-700 hover:file:bg-indigo-200"
                  />
                  {settings.seoSettings?.[selectedSeoPage]?.ogImage && settings.seoSettings?.[selectedSeoPage]?.ogImage !== '/og-image.svg' && (
                    <button
                      type="button"
                      onClick={handleRemoveSeoOg}
                      className="px-3 py-2 text-sm rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      Remove Image
                    </button>
                  )}
                </div>

                {ogUploading && (
                  <p className="text-xs text-slate-500">Uploading OG image...</p>
                )}

                <p className="text-xs text-slate-500">
                  Recommended aspect ratio: 1200x630 for social sharing previews.
                </p>

                <img
                  src={settings.seoSettings?.[selectedSeoPage]?.ogImage || '/og-image.svg'}
                  alt={`${selectedSeoPage} OG preview`}
                  className="w-full max-w-md h-auto rounded-lg border border-gray-200 bg-white"
                />

                <p className="text-xs text-slate-500 break-all">
                  {settings.seoSettings?.[selectedSeoPage]?.ogImage || '/og-image.svg'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Password and ID</h3>
            <p className="text-sm text-gray-600 mb-4">
              Verify current password once, then update Admin ID or password.
            </p>

            {securityMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${securityMessage.startsWith('Error:') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {securityMessage}
              </div>
            )}

            <form onSubmit={handleVerifyCurrentPassword} className="rounded-lg border border-slate-200 p-4 mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-3">Step 1: Verify Current Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={(e) => {
                      setSecurityForm({ currentPassword: e.target.value });
                      setSecurityVerified(false);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900"
                    autoComplete="current-password"
                  />
                </div>

                <div className="flex md:justify-end">
                  <button
                    type="submit"
                    disabled={securityVerifying}
                    className="px-5 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {securityVerifying ? 'Verifying...' : 'Verify Password'}
                  </button>
                </div>
              </div>
            </form>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-lg border border-slate-200 p-4">
                <h4 className="text-base font-semibold text-gray-900 mb-3">Step 2: Update Admin ID (Email)</h4>
                <p className="text-sm text-gray-600 mb-4">Current Admin ID: {adminEmail || 'Not available'}</p>

                {adminIdMessage && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${adminIdMessage.startsWith('Error:') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {adminIdMessage}
                  </div>
                )}

                <form onSubmit={handleAdminIdUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Admin ID (Email)</label>
                    <input
                      type="email"
                      value={adminIdForm.email}
                      onChange={(e) => setAdminIdForm({ ...adminIdForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      autoComplete="email"
                      disabled={!securityVerified}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={adminIdSaving || !securityVerified}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {adminIdSaving ? 'Updating ID...' : 'Update Admin ID'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <h4 className="text-base font-semibold text-gray-900 mb-3">Step 3: Update Password</h4>
                {passwordMessage && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${passwordMessage.startsWith('Error:') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {passwordMessage}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      autoComplete="new-password"
                      disabled={!securityVerified}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                      autoComplete="new-password"
                      disabled={!securityVerified}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={passwordSaving || !securityVerified}
                      className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {passwordSaving ? 'Updating Password...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer Copyright</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Copyright Year
                </label>
                <input
                  type="number"
                  min="2000"
                  max="9999"
                  value={settings.footerCopyrightYear}
                  onChange={(e) => setSettings({
                    ...settings,
                    footerCopyrightYear: Number(e.target.value || new Date().getFullYear()),
                  })}
                  placeholder="2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Footer preview: Copyright © {settings.footerCopyrightYear} Character Count Online Tool. All rights reserved.
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save All Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

