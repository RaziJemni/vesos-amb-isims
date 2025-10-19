# SOS Children's Village Ambassadors Club Website

A modern, responsive website for the SOS Children's Village Ambassadors Club of ISIMS. Built with Next.js, TypeScript, and Tailwind CSS, featuring bilingual support (English/French) and a clean, maintainable codebase.

## 🚀 Features

- **Bilingual Support**: English and French language switching
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, professional design with smooth animations
- **Content Management**: Easy-to-update JSON-based content system
- **Form Integration**: Google Forms integration for member registration
- **SEO Optimized**: Meta tags, Open Graph, and Twitter Cards
- **Accessibility**: WCAG compliant components and navigation

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── sections/          # Page sections (Hero, About, etc.)
│   ├── modals/            # Modal components
│   ├── carousels/         # Carousel components
│   ├── ui/                # Base UI components
│   └── navigation.tsx     # Main navigation
├── config/                # Configuration files
│   └── theme.ts           # Theme colors and design tokens
├── data/                  # Content data
│   ├── team.json          # Team member information
│   └── events.json        # Events and activities
├── locales/               # Translation files
│   ├── en.json            # English translations
│   └── fr.json            # French translations
├── lib/                   # Utility functions
│   ├── translations.ts    # Translation system
│   └── utils.ts           # Helper functions
└── public/                # Static assets
    └── images/            # Images and media
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sos-club-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Content Management

### Updating Club Information

Edit the following files to update content:

- **Team Members**: `data/team.json`
- **Events**: `data/events.json`
- **Translations**: `locales/en.json` and `locales/fr.json`

### Adding New Team Members

1. Open `data/team.json`
2. Add member information to the `currentBureau.members` array:
   ```json
   {
     "name": "Member Name",
     "role": "Role in English",
     "roleFr": "Role in French",
     "email": "member@example.com",
     "instagram": "https://instagram.com/username",
     "linkedin": "https://linkedin.com/in/username",
     "image": "/images/bureau/member-photo.jpg"
   }
   ```

### Adding New Events

1. Open `data/events.json`
2. Add events to the appropriate array (`recentEvents`, `upcomingEvents`, or `previousEvents`):
   ```json
   {
     "id": "unique-event-id",
     "date": "2024-12-01",
     "title": "Event Title",
     "titleFr": "Titre de l'événement",
     "description": "Event description",
     "descriptionFr": "Description de l'événement",
     "location": "Event Location",
     "locationFr": "Lieu de l'événement",
     "image": "/images/events/event-photo.jpg",
     "category": "event-category"
   }
   ```

### Updating Translations

1. Open `locales/en.json` or `locales/fr.json`
2. Update the text content while maintaining the JSON structure
3. Ensure both language files have the same keys

## 🎨 Customizing Theme Colors

1. Open `config/theme.ts`
2. Update the color values in the `theme.colors` object:
   ```typescript
   colors: {
     primary: {
       DEFAULT: '#1e40af', // Main brand color
       // ... other shades
     },
     secondary: {
       DEFAULT: '#059669', // Secondary color
       // ... other shades
     }
   }
   ```

3. The changes will automatically apply throughout the website

## 📱 Mobile Responsiveness

The website is built with a mobile-first approach using Tailwind CSS. All components are responsive and will work on:

- Mobile phones (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## 🔧 Google Forms Integration

To set up the join form:

1. Create a Google Form for member registration
2. Open `components/sections/JoinForm.tsx`
3. Update the following constants:
   ```typescript
   const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse"
   const FORM_FIELD_IDS = {
     fullname: "entry.123456789",    // Replace with actual field IDs
     email: "entry.987654321",
     // ... other fields
   }
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📊 Performance Optimization

The website includes several performance optimizations:

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting by Next.js
- **Static Generation**: Pre-rendered pages for better performance
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

## 🔍 SEO Features

- Meta tags for search engines
- Open Graph tags for social media sharing
- Twitter Card support
- Structured data for better search visibility
- Sitemap generation (can be added)

## 🛡️ Security

- Form validation and sanitization
- Secure headers configuration
- Environment variable protection
- No sensitive data in client-side code

## 📞 Support

For questions or support:

- **Email**: club.ambassadeurs.vesostn.isims@gmail.com
- **Club Location**: ISIMS - Sfax, Tunisia

## 📄 License

This project is for the SOS Children's Village Ambassadors Club of ISIMS. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📈 Future Enhancements

- [ ] Admin dashboard for content management
- [ ] Event registration system
- [ ] Newsletter subscription
- [ ] Blog/news section
- [ ] Photo gallery
- [ ] Contact form
- [ ] Social media integration
- [ ] Analytics integration

---

**Built with ❤️ for the SOS Children's Village Ambassadors Club of ISIMS**