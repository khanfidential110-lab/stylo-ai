# STYLO AI - Complete Development Prompt for AI IDE
## AI-Powered Wardrobe & Outfit Assistant Application

---

# 🎯 PROJECT OVERVIEW

Build **STYLO AI** - a premium AI-powered wardrobe management and outfit recommendation mobile application for iOS and Android.

## Core Value Proposition
"Your Personal AI Stylist - Perfect Outfits, Every Day, Every Occasion"

## Target Platforms
- iOS 16+ (Swift/SwiftUI)
- Android 8.0+ (Kotlin/Jetpack Compose)

## Monetization Model
- Freemium with Premium ($9.99/mo) and Premium+ ($19.99/mo) tiers
- 7-day free trial (no credit card required)
- In-app purchases for style packs

---

# 📱 CORE FEATURES TO BUILD

## 1. WARDROBE DIGITIZATION & ORGANIZATION

### Item Capture
- Camera capture with AI auto-background removal
- Multi-image upload from gallery (batch upload)
- Manual entry option

### AI Processing (For Each Item)
```
Automatically detect and tag:
- Category: tops, bottoms, dresses, outerwear, footwear, accessories
- Subcategory: t-shirt, jeans, sneakers, etc.
- Primary & secondary colors (with hex codes)
- Pattern: solid, striped, floral, plaid, geometric, etc.
- Material: cotton, denim, silk, leather
- Season appropriateness: spring, summer, fall, winter, all-season
- Formality score: 1-10 scale
- Occasion tags: work, casual, formal, party, date, workout
```

### Wardrobe Views
- Grid view (2, 3, 4 columns)
- List view
- Filter by: category, color, season, occasion, brand, formality
- Sort by: most worn, least worn, recently added, price
- Search by name, tags, brand
- Favorites section

### Analytics Dashboard
- Total items by category
- Most/least worn items (top/bottom 10)
- Items unworn in 30/60/90 days
- Cost per wear calculations
- Color distribution chart
- Wardrobe value estimation
- Style profile analysis

---

## 2. AI OUTFIT ANALYSIS & COMPLETENESS CHECK

### Outfit Scanner
User takes full-body photo or mirror selfie, AI analyzes:

```
Detection:
- Identify all visible clothing items
- Match items to user's wardrobe catalog
- Detect missing wardrobe items (prompt to add)

Completeness Check based on:
- Current weather conditions
- Stated occasion
- Style coherence
- Practical needs (walking, sitting, etc.)
```

### Outfit Scoring System (100 points)
```
Color Harmony:      25 points
Style Coherence:    25 points
Occasion Fit:       25 points
Weather Suitability: 15 points
Completeness:       10 points

Score Display:
90-100: "Perfect!" 🌟
80-89:  "Great outfit!" ✨
70-79:  "Good, minor tweaks suggested" 👍
60-69:  "Acceptable, improvements recommended" 🔄
<60:    "Consider alternatives" 🔀
```

### AI Feedback Types
```
1. Compliments - What's working well
2. Suggestions - Improvements to consider
3. Alternatives - Other items from wardrobe
4. Warnings - Issues to address (weather, occasion mismatch)
```

---

## 3. WEATHER-BASED OUTFIT RECOMMENDATIONS

### Weather Integration
- Integrate with OpenWeatherMap API (primary) or WeatherAPI.com (fallback)
- Auto-detect user location or manual city input
- Consider: temperature, feels-like, precipitation, humidity, wind, UV index

### Temperature-Based Logic
```
Below 32°F (0°C) - Freezing:
→ Heavy coat, layering, warm accessories, insulated footwear

32-45°F (0-7°C) - Cold:
→ Winter coat, sweaters, long pants, closed shoes

46-59°F (8-15°C) - Cool:
→ Medium jacket, long sleeves, layering options

60-70°F (16-21°C) - Mild:
→ Light jacket optional, versatile clothing

71-85°F (22-29°C) - Warm:
→ Short sleeves, light fabrics, breathable materials

Above 85°F (30°C+) - Hot:
→ Minimal clothing, light colors, moisture-wicking

MODIFIERS:
- Rain: Waterproof layers, avoid suede
- High UV: Hat, sunglasses recommended
- High wind: Secure accessories, windbreaker
```

