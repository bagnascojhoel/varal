# US-14 — Share Recommendation

## Story

As a Washer, I want to share the day's recommendation via a link or image, So
that I can send it to family or roommates.

## Technical Description

A share button is added to the day card. On click, the Web Share API is used to
share a URL that encodes the recommendation (coordinates and date). A clipboard
fallback handles browsers without Web Share API support. Optionally, an Open
Graph image (`og:image`) can be generated server-side for rich link previews in
messaging apps — this would require a new image generation endpoint in
`app/api/`. The link-only approach requires no new ports or infrastructure.

> ⚠️ **Open question**: Should the initial version be link-only (simpler, no new
> endpoint) or include og:image generation for richer previews? This is a scope
> decision that affects effort significantly.

---

## Tasks

### Design

Define the share button placement within the day card and the content of the
shared message (URL text, optional image layout if og:image is in scope).

### Front-End

Implement the share button using the Web Share API with a clipboard fallback.
Encode the location and date into the shareable URL and display a confirmation
on successful copy.
