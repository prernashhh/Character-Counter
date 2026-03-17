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

const HeadingSettingsSchema = new mongoose.Schema({
  h1Text: {
    type: String,
    default: 'Character Counter',
  },
  h2Text: {
    type: String,
    default: 'Analyze your text with confidence',
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