### Daily Outfit Generation
1. Fetch current weather + day forecast
2. Consider user's calendar events (if integrated)
3. Factor in style preferences
4. Check wardrobe for weather-appropriate items
5. Generate 3 complete outfit options
6. Display with scores and AI explanations

---

## 4. OCCASION-BASED STYLING

### Occasion Categories
```
WORK & PROFESSIONAL
- Regular work day, Important meeting, Job interview
- Presentation, Casual Friday, Work from home
- Client dinner, Conference

SOCIAL & CASUAL
- Coffee/brunch, Shopping, Casual hangout
- House party, Birthday party, BBQ
- Movie night, Concert

FORMAL & SPECIAL
- Date night, Fine dining, Wedding guest
- Cocktail party, Black tie, Graduation

ACTIVE & OUTDOOR
- Gym, Yoga, Running, Hiking
- Beach day, Sports event, Travel

SEASONAL
- Holiday party, New Year's Eve, Summer wedding
```

### Occasion Input Flow
```
Step 1: "Where are you going?" [Quick select buttons]
Step 2: "What type specifically?" [Dynamic options]
Step 3: "Any special requirements?" [Checkboxes]
Step 4: "What time?" [Morning/Afternoon/Evening/Night]
Step 5: Confirm weather/location
→ Generate Recommendations
```

---

## 5. AI STYLE ASSISTANT CHAT

### Natural Language Understanding
Handle queries like:
- "What should I wear to my sister's graduation?"
- "I have a date at a fancy restaurant tonight"
- "It's freezing, what layers should I add?"
- "Does this shirt go with these pants?"
- "What can I wear with my new red heels?"

### Response Types
1. Text responses with styling advice
2. Outfit cards with item images from wardrobe
3. Item pairing suggestions
4. Color theory explanations
5. Trend information
6. Shopping recommendations (premium)

### Quick Action Buttons
```
[📸 Analyze My Outfit]
[🌤️ Today's Weather Picks]
[📅 Outfit for Event]
[🔀 Surprise Me]
[👕 What Goes With...]
```

---

## 6. OUTFIT CALENDAR & HISTORY

### Calendar Features
- Monthly calendar view with outfit thumbnails
- Color-coded by occasion type
- Weather icon for each day
- Plan outfits in advance
- View past outfits
- Repeat avoidance system

### Outfit Logging
- Quick log from recommendations
- Manual photo + tag items
- Auto-detect worn items
- Record: date, items, occasion, weather, rating, notes

---

# 🎨 UI/UX DESIGN SPECIFICATIONS

## Color Palette
```
PRIMARY:
- Brand Indigo: #6366F1
- Dark: #4F46E5
- Light: #A5B4FC

SECONDARY:
- Accent Amber: #F59E0B
- Success: #10B981
- Warning: #F97316
- Error: #EF4444

NEUTRALS:
- Gray 900: #111827 (Primary text)
- Gray 700: #374151 (Secondary text)
- Gray 100: #F3F4F6 (Backgrounds)
- White: #FFFFFF (Cards)

DARK MODE:
- Background: #0F172A
- Surface: #1E293B
- Text: #F1F5F9
```

## Typography
```
Font: Inter (or SF Pro iOS / Roboto Android)

Display Large:  36px/Bold - Hero text
Headline:       24px/Semibold - Screen titles
Title:          18px/Medium - Card titles
Body:           16px/Regular - Content
Label:          14px/Medium - Buttons, tags
Caption:        12px/Regular - Secondary info
```

## Component Specifications
```
BUTTONS:
- Height: 48px
- Border radius: 12px
- Primary: Indigo bg, white text
- Secondary: Gray 100 bg, Indigo text

CARDS:
- Border radius: 16px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Padding: 16px

INPUT FIELDS:
- Height: 48px
- Border radius: 8px
- Focus: 2px Indigo border

BOTTOM NAV:
- Height: 64px + safe area
- 5 tabs: Home, Wardrobe, Camera, Chat, Profile
- Active: Indigo fill, Inactive: Gray outline
```

