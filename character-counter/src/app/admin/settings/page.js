'use client';

import { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    aboutContent: '',
    aboutUsContent: {
      sections: [],
      closingText: '',
    },
    aboutUsContacts: {
      instagramUrl: '',
      gmail: '',
      linkedinUrl: '',
    },
    instagramHandle: '',
    instagramUrl: '',
    privacyPolicyContent: '',
    footerCopyrightYear: new Date().getFullYear(),
    headingSettings: {
      h1Text: 'Character Counter',
      h2Text: 'Analyze your text with confidence',
      h3Text: 'Statistics',
      h4Text: 'About This Tool',
      tone: 'professional',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.success) {
        // Ensure aboutUsContent has the proper structure
        const aboutUsContent = data.settings.aboutUsContent || { sections: [], closingText: '' };
        const aboutUsContacts = data.settings.aboutUsContacts || {
          instagramUrl: '',
          gmail: '',
          linkedinUrl: '',
        };
        const headingSettings = data.settings.headingSettings || {
          h1Text: 'Character Counter',
          h2Text: 'Analyze your text with confidence',
          h3Text: 'Statistics',
          h4Text: 'About This Tool',
          tone: 'professional',
        };
        setSettings({
          ...data.settings,
          aboutUsContent: {
            sections: aboutUsContent.sections || [],
            closingText: aboutUsContent.closingText || '',
          },
          aboutUsContacts: {
            instagramUrl: aboutUsContacts.instagramUrl || '',
            gmail: aboutUsContacts.gmail || '',
            linkedinUrl: aboutUsContacts.linkedinUrl || '',
          },
          footerCopyrightYear: data.settings.footerCopyrightYear || new Date().getFullYear(),
          headingSettings: {
            h1Text: headingSettings.h1Text || 'Character Counter',
            h2Text: headingSettings.h2Text || 'Analyze your text with confidence',
            h3Text: headingSettings.h3Text || 'Statistics',
            h4Text: headingSettings.h4Text || 'About This Tool',
            tone: headingSettings.tone || 'professional',
          },
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAboutUsSection = () => {
    setSettings({
      ...settings,
      aboutUsContent: {
        ...settings.aboutUsContent,
        sections: [
          ...settings.aboutUsContent.sections,
          { heading: '', content: '' },
        ],
      },
    });
  };

  const removeAboutUsSection = (index) => {
    setSettings({
      ...settings,
      aboutUsContent: {
        ...settings.aboutUsContent,
        sections: settings.aboutUsContent.sections.filter((_, i) => i !== index),
      },
    });
  };

  const updateAboutUsSection = (index, field, value) => {
    const updatedSections = [...settings.aboutUsContent.sections];
    updatedSections[index][field] = value;
    setSettings({
      ...settings,
      aboutUsContent: {
        ...settings.aboutUsContent,
        sections: updatedSections,
      },
    });
  };

  const updateAboutUsClosingText = (value) => {
    setSettings({
      ...settings,
      aboutUsContent: {
        ...settings.aboutUsContent,
        closingText: value,
      },
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error: ' + data.error);
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

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About This Tool Content
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Content (shown on homepage)
              </label>
              <textarea
                rows={12}
                value={settings.aboutContent}
                onChange={(e) => setSettings({ ...settings, aboutContent: e.target.value })}
                placeholder="Enter the about content that will be displayed on the homepage..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-900"
              />
            </div>
          </div>
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
              {settings.aboutUsContent.sections.map((section, index) => (
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
                      <textarea
                        rows={4}
                        value={section.content}
                        onChange={(e) => updateAboutUsSection(index, 'content', e.target.value)}
                        placeholder="Enter the content for this section..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addAboutUsSection}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Section
              </button>
            </div>

            {/* Closing Text */}
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closing Text (displayed at the end)
              </label>
              <textarea
                rows={3}
                value={settings.aboutUsContent.closingText}
                onChange={(e) => updateAboutUsClosingText(e.target.value)}
                placeholder="Enter a thank you message or closing text..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2m10 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0H7" />
            </svg>
            About Us Contacts
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            These links appear in the About Us page contact section.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.aboutUsContacts.instagramUrl}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutUsContacts: {
                    ...settings.aboutUsContacts,
                    instagramUrl: e.target.value,
                  },
                })}
                placeholder="https://instagram.com/yourusername"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gmail Address
              </label>
              <input
                type="email"
                value={settings.aboutUsContacts.gmail}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutUsContacts: {
                    ...settings.aboutUsContacts,
                    gmail: e.target.value,
                  },
                })}
                placeholder="youremail@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={settings.aboutUsContacts.linkedinUrl}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutUsContacts: {
                    ...settings.aboutUsContacts,
                    linkedinUrl: e.target.value,
                  },
                })}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Homepage Heading Controls</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading Tone</label>
                <select
                  value={settings.headingSettings.tone}
                  onChange={(e) => setSettings({
                    ...settings,
                    headingSettings: {
                      ...settings.headingSettings,
                      tone: e.target.value,
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                >
                  <option value="professional">Professional</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">H1 Text</label>
                <input
                  type="text"
                  value={settings.headingSettings.h1Text}
                  onChange={(e) => setSettings({
                    ...settings,
                    headingSettings: {
                      ...settings.headingSettings,
                      h1Text: e.target.value,
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  placeholder="Main heading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">H2 Text</label>
                <input
                  type="text"
                  value={settings.headingSettings.h2Text}
                  onChange={(e) => setSettings({
                    ...settings,
                    headingSettings: {
                      ...settings.headingSettings,
                      h2Text: e.target.value,
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  placeholder="Secondary heading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">H3 Text</label>
                <input
                  type="text"
                  value={settings.headingSettings.h3Text}
                  onChange={(e) => setSettings({
                    ...settings,
                    headingSettings: {
                      ...settings.headingSettings,
                      h3Text: e.target.value,
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  placeholder="Section heading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">H4 Text</label>
                <input
                  type="text"
                  value={settings.headingSettings.h4Text}
                  onChange={(e) => setSettings({
                    ...settings,
                    headingSettings: {
                      ...settings.headingSettings,
                      h4Text: e.target.value,
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  placeholder="Small section heading"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Instagram Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={settings.instagramHandle}
                  onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                  placeholder="@yourusername"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/yourusername"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                <textarea
                  rows={6}
                  value={settings.privacyPolicyContent}
                  onChange={(e) => setSettings({ ...settings, privacyPolicyContent: e.target.value })}
                  placeholder="Enter your privacy policy content..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-900"
                />
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
