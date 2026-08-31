# readable.ai Launch Checklist

## Pre-Launch

### Code & Testing
- [ ] All tests passing (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Parser handles 50+ real LLM responses correctly
- [ ] All 4 renderers (cards, stats, chat, timeline) work without errors
- [ ] Playground page functional at `/playground`
- [ ] Embed configurator page functional at `/embed`

### Documentation
- [ ] README.md comprehensive and accurate
- [ ] Package.json descriptions finalized
- [ ] GitHub repo created and linked
- [ ] Live demo running (playground working)

### Publishing Setup
- [ ] NPM account created
- [ ] NPM token generated and added to GitHub secrets as `NPM_TOKEN`
- [ ] GitHub organization or personal account ready
- [ ] License file (MIT) included in root

## Launch Day

### 1. Publish npm Packages
```bash
# Update versions in package.json files
# Commit with [publish] tag
git commit -m "Release v0.1.0-alpha [publish]"
git push origin main
```

GitHub Actions will automatically publish to npm.

### 2. Deploy Dashboard
```bash
# Dashboard auto-deploys to Vercel on push to main
# Verify at: readable.ai (configure in Vercel dashboard)
```

### 3. Announce

#### Twitter
- Share playground link
- Highlight 3 main problems solved
- Include before/after code snippet
- Tag @vercel, @reactjs, @nextjs

#### Product Hunt
- Write compelling maker comment
- Highlight that it's free and open source
- Link to playground first (frictionless)
- Respond to every comment

#### Dev.to
- Write "Stop rendering raw AI text in your app" post
- Practical walkthrough with playground
- Mention @readable-ai as solution

#### Hacker News
- Submit as "Show HN: readable.ai"
- Include live demo link
- Focus on the problem: every AI developer rebuilds this

#### Personal Network
- Email beta testers with launch link
- Request testimonials for case studies
- Share in relevant Discord/Slack communities

## Post-Launch (First Month)

### Week 1: Stabilization
- Monitor error tracking (Sentry)
- Fix any parsing edge cases found
- Update docs based on feedback
- Publish v0.1.1 patch if needed

### Week 2-3: Content & Reach
- Write technical blog post on parsing strategy
- Create video demo (5 min walkthrough)
- Reach out to 20 developers who post about AI UX
- Request GitHub stars and sharing

### Week 4: Analytics & Iteration
- Review analytics:
  - Playground usage
  - Most popular renderer
  - Geographic distribution
  - Average session duration
- Prioritize next features based on data
- Plan v0.2.0 (ML-powered improvements, more renderers)

## Success Metrics (30 Days)

- [ ] 500+ npm installs
- [ ] 100+ GitHub stars
- [ ] 1000+ playground users
- [ ] First 5 paid customers (if billing live)
- [ ] 20+ mentions on Twitter/HN

## Long-Term (Months 2-6)

- [ ] v0.2.0: ChatRenderer improvements, ML classifier
- [ ] v0.3.0: Custom renderer SDK
- [ ] Stripe billing: Free tier, Pro ($29/mo)
- [ ] White-label tier for enterprise
- [ ] 1000+ npm downloads/week
- [ ] Established as standard tool in Vercel AI SDK ecosystem

## Rollback Plan

If critical issues found post-launch:
1. Patch version immediately (v0.1.1)
2. Unpublish to npm if needed (`npm unpublish @readable-ai/react@0.1.0-alpha`)
3. Fix issues locally
4. Re-publish after testing

## Resources Needed

### External Tools
- GitHub: Private repo (now public for launch)
- npm: Published under @readable-ai org
- Vercel: Dashboard deployment
- Sentry: Error tracking (free tier)
- Plausible: Analytics (if enabled)
- Twitter: @readable_ai or @readableai

### Credentials
- npm token in GitHub secrets
- Vercel API token (if automated deploys)
- GitHub token (for releases)

## Questions Before Launch?

- Is the parser confident enough (80%+)?
- Are all renderers visually polished?
- Is the playground fast enough (<1s load)?
- Have you tested on mobile?
- Is the embed CDN path correct?