## Key Screens Layout
```
1. HOME SCREEN
   - Header with profile + notifications
   - Greeting + Weather card
   - Today's outfit picks carousel
   - Quick action buttons (4)
   - Wardrobe insights card
   - Recently worn items row

2. WARDROBE SCREEN
   - Search bar
   - Category tabs (scrollable)
   - Filter chips row
   - Item count + view toggle
   - Grid of item cards
   - FAB to add item

3. ITEM DETAIL SCREEN
   - Hero image (swipeable)
   - Title + category breadcrumb
   - AI-detected attributes card
   - User details (brand, size, price)
   - Tags section
   - Statistics card
   - Outfit ideas carousel
   - Edit/Delete actions

4. AI CHAT SCREEN
   - Welcome message from AI
   - Quick action pills
   - Chat message history
   - Outfit cards inline
   - Message input + attachments
   - Send button

5. OUTFIT ANALYSIS RESULTS
   - Photo with labeled items
   - Overall score (visual bar)
   - What's working section
   - Suggestions section
   - Detailed score breakdown
   - Detected wardrobe items
   - Log/Get alternatives buttons
```

---

# 🏗️ TECHNICAL ARCHITECTURE

## Mobile Stack
```
iOS:
- Swift 5.9+ / SwiftUI
- Architecture: MVVM + Clean Architecture
- Networking: Alamofire + Async/Await
- Image Loading: Kingfisher
- Local Storage: SwiftData
- Analytics: Firebase

Android:
- Kotlin 1.9+ / Jetpack Compose
- Architecture: MVVM + Clean Architecture
- Networking: Retrofit + Coroutines
- Image Loading: Coil
- Local Storage: Room
- Analytics: Firebase
```

## Backend Stack
```
- Runtime: Node.js 20 LTS with NestJS (TypeScript)
- Alternative for AI services: Python 3.11+ with FastAPI
- Cloud: AWS (ECS, RDS, S3, CloudFront, Lambda)
- Database: PostgreSQL 15+
- Cache: Redis 7+
- Search: Elasticsearch 8+
- Media: S3 + CloudFront CDN
```

## AI/ML Components
```
1. Background Removal
   - Model: U2-Net or MODNet
   - Fallback: Remove.bg API
   - Output: PNG with alpha

2. Clothing Classification
   - Model: EfficientNet-B4 or ResNet-50
   - Multi-label classification
   - 50+ categories, 100+ attributes

3. Color Extraction
   - K-means clustering (k=5)
   - Map to named colors (200+ database)
   - Extract primary + secondary colors

4. Pattern Recognition
   - CNN for pattern detection
   - Solid, striped, floral, plaid, etc.

5. Outfit Recommendation Engine
   - Color harmony scoring
   - Style coherence matching
   - Weather appropriateness
   - Occasion fit
   - Personal preference learning

6. Chat NLU
   - Fine-tuned GPT-4 or Claude API
   - Intent classification
   - Entity extraction
```

---

# 💾 DATABASE SCHEMA

```sql
-- Core Tables

CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    avatar_url VARCHAR(500),
    city VARCHAR(100),
    timezone VARCHAR(50),
    temperature_unit VARCHAR(10) DEFAULT 'fahrenheit',
    subscription_tier VARCHAR(20) DEFAULT 'free',
    subscription_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE style_profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    style_tags TEXT[],
    preferred_colors TEXT[],
    avoided_colors TEXT[],
    formality_preference INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wardrobe_items (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(200),
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    original_image_url VARCHAR(500) NOT NULL,
    processed_image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    primary_color VARCHAR(50),
    primary_color_hex VARCHAR(7),
    secondary_colors JSONB,
    pattern VARCHAR(50),
    material VARCHAR(50),
    season TEXT[],
    occasions TEXT[],
    formality_score INTEGER,
    brand VARCHAR(100),
    size VARCHAR(20),
    price DECIMAL(10,2),
    is_favorite BOOLEAN DEFAULT FALSE,
    times_worn INTEGER DEFAULT 0,
    last_worn_at DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE outfits (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(200),
    items JSONB NOT NULL,
    occasion VARCHAR(50),
    overall_score INTEGER,
    ai_feedback JSONB,
    is_saved BOOLEAN DEFAULT FALSE,
    worn_date DATE,
    user_rating INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE outfit_calendar (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    outfit_id UUID REFERENCES outfits(id),
    date DATE NOT NULL,
    occasion VARCHAR(50),
    weather_data JSONB,
    UNIQUE(user_id, date)
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    conversation_id UUID,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    attachments JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    tier VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    stripe_subscription_id VARCHAR(255),
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

# 🔌 API ENDPOINTS

## Authentication
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/social (Google/Apple)
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/forgot-password
```

