# The Polibrand Agency - Developer Guide

## Project Status

**Last Updated:** June 2026  
**Current Branch:** `claude/images-not-showing-l289y6`  
**Deployment Status:** Changes pushed but may require verification on live site

## Project Directory Structure

```
~/Developer/thepolibrandagency/  (Local on Mac)
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Home page (Hero with Assessment CTA)
│   ├── apply/page.tsx           # Application form (with refund notice)
│   ├── assessment/page.tsx      # Assessment quiz
│   ├── assessment/results/       # Assessment results page
│   ├── about/page.tsx           # About page (with founders section)
│   ├── admin/                   # Admin panel
│   └── ...other pages
├── components/                   # React components
│   ├── SettingsProvider.tsx     # Theme & content provider
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── db.ts                    # Firebase operations
│   ├── rate-limit.ts            # Rate limiting
│   └── ...utilities
├── data/
│   ├── content.json             # All site content (EDITABLE)
│   ├── settings.json            # Theme settings (EDITABLE)
│   └── ...other data files
├── public/                       # Static files (logo.png, icons, etc.)
├── firebase.json                # Firebase configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript config
```

## What Has Been Done

### ✅ Completed
1. **Fixed Image Loading** - Restored Firebase Storage image remote patterns in `next.config.ts`
2. **Restored Security Headers** - Added X-Content-Type-Options, X-Frame-Options, etc.
3. **Updated Hero CTA** - Changed "Partner With Us" to "Start Assessment →"
4. **Added Refund Notice** - Visible at top of `/apply` page: "50% refund when we proceed"
5. **Improved Assessment Questions** - 5 focused questions across 4 categories:
   - Your Background (2Q)
   - Your Goals (1Q)
   - Your Challenges (1Q)
   - Your Readiness (1Q)
6. **Founders Section Ready** - In `/about` page, ready for founder's story
7. **Fixed Critical Configs** - Rate-limit cleanup, Firebase token verification fallback

### 🚀 Recent Changes (Branch: claude/images-not-showing-l289y6)
- Commit: `409c105` - Added assessment CTA, refund notice, improved questions
- Commit: `0398a34` - Restored critical configurations
- Changes in files: `app/page.tsx`, `app/apply/page.tsx`, `data/content.json`

## How to Deploy

### From Your Mac Terminal:
```bash
cd ~/Developer/thepolibrandagency

# Step 1: Get latest code from feature branch
git pull origin claude/images-not-showing-l289y6

# Step 2: Ensure you're on the right branch
git checkout claude/images-not-showing-l289y6

# Step 3: Install dependencies (if needed)
npm install

# Step 4: Build
npm run build

# Step 5: Deploy to Firebase
firebase deploy

# Step 6: Verify deployment completed with ✔ Deploy complete!
```

### After Deployment:
- Hard refresh browser: **Cmd+Shift+R**
- Clear cache or use private/incognito window
- Check: https://thepolibrandagency-d4263.web.app

## Key Files to Edit for Content

### Theme & Colors (`data/settings.json`)
```json
{
  "theme": {
    "primary": "#1A2B4C",
    "secondary": "#F1E5D1",
    "accent": "#FF6B6B",
    "background": "#FAFAFC",
    "text": "#2C3E50",
    "heroImage": "",
    "logo": "/logo.png"
  }
}
```

### All Site Content (`data/content.json`) - MAIN FILE TO EDIT
- `pages.home.cta` - Button text (now has `assessment: "Start Assessment →"`)
- `pages.apply.hero` - Apply page hero text
- `pages.assessment.categories` - Assessment questions (5 total across 4 categories)
- `pages.about.founders` - Update founder names, titles, bios here
- `pages.about.vision` - Vision section content
- All navbar, footer, and page content

## What Works ✅

1. **Assessment Flow** - Quiz → Results → Apply redirect with score
2. **Application Form** - 3-step form with Paystack payment
3. **Admin Panel** - Login, content/brand editing, analytics
4. **Firebase Integration** - Auth, Firestore, Storage
5. **Responsive Design** - Mobile, tablet, desktop
6. **Theme System** - CSS variables for dynamic theming

## What Might Need Attention ⚠️

1. **Founders Images** - Currently empty in content.json, add image URLs
2. **Hero Image** - `heroImage` is empty string, add URL if needed
3. **Assessment Results Tiers** - May need calibration based on score ranges
4. **Paystack Integration** - Currently configured, but verify keys in Firebase

## DO's ✅

