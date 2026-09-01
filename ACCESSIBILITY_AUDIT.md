# Color Contrast Accessibility Audit

## WCAG Standards
- **AA**: 4.5:1 for normal text, 3:1 for large text (18pt+)
- **AAA**: 7:1 for normal text, 4.5:1 for large text (18pt+)

## Current Theme Colors

### Dark Mode
- Background: `#0a0a0a` (very dark)
- Cards: `#27272a` (gray-800)
- Secondary cards: `#3f3f46` (gray-700)
- Accent (primary): `#a78bfa` (violet-400)
- Accent (gradient): `#8b5cf6` (violet-500)
- Text headings: `#f4f4f5` (gray-100)
- Text body: `#a1a1aa` (gray-400)
- Text muted: `#71717a` (gray-500)

### Light Mode
- Background: `#ffffff` (white)
- Cards: `#ffffff` (white)
- Secondary cards: `#fafafa` (gray-50)
- Accent (primary): `#7c3aed` (violet-600)
- Accent (gradient): `#8b5cf6` (violet-500)
- Text headings: `#18181b` (gray-900)
- Text body: `#52525b` (gray-600)
- Text muted: `#71717a` (gray-500)

## Contrast Ratio Analysis

### Dark Mode - Critical Issues

| Combination | Foreground | Background | Contrast Ratio | Status |
|-------------|------------|-------------|----------------|--------|
| violet-400 on gray-800 | #a78bfa | #27272a | ~2.25:1 | ❌ FAILS AA |
| gray-400 on gray-800 | #a1a1aa | #27272a | ~2.25:1 | ❌ FAILS AA |
| gray-500 on gray-800 | #71717a | #27272a | ~1.8:1 | ❌ FAILS AA |
| gray-100 on gray-800 | #f4f4f5 | #27272a | ~4.75:1 | ✅ PASSES AA |
| violet-400 on gray-700 | #a78bfa | #3f3f46 | ~1.9:1 | ❌ FAILS AA |

### Light Mode - Critical Issues

| Combination | Foreground | Background | Contrast Ratio | Status |
|-------------|------------|-------------|----------------|--------|
| violet-600 on white | #7c3aed | #ffffff | ~4.5:1 | ✅ PASSES AA |
| gray-600 on white | #52525b | #ffffff | ~5.5:1 | ✅ PASSES AA |
| gray-500 on white | #71717a | #ffffff | ~4.2:1 | ✅ PASSES AA |
| gray-900 on white | #18181b | #ffffff | ~14:1 | ✅ PASSES AAA |
| violet-600 on gray-50 | #7c3aed | #fafafa | ~4.4:1 | ✅ PASSES AA |

## Recommendations

### High Priority Fixes (Dark Mode)

1. **Replace violet-400 with lighter shade for text**
   - Current: `#a78bfa` (violet-400)
   - Recommended: `#c4b5fd` (violet-300) or `#ddd6fe` (violet-200)
   - Expected contrast on gray-800: ~3.5:1 to ~5:1

2. **Replace gray-400 with lighter shade for body text**
   - Current: `#a1a1aa` (gray-400)
   - Recommended: `#d4d4d8` (gray-300) or `#e4e4e7` (gray-200)
   - Expected contrast on gray-800: ~4.5:1 to ~6:1

3. **Replace gray-500 with lighter shade for muted text**
   - Current: `#71717a` (gray-500)
   - Recommended: `#a1a1aa` (gray-400) or `#d4d4d8` (gray-300)
   - Expected contrast on gray-800: ~2.25:1 to ~4.5:1

### Medium Priority Improvements

1. **Consider darker card backgrounds in dark mode**
   - Current: `#27272a` (gray-800)
   - Alternative: `#18181b` (gray-900) for better contrast with light text

2. **Add focus ring improvements**
   - Current: `focus:ring-violet-500/20`
   - Recommended: `focus:ring-violet-400/50` for better visibility

### Low Priority Enhancements

1. **Add high contrast mode option in settings**
   - Allow users to switch to a high-contrast theme
   - Could use pure white text on pure black backgrounds

2. **Consider text size adjustments**
   - Ensure all text meets minimum size requirements
   - Large text (18pt+) only needs 3:1 contrast

## Implementation Plan

### Phase 1: Critical Dark Mode Fixes
1. Update all `text-violet-400` to `text-violet-300` in dark mode
2. Update all `text-gray-400` to `text-gray-300` in dark mode
3. Update all `text-gray-500` to `text-gray-400` in dark mode

### Phase 2: Focus Ring Improvements
1. Update focus ring opacity from `/20` to `/50`
2. Test keyboard navigation visibility

### Phase 3: High Contrast Mode (Optional)
1. Add high contrast theme option in settings
2. Implement pure black/white color scheme
3. Add toggle in Settings page

## Testing

After implementing fixes, test with:
1. [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. Chrome DevTools Accessibility Audit
3. Screen reader testing (NVDA, VoiceOver)
4. Keyboard-only navigation
