# Frontend Design Principles

## Core Philosophy: Avoid AI Slop

Generic, "on distribution" outputs create the "AI slop" aesthetic. Make creative, distinctive frontends that surprise and delight.

---

## Typography

**Choose fonts that are beautiful, unique, and interesting.**

❌ **Avoid:**
- Inter
- Roboto
- Arial
- System fonts
- Space Grotesk (overused)

✅ **Consider:**
- [Berkeley Mono](https://berkeleygraphics.com/typefaces/berkeley-mono/) - Technical elegance
- [Ginto](https://abcdinamo.com/typefaces/ginto) - Discord's distinctive face
- [Departure Mono](https://github.com/rektdeckard/departure-mono) - Open source terminal feel
- [Commit Mono](https://commitmono.com/) - Developer-focused sans
- [Geist](https://vercel.com/font) - Vercel's refined system
- [Satoshi](https://www.fontshare.com/fonts/satoshi) - Geometric warmth
- [Cabinet Grotesk](https://www.fontshare.com/fonts/cabinet-grotesk) - Editorial weight
- [Clash Display](https://www.fontshare.com/fonts/clash-display) - Bold headlines
- Custom web fonts from [Google Fonts](https://fonts.google.com/), [Fontshare](https://www.fontshare.com/), or [Velvetyne](https://velvetyne.fr/)

---

## Color & Theme

**Commit to a cohesive aesthetic. Dominant colors with sharp accents outperform timid palettes.**

❌ **Avoid:**
- Purple gradients on white backgrounds (cliché)
- Evenly-distributed color palettes
- Generic blue/gray schemes
- Timid, safe choices

✅ **Approach:**
- Use CSS variables for consistency
- Draw inspiration from IDE themes (Dracula, Nord, Tokyo Night, Catppuccin, Gruvbox)
- Cultural aesthetics (Brutalism, Swiss design, Cyberpunk, Vaporwave)
- Dominant color + sharp accent strategy
- Commit fully to light OR dark theme

**Example Palettes:**

```css
/* Cyberpunk Noir */
--bg-primary: #0a0a0f;
--bg-secondary: #1a1a2e;
--accent-neon: #ff00ff;
--accent-cyan: #00ffff;
--text: #e0e0e0;

/* Warm Brutalist */
--bg-primary: #f5f0e8;
--bg-secondary: #e8dfd0;
--accent-terracotta: #d4583b;
--accent-charcoal: #2d2d2d;
--text: #1a1a1a;

/* Terminal Green */
--bg-primary: #0d1117;
--bg-secondary: #161b22;
--accent-green: #39ff14;
--accent-dim: #238636;
--text: #c9d1d9;
```

---

## Motion

**Use animations for high-impact moments. One well-orchestrated entrance beats scattered micro-interactions.**

✅ **Priorities:**
1. **CSS-only for HTML** - Performant, simple
2. **Framer Motion for React** - When you need orchestration
3. **Page load choreography** - Staggered reveals with `animation-delay`
4. **Purposeful micro-interactions** - Not everything needs to move

**Example Patterns:**

```css
/* Staggered reveal on load */
.card {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover micro-interaction */
.button {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.button:hover {
  transform: scale(1.05);
}
```

---

## Backgrounds

**Create atmosphere and depth, not flat surfaces.**

❌ **Avoid:**
- Solid color backgrounds
- Plain white or gray

✅ **Techniques:**

```css
/* Layered gradients */
background:
  radial-gradient(circle at 20% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
  radial-gradient(circle at 80% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
  linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);

/* Geometric patterns */
background-image:
  repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.02) 10px, rgba(255,255,255,.02) 20px);

/* Noise texture */
background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");

/* Mesh gradient (modern) */
background: radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 1) 0px, transparent 50%),
            radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 1) 0px, transparent 50%),
            radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 1) 0px, transparent 50%);
```

---

## Layout Patterns

**Break from predictable grids and card-based layouts.**

✅ **Alternatives:**
- Asymmetric grids
- Overlapping elements with z-index play
- Full-bleed sections
- Terminal/CLI-inspired interfaces
- Newspaper/editorial layouts
- Dashboard command centers
- Bento box arrangements (but avoid overuse)

---

## Context-Specific Character

**Design for the specific use case, not generic templates.**

For **Clawd Pumpany** (AI Company Launcher):
- Terminal/hacker aesthetic fits the "company spawning" concept
- Cyberpunk or tech noir themes align with AI agents
- Dashboard should feel like a command center
- Animations should feel "systems coming online"
- Typography: Monospace for code/data, display for headlines

Examples:
- Token addresses: Monospace with subtle glow
- Agent cards: Terminal-style with boot sequences
- Task lists: Command-line inspired
- Background: Matrix-style or circuit board patterns

---

## Anti-Patterns Checklist

Before shipping, check that you've avoided:

- [ ] Using Inter, Roboto, or system fonts without strong justification
- [ ] Purple gradients on white backgrounds
- [ ] Generic card layouts with rounded corners everywhere
- [ ] Timid, evenly-distributed color schemes
- [ ] Animations on everything without purpose
- [ ] Solid color backgrounds
- [ ] Cookie-cutter components that could be from any site
- [ ] Safe, predictable choices

---

## Implementation Strategy

1. **Start with mood** - Choose aesthetic direction first
2. **Typography hierarchy** - Set up font families and scales
3. **Color system** - CSS variables for the theme
4. **Layout personality** - Break from standard patterns
5. **Motion choreography** - Plan key animation moments
6. **Background depth** - Add atmosphere
7. **Polish micro-interactions** - Final layer of delight

---

## Resources

**Fonts:**
- [Google Fonts](https://fonts.google.com/)
- [Fontshare](https://www.fontshare.com/)
- [Velvetyne](https://velvetyne.fr/)
- [DJR](https://djr.com/)

**Color:**
- [Coolors](https://coolors.co/)
- [Poline](https://meodai.github.io/poline/)
- [ColorBox](https://colorbox.io/)
- [Huemint](https://huemint.com/)

**Motion:**
- [Cubic Bezier](https://cubic-bezier.com/)
- [Easings](https://easings.net/)
- [Framer Motion](https://www.framer.com/motion/)

**Inspiration:**
- [Godly](https://godly.website/)
- [Awwwards](https://www.awwwards.com/)
- [Land-book](https://land-book.com/)
- IDE themes (Dracula, Nord, Tokyo Night)

---

**Remember: Think outside the box. Make unexpected choices. Create context-specific character.**
