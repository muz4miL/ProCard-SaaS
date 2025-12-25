const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * ProCard SaaS - Digital Business Card Model
 * Enterprise-grade schema with multi-tenancy, monetization, and analytics
 * 
 * Features:
 * - Multi-tenant architecture (owner-based)
 * - Tiered subscription model (Free, Pro, Agency)
 * - White-labeling and custom branding
 * - QR code customization
 * - Password protection
 * - Real-time analytics
 * - vCard export ready
 * - SEO optimization
 */

const cardSchema = new Schema({
  // === OWNERSHIP & TENANCY ===
  owner: {
    type: Schema.ObjectId,
    ref: 'Admin',
    required: true,
    index: true,
    autopopulate: {
      select: 'name email avatar company',
    },
  },
  removed: {
    type: Boolean,
    default: false,
    index: true,
  },
  enabled: {
    type: Boolean,
    default: true,
    index: true,
  },
  
  // === MONETIZATION & TIER ===
  tier: {
    type: String,
    enum: ['Free', 'Pro', 'Agency'],
    default: 'Free',
    required: true,
    index: true,
  },
  tierExpiry: {
    type: Date,
    default: null, // null = lifetime for Free tier
  },
  
  // === CUSTOM URL & ROUTING ===
  slug: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true,
    index: true,
    match: /^[a-z0-9-]+$/, // Only lowercase alphanumeric and hyphens
  },
  
  // === BRANDING & WHITE-LABELING ===
  branding: {
    logoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    primaryColor: {
      type: String,
      default: '#1890ff', // Ant Design primary
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    },
    secondaryColor: {
      type: String,
      default: '#52c41a',
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    },
    font: {
      type: String,
      enum: ['Inter', 'Roboto', 'Poppins', 'Montserrat', 'Open Sans', 'Lato'],
      default: 'Inter',
    },
    hidePoweredBy: {
      type: Boolean,
      default: false, // Pro+ feature
    },
  },
  
  // === CORE CONTENT ===
  content: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 150,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
      trim: true,
    },
  },
  
  // === CONTACT INFORMATION ===
  contact: {
    phone: {
      type: String,
      trim: true,
      default: '',
      maxlength: 20,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      zipCode: { type: String, default: '' },
    },
    mapCoordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
        default: null,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
        default: null,
      },
    },
  },
  
  // === SOCIAL LINKS (Unlimited for Pro+) ===
  socials: [
    {
      platform: {
        type: String,
        required: true,
        enum: [
          'LinkedIn',
          'Twitter',
          'Facebook',
          'Instagram',
          'WhatsApp',
          'Telegram',
          'YouTube',
          'TikTok',
          'GitHub',
          'Behance',
          'Dribbble',
          'Custom',
        ],
      },
      url: {
        type: String,
        required: true,
        trim: true,
      },
      icon: {
        type: String,
        default: '',
      },
      order: {
        type: Number,
        default: 0,
      },
    },
  ],
  
  // === ADVANCED FEATURES ===
  features: {
    // QR Code Styling
    qrStyle: {
      foregroundColor: {
        type: String,
        default: '#000000',
        match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      },
      backgroundColor: {
        type: String,
        default: '#ffffff',
        match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      },
      logo: {
        type: String,
        default: '',
      },
      errorCorrectionLevel: {
        type: String,
        enum: ['L', 'M', 'Q', 'H'],
        default: 'M',
      },
    },
    
    // Password Protection (Pro+ feature)
    passwordProtection: {
      enabled: {
        type: Boolean,
        default: false,
      },
      password: {
        type: String,
        default: '',
        select: false, // Never expose in queries
      },
    },
    
    // Branding Control
    hideBranding: {
      type: Boolean,
      default: false, // Agency tier only
    },
    
    // SEO
    metaTitle: {
      type: String,
      default: '',
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      default: '',
      maxlength: 160,
    },
  },
  
  // === ANALYTICS (Real-time Tracking) ===
  analytics: {
    totalViews: {
      type: Number,
      default: 0,
      min: 0,
    },
    uniqueVisits: {
      type: Number,
      default: 0,
      min: 0,
    },
    vcfDownloads: {
      type: Number,
      default: 0,
      min: 0,
    },
    linkClicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastViewed: {
      type: Date,
      default: null,
    },
    viewHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        ipAddress: { type: String, default: '' },
        userAgent: { type: String, default: '' },
        country: { type: String, default: '' },
        city: { type: String, default: '' },
      },
    ],
  },
  
  // === TIMESTAMPS ===
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// === INDEXES FOR PERFORMANCE ===
cardSchema.index({ owner: 1, enabled: 1, removed: 1 });
cardSchema.index({ tier: 1, tierExpiry: 1 });
cardSchema.index({ slug: 1 }, { unique: true });
cardSchema.index({ 'analytics.totalViews': -1 });
cardSchema.index({ createdAt: -1 });