## Users
```
GET    /api/v1/users/me
PATCH  /api/v1/users/me
POST   /api/v1/users/me/avatar
DELETE /api/v1/users/me
GET    /api/v1/users/me/style-profile
PUT    /api/v1/users/me/style-profile
```

## Wardrobe
```
GET    /api/v1/wardrobe              (with filters, pagination)
GET    /api/v1/wardrobe/:id
POST   /api/v1/wardrobe              (upload image + details)
PATCH  /api/v1/wardrobe/:id
DELETE /api/v1/wardrobe/:id
POST   /api/v1/wardrobe/bulk         (batch upload)
GET    /api/v1/wardrobe/statistics
```

## Outfits
```
POST   /api/v1/outfits/recommend     (get AI recommendations)
POST   /api/v1/outfits/analyze       (analyze outfit photo)
GET    /api/v1/outfits               (saved outfits)
POST   /api/v1/outfits               (save outfit)
DELETE /api/v1/outfits/:id
POST   /api/v1/outfits/:id/wear      (log as worn)
POST   /api/v1/outfits/:id/rate
```

## Weather
```
GET    /api/v1/weather               (current + today)
GET    /api/v1/weather/forecast      (7-day)
```

## Chat
```
POST   /api/v1/chat                  (send message, get AI response)
GET    /api/v1/chat/conversations
GET    /api/v1/chat/conversations/:id
DELETE /api/v1/chat/conversations/:id
```

## Calendar
```
GET    /api/v1/calendar              (date range)
POST   /api/v1/calendar              (plan outfit)
PATCH  /api/v1/calendar/:date
DELETE /api/v1/calendar/:date
```

## Subscription
```
GET    /api/v1/subscription
GET    /api/v1/subscription/plans
POST   /api/v1/subscription/checkout
POST   /api/v1/subscription/cancel
POST   /api/v1/subscription/webhook  (Stripe)
```

---

# 💰 MONETIZATION TIERS

## FREE
```
- 50 wardrobe items max
- 3 outfit suggestions/day
- 5 AI chat messages/day
- 3 outfit analyses/day
- Basic weather integration
- Occasional ads
```

## PREMIUM ($9.99/month or $79.99/year)
```
- Unlimited wardrobe items
- Unlimited outfit suggestions
- 100 AI messages/day
- Unlimited outfit analysis
- Full scoring & feedback
- Outfit history
- No ads
```

## PREMIUM+ ($19.99/month or $149.99/year)
```
- Everything in Premium
- Personal stylist mode (unlimited AI)
- Advanced analytics & insights
- Style reports
- Capsule wardrobe builder
- Family accounts (up to 4)
- Priority support
- Early access to features
- Shopping suggestions
```

## Trial Strategy
- 7-day Premium trial after onboarding
- No credit card required
- Soft paywall at feature limits
- Day 5 reminder notification
- Special offer at trial end (50% off first month)

---

# 📊 ANALYTICS EVENTS TO TRACK

```
Onboarding:
- onboarding_started
- onboarding_step_completed
- onboarding_completed
- onboarding_skipped

Wardrobe:
- item_added (category, source)
- item_edited
- item_deleted
- wardrobe_searched
- wardrobe_filtered

Outfits:
- outfit_requested (occasion)
- outfit_generated
- outfit_selected (rank)
- outfit_modified
- outfit_saved
- outfit_worn
- outfit_rated

Analysis:
- outfit_analysis_started
- outfit_analysis_completed (score)
- suggestion_tapped

Chat:
- chat_message_sent
- chat_response_received

Subscription:
- paywall_viewed (trigger)
- trial_started
- trial_converted
- subscription_started
- subscription_cancelled
```

