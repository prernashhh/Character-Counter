import mongoose from 'mongoose';

const AboutUsSectionSchema = new mongoose.Schema({
  heading: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
}, { _id: false });

const AboutUsContentSchema = new mongoose.Schema({
  sections: {
    type: [AboutUsSectionSchema],
    default: [],
  },
  closingText: {
    type: String,
    default: '',
  },
}, { _id: false });

const AboutUsContactsSchema = new mongoose.Schema({
  instagramUrl: {
    type: String,
    default: '',
  },
  gmail: {
    type: String,
    default: '',
  },
  linkedinUrl: {
    type: String,
    default: '',
  },
}, { _id: false });

const SocialLinksSchema = new mongoose.Schema({
  instagramUrl: {
    type: String,
    default: 'https://instagram.com/prerna.9_',
  },
  linkedinUrl: {
    type: String,
    default: 'https://linkedin.com/in/prerna.9_',
  },
  emailAddress: {
    type: String,
    default: 'iamdineshswami@gmail.com',
  },
}, { _id: false });

const HeadingSettingsSchema = new mongoose.Schema({
  h1Text: {
    type: String,
    default: 'Character Counter',
  },
  h2Text: {
    type: String,
    default: '',
  },
  h3Text: {
    type: String,
    default: 'Statistics',
  },
  h4Text: {
    type: String,
    default: 'About This Tool',
  },
  tone: {
    type: String,
    enum: ['professional', 'general'],
    default: 'professional',
  },
}, { _id: false });

const SeoPageSchema = new mongoose.Schema({
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  h1: { type: String, default: '' },
  h2: { type: String, default: '' },
  h3: { type: String, default: '' },
  h4: { type: String, default: '' },
  h5: { type: String, default: '' },
  h6: { type: String, default: '' },
}, { _id: false });

const SeoSettingsSchema = new mongoose.Schema({
  home: { type: SeoPageSchema, default: () => ({}) },
  aboutUs: { type: SeoPageSchema, default: () => ({}) },
  contactUs: { type: SeoPageSchema, default: () => ({}) },
  termsConditions: { type: SeoPageSchema, default: () => ({}) },
  disclaimer: { type: SeoPageSchema, default: () => ({}) },
  privacyPolicy: { type: SeoPageSchema, default: () => ({}) },
  blog: { type: SeoPageSchema, default: () => ({}) },
}, { _id: false });

const StaticPagesLastUpdatedSchema = new mongoose.Schema({
  aboutUs: {
    type: Date,
    default: Date.now,
  },
  contactUs: {
    type: Date,
    default: Date.now,
  },
  termsConditions: {
    type: Date,
    default: Date.now,
  },
  privacyPolicy: {
    type: Date,
    default: Date.now,
  },
  disclaimer: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const PageClosingTextsSchema = new mongoose.Schema({
  aboutUs: {
    type: String,
    default: 'We value your trust and will keep improving this tool for you.',
  },
  contactUs: {
    type: String,
    default: 'Thank you for reaching out. We appreciate your time and feedback.',
  },
  termsConditions: {
    type: String,
    default: 'By continuing to use this service, you agree to these terms and conditions.',
  },
  privacyPolicy: {
    type: String,
    default: 'Your privacy matters to us and we are committed to protecting your data.',
  },
  disclaimer: {
    type: String,
    default: 'Please use this tool responsibly and review this disclaimer regularly.',
  },
  blog: {
    type: String,
    default: 'Thanks for reading. Check back soon for more helpful updates.',
  },
}, { _id: false });

const LocalizedContentSchema = new mongoose.Schema({
  aboutContent: {
    type: String,
    default: '',
  },
  aboutUsContent: {
    type: AboutUsContentSchema,
    default: () => ({ sections: [], closingText: '' }),
  },
  privacyPolicyContent: {
    type: String,
    default: '',
  },
  contactUsContent: {
    type: String,
    default: '',
  },
  contactUsEmail: {
    type: String,
    default: '',
  },
  termsConditionsContent: {
    type: String,
    default: '',
  },
  disclaimerContent: {
    type: String,
    default: '',
  },
  pageClosingTexts: {
    type: PageClosingTextsSchema,
    default: () => ({}),
  },
}, { _id: false });

const SettingsSchema = new mongoose.Schema(
  {
    aboutContent: {
      type: String,
      default: '',
    },
    aboutUsContent: {
      type: AboutUsContentSchema,
      default: () => ({ sections: [], closingText: '' }),
    },
    aboutUsContacts: {
      type: AboutUsContactsSchema,
      default: () => ({ instagramUrl: '', gmail: '', linkedinUrl: '' }),
    },
    socialLinks: {
      type: SocialLinksSchema,
      default: () => ({
        instagramUrl: 'https://instagram.com/prerna.9_',
        linkedinUrl: 'https://linkedin.com/in/prerna.9_',
        emailAddress: 'iamdineshswami@gmail.com',
      }),
    },
    instagramHandle: {
      type: String,
      default: '',
    },
    instagramUrl: {
      type: String,
      default: '',
    },
    privacyPolicyContent: {
      type: String,
      default: '',
    },
    contactUsContent: {
      type: String,
      default: '',
    },
    contactUsEmail: {
      type: String,
      default: 'iamdineshswami@gmail.com',
    },
    termsConditionsContent: {
      type: String,
      default: '',
    },
    disclaimerContent: {
      type: String,
      default: '',
    },
    footerCopyrightYear: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    headingSettings: {
      type: HeadingSettingsSchema,
      default: () => ({
        h1Text: 'Character Counter',
        h2Text: 'Analyze your text with confidence',
        h3Text: 'Statistics',
        h4Text: 'About This Tool',
        tone: 'professional',
      }),
    },
    seoSettings: {
      type: SeoSettingsSchema,
      default: () => ({}),
    },
    staticPagesLastUpdated: {
      type: StaticPagesLastUpdatedSchema,
      default: () => ({
        aboutUs: new Date(),
        contactUs: new Date(),
        termsConditions: new Date(),
        privacyPolicy: new Date(),
        disclaimer: new Date(),
      }),
    },
    pageClosingTexts: {
      type: PageClosingTextsSchema,
      default: () => ({
        aboutUs: 'We value your trust and will keep improving this tool for you.',
        contactUs: 'Thank you for reaching out. We appreciate your time and feedback.',
        termsConditions: 'By continuing to use this service, you agree to these terms and conditions.',
        privacyPolicy: 'Your privacy matters to us and we are committed to protecting your data.',
        disclaimer: 'Please use this tool responsibly and review this disclaimer regularly.',
        blog: 'Thanks for reading. Check back soon for more helpful updates.',
      }),
    },
    localizedContent: {
      type: Map,
      of: LocalizedContentSchema,
      default: () => new Map(),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