// === VIRTUAL: Public Card URL ===
cardSchema.virtual('publicUrl').get(function () {
  return `${process.env.APP_URL || 'https://procard.com'}/v/${this.slug}`;
});

// === VIRTUAL: QR Code Download URL ===
cardSchema.virtual('qrCodeUrl').get(function () {
  return `${process.env.APP_URL || 'https://procard.com'}/api/cards/${this.slug}/qr`;
});

// === VIRTUAL: vCard Download URL ===
cardSchema.virtual('vcfUrl').get(function () {
  return `${process.env.APP_URL || 'https://procard.com'}/api/cards/${this.slug}/vcf`;
});

// === METHODS ===

/**
 * Increment analytics counter
 * @param {String} metric - 'totalViews' | 'uniqueVisits' | 'vcfDownloads' | 'linkClicks'
 */
cardSchema.methods.incrementAnalytics = async function (metric, additionalData = {}) {
  this.analytics[metric] += 1;
  this.analytics.lastViewed = new Date();
  
  // Store view history (limit to last 1000 entries)
  if (metric === 'totalViews' && this.analytics.viewHistory.length < 1000) {
    this.analytics.viewHistory.push({
      timestamp: new Date(),
      ...additionalData,
    });
  }
  
  return this.save();
};

/**
 * Check if tier allows feature
 * @param {String} feature - Feature name to check
 */
cardSchema.methods.hasFeature = function (feature) {
  const tierFeatures = {
    Free: ['basic_qr', 'basic_analytics', 'max_socials_5'],
    Pro: ['custom_qr', 'advanced_analytics', 'unlimited_socials', 'password_protection', 'custom_domain'],
    Agency: ['all_pro_features', 'white_labeling', 'hide_branding', 'bulk_management'],
  };
  
  return tierFeatures[this.tier]?.includes(feature) || false;
};

/**
 * Generate vCard string
 */
cardSchema.methods.generateVCard = function () {
  let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
  vcard += `FN:${this.content.name}\n`;
  
  if (this.content.title) vcard += `TITLE:${this.content.title}\n`;
  if (this.content.company) vcard += `ORG:${this.content.company}\n`;
  if (this.contact.phone) vcard += `TEL:${this.contact.phone}\n`;
  if (this.contact.email) vcard += `EMAIL:${this.contact.email}\n`;
  if (this.contact.website) vcard += `URL:${this.contact.website}\n`;
  
  if (this.contact.address.street) {
    vcard += `ADR:;;${this.contact.address.street};${this.contact.address.city};${this.contact.address.state};${this.contact.address.zipCode};${this.contact.address.country}\n`;
  }
  
  if (this.content.bio) vcard += `NOTE:${this.content.bio}\n`;
  
  vcard += 'END:VCARD';
  return vcard;
};

// === PRE-SAVE MIDDLEWARE ===
cardSchema.pre('save', function (next) {
  // Auto-generate SEO meta if not provided
  if (!this.features.metaTitle) {
    this.features.metaTitle = `${this.content.name} - ${this.content.title || 'Digital Business Card'}`;
  }
  
  if (!this.features.metaDescription) {
    this.features.metaDescription = this.content.bio || `Connect with ${this.content.name}`;
  }
  
  next();
});

// === STATIC METHODS ===

/**
 * Find trending cards (most views in last 7 days)
 */
cardSchema.statics.findTrending = function (limit = 10) {
  return this.find({
    enabled: true,
    removed: false,
    'analytics.lastViewed': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  })
    .sort({ 'analytics.totalViews': -1 })
    .limit(limit);
};

/**
 * Check if slug is available
 */
cardSchema.statics.isSlugAvailable = async function (slug, excludeId = null) {
  const query = { slug, removed: false };
  if (excludeId) query._id = { $ne: excludeId };
  
  const existing = await this.findOne(query);
  return !existing;
};

module.exports = mongoose.model('Card', cardSchema);