---

# 🔐 SECURITY REQUIREMENTS

```
1. Authentication
   - JWT with 1-hour access tokens
   - 30-day refresh tokens
   - Secure token storage (Keychain/EncryptedSharedPrefs)
   - Social login (Google, Apple)
   - Biometric authentication option

2. Data Protection
   - TLS 1.3 for all API calls
   - AES-256 encryption at rest
   - Certificate pinning in mobile apps
   - No payment data stored (Stripe tokenization)

3. Privacy
   - GDPR compliant (export, delete data)
   - CCPA compliant
   - Privacy dashboard in settings
   - Consent management

4. App Security
   - Rate limiting
   - Input validation
   - SQL injection prevention
   - Session management
```

---

# ♿ ACCESSIBILITY REQUIREMENTS

```
1. Screen Readers
   - VoiceOver (iOS) support
   - TalkBack (Android) support
   - Proper labels on all elements
   - Logical focus order

2. Visual
   - 4.5:1 contrast ratio minimum
   - Support for Dynamic Type
   - Color-blind friendly palette
   - No color-only information

3. Motor
   - 44pt/48dp minimum touch targets
   - Keyboard navigation support
   - Reduce Motion respect

4. Cognitive
   - Clear, simple language
   - Consistent navigation
   - Error messages with suggestions
```

---

# 🌍 LOCALIZATION (Phase 1)

```
Languages:
- English (US) - en-US
- English (UK) - en-GB
- Spanish - es
- French - fr
- German - de

Requirements:
- All strings externalized
- Date/time formatting
- Currency formatting
- RTL preparation for future
```

---

# 🚀 DEVELOPMENT PHASES

## Phase 1: MVP (8 weeks)
```
Week 1-2: Project setup, auth, user management
Week 3-4: Wardrobe CRUD, image upload, basic AI detection
Week 5-6: Outfit recommendations, weather integration
Week 7: AI chat basic functionality
Week 8: Testing, bug fixes, optimization
```

## Phase 2: Enhanced Features (4 weeks)
```
- Outfit analysis from photos
- Calendar planning
- Advanced filtering/search
- Subscription/payments
- Analytics integration
```

## Phase 3: Polish & Launch (4 weeks)
```
- UI/UX refinements
- Performance optimization
- Accessibility audit
- Localization
- App Store preparation
- Beta testing
```

---

# ✅ ACCEPTANCE CRITERIA

## Must Have (P0)
- [ ] User registration/login (email + social)
- [ ] Add wardrobe items with AI detection
- [ ] View and organize wardrobe
- [ ] Get weather-based outfit recommendations
- [ ] Get occasion-based recommendations
- [ ] Basic AI chat assistant
- [ ] Outfit scoring
- [ ] Free/Premium tier enforcement
- [ ] Subscription via Stripe/IAP

## Should Have (P1)
- [ ] Outfit analysis from photo
- [ ] Outfit calendar
- [ ] Wardrobe analytics dashboard
- [ ] Outfit history
- [ ] Quick action buttons
- [ ] Push notifications
- [ ] Dark mode

## Nice to Have (P2)
- [ ] Batch upload
- [ ] Export wardrobe
- [ ] Sharing features
- [ ] Widget support
- [ ] Advanced AI responses
- [ ] Trend information

---

# 📝 ADDITIONAL NOTES

1. **AI Accuracy**: Focus on 90%+ accuracy for category detection before launch. Include manual override for all AI suggestions.

2. **Performance**: 
   - Image processing < 3 seconds
   - API responses < 500ms
   - App cold start < 2 seconds

3. **Quality**:
   - Crash-free rate > 99.5%
   - 80% test coverage
   - 4.5+ App Store target

4. **User Experience**:
   - Onboarding < 3 minutes
   - Add item < 30 seconds
   - Get recommendation < 5 seconds

---

**Build something amazing! 🎨👔✨**
