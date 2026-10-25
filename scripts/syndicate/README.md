# Syndication

When a push to `main` publishes a thought or review, `.github/workflows/syndicate.yml` writes a LinkedIn post and a Bluesky post for it with Claude and shares both with a link card for the article.

A post is picked up when it's added with `published` true (the default), or when `published` flips from false to true, and its `pubDate` is within the last 14 days. Edits to live posts are ignored, and a push that publishes more than two posts at once is treated as an import and skipped.

## Frontmatter

```yaml
syndicate: false        # never cross-post this one
social:                 # write the copy yourself; either key skips Claude for that platform
  linkedin: |
    First line that earns the click.

    #Leadership #AI
  bluesky: "One sharp line, under 300 characters."
```

## Flow

1. **Draft** writes the copy, checks it against the house rules (length, no em dashes, emoji, URLs or banned words), and puts it in the run summary.
2. **Publish to linkedin** and **Publish to bluesky** run in the `social` environment, wait for Netlify to serve the article and its OG image, then post. They're separate jobs, so a failure on one can be re-run without double-posting on the other.

Add yourself as a required reviewer on the `social` environment to approve copy before it goes out. Without that it posts automatically.

To post an older article, or retry, run the workflow by hand with the file path. `dry_run` defaults to on.

## Setup

Repository secrets:

- `ANTHROPIC_API_KEY`
- `BLUESKY_APP_PASSWORD`: an app password from Bluesky settings, never the account password
- `LINKEDIN_ACCESS_TOKEN`: a member token with `w_member_social`, from a LinkedIn developer app with the "Share on LinkedIn" product
- `LINKEDIN_AUTHOR_URN`: `urn:li:person:<id>` (the `sub` from `/v2/userinfo` if the app also has "Sign In with LinkedIn")

Repository variables (optional):

- `BLUESKY_HANDLE`: defaults to `joshnesbitt.dev`
- `LINKEDIN_VERSION`: the `YYYYMM` API version, defaults to `202606`. LinkedIn retires versions after about a year.

LinkedIn member tokens expire after 60 days and the publish job fails with a 401 when they do. Put a renewal in the calendar.

## Running locally

```sh
ANTHROPIC_API_KEY=... node scripts/syndicate.mjs draft --file src/content/thought/consistency.md
cat drafts.json
```
