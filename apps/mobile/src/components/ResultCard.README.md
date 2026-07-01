# `apps/mobile/src/components/ResultCard.tsx`

## Why This File Is Needed

The result screen shows repeated metric cards. This component keeps card rendering consistent and prevents duplicate card UI code inside `App.tsx`.

## What It Owns

- Card title.
- Card value.
- Card tone: `neutral`, `good`, `warning`, or `danger`.
- Card border/background styling.
- Small tone dot in the top-right corner.
- Card shadow and spacing.

## Full Flow

```text
InspectionResult
  -> ResultCard(title, value, tone)
  -> card renders with tone-specific style and tone dot
```

## Why It Is Small

This POC is intentionally minimal. The component has only the props needed to explain reusable UI without making the project large.

## Visual Behavior

- `good` uses a green-tinted card for strong outcomes.
- `warning` uses an amber-tinted card for values that need attention.
- `danger` uses a red-tinted card for high-risk values.
- `neutral` keeps the default card surface for supporting values.

## Logs

This file logs each rendered card:

```text
[ResultCard.tsx]
```

That helps confirm the native response reached the UI.
