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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