- ✅ Edit `data/content.json` to change site text/content
- ✅ Edit `data/settings.json` to change theme colors
- ✅ Use `git branch` to verify which branch you're on
- ✅ Pull from `origin/claude/images-not-showing-l289y6` before deploying changes
- ✅ Run `npm run build` BEFORE deploying
- ✅ Hard refresh browser (Cmd+Shift+R) after deployment
- ✅ Check Firebase Console for function/hosting logs if deployment fails
- ✅ Test assessment flow: Start → Quiz → Results → Apply
- ✅ Keep security headers in `next.config.ts`
- ✅ Keep rate-limit cleanup in `lib/rate-limit.ts`

## DON'Ts ❌

- ❌ Don't remove security headers from `next.config.ts`
- ❌ Don't delete `lib/rate-limit.ts` cleanup interval (memory leak risk)
- ❌ Don't commit without testing `npm run build` first
- ❌ Don't deploy from `master` branch if changes are on feature branch
- ❌ Don't remove Firebase remote image patterns (breaks image loading)
- ❌ Don't edit `app/layout.tsx` theme setup carelessly (affects all pages)
- ❌ Don't change assessment category IDs (breaks result calculation)
- ❌ Don't commit service account keys to git
- ❌ Don't skip `firebase deploy` - always deploy after code changes
- ❌ Don't use `git push --force` without explicit reason

## Common Issues & Fixes

### Problem: Changes don't show after deploy
**Solution:**
1. Verify you pulled from the feature branch: `git pull origin claude/images-not-showing-l289y6`
2. Check you're on correct branch: `git branch`
3. Hard refresh: Cmd+Shift+R
4. Try private/incognito window
5. Check deployment log for errors

### Problem: "Could not find the next executable"
**Solution:**
```bash
npm install
npm run build
firebase deploy
```

### Problem: Assessment questions don't appear
**Solution:**
- Check `data/content.json` has `pages.assessment.categories`
- Verify category structure matches code expectations
- Rebuild and redeploy

### Problem: Images not loading
**Solution:**
- Ensure `next.config.ts` has Firebase Storage patterns
- Check image URLs in `data/settings.json` and `data/content.json`
- Verify image URLs are accessible (Firebase Storage or absolute paths)

## Assessment Question Structure

Each category has:
- `id` - Unique identifier
- `label` - Display name
- `weight` - Percentage weight in final score
- `color` - Badge color
- `questions` - Array of questions with options and scores

Example:
```json
{
  "id": "background",
  "label": "Your Background",
  "weight": 20,
  "color": "#1F6F3E",
  "questions": [
    {
      "id": "q1",
      "text": "What is your current political position?",
      "options": [
        { "text": "No formal position", "score": 1 },
        { "text": "Party activist", "score": 2 },
        { "text": "Aspiring candidate", "score": 3 },
        { "text": "Serving in office", "score": 4 }
      ]
    }
  ]
}
```

## Deployment Checklist

Before running `firebase deploy`:
- [ ] `git status` shows clean working directory
- [ ] Correct branch checked out: `git branch`
- [ ] `npm run build` completes without errors
- [ ] Changes tested locally if possible
- [ ] No sensitive data in commits (service keys, etc.)

After running `firebase deploy`:
- [ ] Terminal shows "✔ Deploy complete!"
- [ ] Hosting URL displays correctly
- [ ] Hard refresh browser (Cmd+Shift+R)
- [ ] Test main pages: Home, Assessment, Apply, About
- [ ] Check assessment questions load
- [ ] Verify refund text shows on apply page

## Next Steps for Future Development

1. **Update Founder Information** - Edit `data/content.json` `pages.about.founders`
2. **Customize Assessment** - Modify questions in `data/content.json` as needed
3. **Test Full Flow** - Assessment → Results → Apply → Payment
4. **Add Hero Image** - Upload image and set `heroImage` URL in `data/settings.json`
5. **Configure Payment** - Verify Paystack keys if payment changes needed
6. **Admin Panel** - Use `/admin` to manage content from UI instead of editing JSON

## Useful Commands

```bash
# Check which branch you're on
git branch

# Switch to feature branch
git checkout claude/images-not-showing-l289y6

# Pull latest changes
git pull origin claude/images-not-showing-l289y6

# See recent commits
git log --oneline -5

# Build for production
npm run build

# Deploy to Firebase
firebase deploy

# View Firebase logs
firebase functions:log

# Start local dev server (if needed)
npm run dev
```

## Support & Issues

- **Firebase Console:** https://console.firebase.google.com/project/thepolibrandagency-d4263
- **Live Site:** https://thepolibrandagency-d4263.web.app
- **GitHub:** https://github.com/johnsedofiadakey-hue/thepolibrandagency

---

**Created:** June 27, 2026  
**For:** Future AI Assistants & Developers  
**Maintained by:** The Polibrand Agency Development Team
