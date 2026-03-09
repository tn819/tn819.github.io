> **Stack:** Obsidian + Obsidian automation tools + Telegram Sync + Obsidian Web Clipper + Obsidian Sync/Syncthing **Capture sources:** Telegram (links, text, files/PDFs) · Browser/LinkedIn (Web Clipper) **No external subscriptions required**

---
## Overview

|Phase|What you're doing|Time|Day|Status|
|---|---|---|---|---|
|1|Install Obsidian + core plugins|1 hr|Day 1|✅ Done|
|2|Configure automation tools|15 min|Day 1|✅ Done|
|3|Scaffold vault structure|5 min|Day 1|✅ Done|
|4|Configure community plugins|1 hr|Day 1–2|✅ Done|
|5|Set up sync across machines|30 min|Day 2|✅ Done|
|6|Set up Telegram capture pipeline|20 min|Day 3|✅ Done|
|7|Set up Web Clipper for LinkedIn/browser|5 min|Day 3|✅ Done|
|8|Build the habit|Week 1–2|Ongoing|📋 Ready|

**Total setup time: ~3.5 hours spread over 3 days.**

---

## Phase 1 — Install Obsidian + Core Plugins (Day 1, ~1 hr)

### 1.1 Install Obsidian

1. Download from [obsidian.md](https://obsidian.md/)
2. Create a new vault — name it e.g. `Second Brain`
3. Choose a location you can find easily (e.g. `~/Documents/Second Brain`)

### 1.2 Enable Core Plugins

Settings → Core Plugins → enable each:

- Templates
- Daily Notes
- Backlinks
- Tag Pane

### 1.3 Install Community Plugins

Settings → Community Plugins → turn off Restricted Mode → Browse → install and enable each:

|Plugin|Purpose|
|---|---|
|**Tasks**|GTD-aware task tracking with dates and priorities|
|**Dataview**|Query engine powering your daily dashboard|
|**Periodic Notes**|Daily and weekly note automation|
|**QuickAdd**|Frictionless capture hotkey from anywhere|
|**Calendar**|Date navigation sidebar|
|**Telegram Sync**|Captures links, text, and files from Telegram into vault|
|**Auto Card Link**|Converts bare URLs into rich card previews with title, description, image|
|**Enhance YouTube Links**|Extracts video titles, thumbnails, and channel info from YouTube URLs|

---

## Phase 2 — Configure Automation Tools (Day 1, ~15 min)

Set up any desired automation tools or scripts to interact with your vault. This can include API integrations, command-line tools, or custom scripts that help manage your notes and tasks.
---

## Phase 3 — Scaffold the Vault (Day 1, ~5 min)

Use an automation script or manually create the following folder structure and templates. This ensures your vault is ready for GTD processing.

````
Scaffold the GTD vault with the following structure.
Create each folder and file exactly as specified.

FOLDERS TO CREATE:
- 000 Inbox
- 100 Projects
- 200 Areas
- 300 Articles
- 400 Resources
- 500 Archive
- Templates

FILES TO CREATE:

--- FILE: Templates/Daily Note.md ---
# {{date:dddd, MMMM D YYYY}}

## 🗓️ Today's Schedule


## ✅ Tasks Due Today
```dataview
TASK
WHERE !completed
AND (due = date(today) OR (due < date(today)))
SORT priority DESC
```

## 📥 Inbox to Process
```dataview
TASK
FROM "000 Inbox"
WHERE !completed
```

## 🔁 Top 3 Priorities Today
1. 
2. 
3. 

## 📝 Notes & Thoughts


## 🌙 End of Day
- What got done:
- What carries over:
- One thing worth remembering:

--- FILE: Templates/Weekly Review.md ---
# Weekly Review — {{date:YYYY [W]WW}}

## 1. Inbox to Zero
- [ ] Process all items in Inbox.md
- [ ] Clear Telegram bot chat

## 2. Project Sweep
```dataview
LIST
FROM "100 Projects"
WHERE !contains(file.name, "Archive")
```
For each: does it have a clear next action?

## 3. All Open Tasks
```dataview
TASK
WHERE !completed
SORT due ASC
```

## 4. Waiting For
```dataview
TASK
WHERE !completed AND contains(tags, "#waiting")
```

## 5. Someday/Maybe
```dataview
TASK
WHERE !completed AND contains(tags, "#someday")
```

## 6. Next Week Prep
- Key meetings/events:
- Top 3 goals for the week:

--- FILE: Templates/Project Note.md ---
# Project Name

## Goal
What does done look like?

## Next Action
- [ ] The very next physical step 📅 

## All Tasks
- [ ] 
- [ ] 

## Context & Notes


## Waiting For
- [ ] #waiting 

## Done

--- FILE: 000 Inbox/Inbox.md ---
# Inbox

Everything captured here gets processed in the next clarify session.

Confirm each file and folder has been created successfully.
````

The automation will create all necessary folders and files. Verify by opening Obsidian — all folders and templates should be visible.

---

## Phase 4 — Configure Community Plugins (Day 1–2, ~1 hr)

### 4.1 Periodic Notes

Settings → Periodic Notes → Daily Notes:

- **Format:** `YYYY-MM-DD`
- **Template file:** `Templates/Daily Note`
- **New file location:** `Daily Notes`

Settings → Periodic Notes → Weekly Notes:

- **Format:** `YYYY-[W]WW`
- **Template file:** `Templates/Weekly Review`
- **New file location:** `Weekly Reviews`

### 4.2 Tasks Plugin

No config needed. Learn the syntax:

```
- [ ] Task name ⏫ 📅 2026-03-10
```

|Symbol|Meaning|
|---|---|
|`⏫`|High priority|
|`🔼`|Medium priority|
|`🔽`|Low priority|
|`📅`|Due date|
|`⏳`|Scheduled date|
|`🔁`|Recurring|

### 4.3 Dataview

No config needed. The queries in your templates work immediately after installation.

### 4.4 QuickAdd

Settings → QuickAdd → Add Choice → **Capture**:

- Name: `Quick Capture`
- Target file: `000 Inbox/Inbox.md`
- Format: `- [ ] {{VALUE}} ➕ {{DATE}}`
- Assign hotkey: `Cmd/Ctrl + Shift + A`

This gives you a single hotkey to drop a task into your inbox from anywhere in Obsidian — no need to open Inbox.md manually.

---

## Phase 5 — Set Up Sync (Day 2, ~30 min)

**Option A — Obsidian Sync ($4/mo, easiest)**

- Settings → Sync → Connect → create a remote vault
- Install Obsidian on your work laptop → sign in → connect same vault
- E2E encrypted, zero IT involvement, works on any machine

**Option B — Syncthing (free, self-hosted)**

- Install from [syncthing.net](https://syncthing.net/) on both machines
- Add your vault folder as a shared folder
- Devices sync peer-to-peer — no cloud middleman
- Slightly more setup but fully local-first

> Note: repeat Phase 2 (automation config) on your work laptop if you want the same tools connected to the vault there too.

---

## Phase 6 — Set Up Telegram Capture Pipeline (Day 3, ~20 min)

### 6.1 Create Your Telegram Bot (5 min)

1. Open Telegram → search **@BotFather**
2. Send `/newbot`
3. Name it e.g. `Obsidian Inbox Bot`
4. Username e.g. `thomas_obsidian_bot` (must end in `bot`)
5. Copy the **bot token** BotFather returns — looks like `1111111:XXXXXXX...`
6. Open the new bot → tap **Start**

Save the bot as a contact named **"Obsidian Inbox"** in your phone — this makes forwarding a one-tap action.

### 6.2 Install + Connect Telegram Sync Plugin

1. Obsidian → Settings → Community Plugins → install **Telegram Sync**
2. Settings → Telegram Sync → paste your bot token → click **Connect**
3. Green status = connected

> **Important:** The plugin only runs when Obsidian is open on desktop. Anything you forward from your phone queues in Telegram and syncs the next time you open Obsidian on your Mac/PC.

### 6.3 Configure Content Routing Rules

In Telegram Sync settings, set up three processing rules:

---

**Rule 1 — URLs → `/300 Articles` (new note)**

|Setting|Value|
|---|---|
|Condition|Message contains URL|
|Action|Create new note|
|Folder|`300 Articles`|
|Filename|`{{content:60}} {{date:YYYY-MM-DD}}`|

Note template:

```
---
source: {{content}}
captured: {{date:YYYY-MM-DD HH:mm}}
tags: [inbox, article]
---

# Captured Article

{{forwardInfo}}

**Source:** {{content}}
**Date:** {{date:dddd, MMMM D YYYY}}

## Notes

```

---

**Rule 2 — Plain text → `000 Inbox/Inbox.md` (append)**

|Setting|Value|
|---|---|
|Condition|Message is text (no URL, no file)|
|Action|Append to existing note|
|File|`000 Inbox/Inbox.md`|

Append template:

```
- [ ] {{content:text}} ➕ {{messageTime:YYYY-MM-DD}}
{{forwardInfo}}
```

Text notes land directly as tasks in your inbox, ready for the next clarify session. The `{{forwardInfo}}` preserves context like "Forwarded from [Name]" when relevant.

---

**Rule 3 — Files/PDFs → `/400 Resources` (new note)**

|Setting|Value|
|---|---|
|Condition|Message contains file or document|
|Action|Create new note|
|Folder|`400 Resources`|
|Filename|`{{file:name}} {{date:YYYY-MM-DD}}`|

Note template:

```
---
captured: {{date:YYYY-MM-DD}}
tags: [inbox, resource]
---

# {{file:name}}

![[{{file:name}}]]

## Notes

```

The file is saved into your vault and embedded in the note automatically.

---

### 6.4 Optional: Auto-delete Processed Messages

In Telegram Sync settings, enable **"Delete messages after processing"** to keep the bot chat clean. The bot becomes a send-and-forget inbox.

---

### 6.5 Configure URL Enrichment (Auto Card Link)

Telegram Sync captures URLs as bare links. To convert them into rich previews with titles, descriptions, and thumbnails, install and configure the **Auto Card Link** plugin.

#### Install Auto Card Link

1. Settings → Community Plugins → Browse → search **"Auto Card Link"**
2. Install and enable it
3. (Optional) Repeat for **"Enhance YouTube Links"** — provides better YouTube-specific handling

#### Usage — Converting Captured URLs

When you open a captured article in `/300 Articles`:

**Option A: Manual conversion (recommended)**
1. Select the bare URL in the note
2. Open Command Palette (`Cmd/Ctrl+P`)
3. Type "Auto Card Link: Generate card link block"
4. The URL transforms into a rich card with title, description, and thumbnail

**Option B: Automatic conversion on paste**
1. Settings → Auto Card Link → enable **"Generate automatically when pasting URL"**
2. All pasted URLs automatically become rich cards

**Example transformation:**

*Before (Telegram capture):*
```markdown
**Forwarded from [Thomas](https://t.me/tommylasvegas)**

https://www.youtube.com/watch?v=We7BZVKbCVw
```

*After (Auto Card Link):*
```markdown
**Forwarded from [Thomas](https://t.me/tommylasvegas)**

```cardlink
url: https://www.youtube.com/watch?v=We7BZVKbCVw
title: "How to Build a Second Brain | Tiago Forte"
description: "Tiago Forte explains the methodology behind building a second brain to manage your digital life and boost productivity..."
image: https://img.youtube.com/vi/example/0.jpg
```
```

> **Note:** Auto Card Link fetches metadata when you run the conversion command, not at capture time. This requires an internet connection when enriching, but your notes remain fully functional offline after conversion.

#### Bulk Enrichment Workflow

To enrich multiple captured articles at once:

1. Open `/300 Articles` folder in Obsidian
2. Open the first article note
3. Select the URL → Command Palette → "Auto Card Link: Generate card link block"
4. Use `Cmd/Ctrl+Tab` to cycle to next note, repeat

For 10-20 articles, this takes 3-5 minutes. The visual preview makes scanning your reading list dramatically easier.

---

## Phase 7 — Set Up Web Clipper for LinkedIn/Browser (Day 3, ~5 min)

The Obsidian Web Clipper is a browser extension that captures any webpage — including LinkedIn posts and articles — directly into your vault as a markdown note. No external service, no subscription, works offline.

### 7.1 Install the Extension

Install from your browser's extension store — available for Chrome, Firefox, Safari, Brave, Arc, and most Chromium browsers. Search **"Obsidian Web Clipper"** or find it at [obsidian.md/clipper](https://obsidian.md/clipper).

### 7.2 Configure Web Clipper Settings

1. Click the Web Clipper extension icon → **Settings**

2. **General Settings:**
   - **Vault:** Select your vault name
   - **Default folder:** `300 Articles`
   - **Default template:** `Templates/Web Clipper Article`

3. **Behavior Settings:**
   - **Open note after capture:** ✅ Enable (opens immediately for review)
   - **Show confirmation dialog:** ✅ Enable (prevents accidental captures)
   - **Clip selection only:** ⬜ Disable (captures full article by default)

4. **Template Variables Available:**

| Variable | Description | Example |
|----------|-------------|---------|
| `{{title}}` | Page title | "How to Build Habits" |
| `{{url}}` | Full URL | https://example.com/article |
| `{{author}}` | Article author (if detected) | "James Clear" |
| `{{date}}` | Capture timestamp | 2026-03-07 |
| `{{description}}` | Meta description | Article summary... |
| `{{highlights}}` | Your highlighted text | Selected passages... |
| `{{site}}` | Site name | "Medium" |
| `{{image}}` | Featured image URL | https://.../image.jpg |

### 7.3 Template Configuration

Your Web Clipper template at `Templates/Web Clipper Article.md`:

```markdown
---
source: {{url}}
captured: {{date:YYYY-MM-DD HH:mm}}
tags: [inbox, article]
---

# {{title}}

**Source:** {{url}}
**Author:** {{author}}
**Date Captured:** {{date:YYYY-MM-DD}}

## Summary

{{description}}

## Highlights

{{highlights}}

## Notes

```

### 7.4 Usage Workflows

#### Quick Capture (One-Click)

1. Browse to any article, LinkedIn post, or web page
2. Click the Web Clipper extension icon (or press `Alt+Shift+O` / `Option+Shift+O`)
3. Review the capture preview
4. Click **Save** → note appears instantly in `/300 Articles`

#### Capture with Highlights

1. **Before clipping**, select/highlight important text on the page
2. Click Web Clipper icon
3. Check "Clip selection only" or let it capture full article + highlights
4. Your highlights appear in the `## Highlights` section

#### LinkedIn-Specific Workflow

**Desktop:**
- Navigate to the LinkedIn post in browser
- Click Web Clipper icon → captures post text, author, and link
- LinkedIn articles work the same way

**Mobile:**
- Open LinkedIn post in mobile browser (not the app)
- Use browser's Share → "Obsidian Web Clipper"
- Alternatively: copy link → forward to Telegram bot (simpler on mobile)

#### Research Workflow (Multi-Article)

When doing deep research on a topic:

1. Open multiple articles in browser tabs
2. Capture each with Web Clipper
3. All land in `/300 Articles` with full content
4. In Obsidian: bulk-process by opening each and extracting key insights to project notes

### 7.5 Web Clipper vs Telegram Capture: When to Use Which

| Scenario | Best Tool | Why |
|----------|-----------|-----|
| Quick link on phone | Telegram bot | Fastest, works from any app |
| Reading article on desktop | Web Clipper | Full content + highlights |
| LinkedIn on mobile | Telegram bot | LinkedIn app blocks sharing |
| Research project | Web Clipper | Better formatting, easier batch processing |
| YouTube video | Telegram bot | Auto Card Link handles it well |
| Twitter/X thread | Web Clipper | Better text extraction |
| PDF or file | Telegram bot | Direct file capture |

**Rule of thumb:** Use Telegram for quick/mobile capture. Use Web Clipper when you're already on desktop and want full article content.

### 7.6 Mobile Web Clipper Setup

iOS Safari:
1. Tap Share button → scroll to "Edit Actions"
2. Enable "Obsidian Web Clipper"
3. Now appears in share sheet for any webpage

Android Chrome:
1. Tap menu (⋮) → Share → "Obsidian Web Clipper"
2. Or: Menu → "Add to Home screen" for quick access

---

## Content Routing Summary

```
Telegram → "Obsidian Inbox" bot
          │
          ├── URL / article link    → New note in /300 Articles
          │
          ├── Plain text / thought  → Appended to 000 Inbox/Inbox.md
          │                            as a task line with timestamp
          │
          └── File / PDF            → Saved to /400 Resources
                                       + embed note created

Browser / LinkedIn → Obsidian Web Clipper
          │
          └── Any webpage or post   → New note in /300 Articles
```

---

## Daily Workflow

### Morning (10–15 min)

1. Open Obsidian → Daily Note auto-creates via Periodic Notes
2. Dataview queries load → see all tasks due today + overdue
3. Check your calendar → paste today's meetings into the schedule section
4. Decide which tasks get time blocks today
5. Process `Inbox.md` → for each item: trash it, file as reference, or convert to a project task

### During the Day

- **Slack task arrives** → `Cmd/Ctrl+Shift+A` (QuickAdd) → type task → done in 5 seconds, clarify later
- **Article or link in Telegram/WhatsApp** → forward to "Obsidian Inbox" bot → lands in `/300 Articles` automatically
- **LinkedIn post or browser article** → Web Clipper extension → one click → lands in `/300 Articles`
- **Quick thought on phone** → send text to bot → appended to Inbox.md as a task
- **PDF or file shared** → forward to bot → saved to `/400 Resources`
- **Complete a task** → check it off wherever it lives, Tasks plugin tracks it globally

### Evening (5 min)

- Mark done, roll unfinished tasks to tomorrow (change the `📅` date)
- Note 1–3 things worth remembering in the daily note

---

## Reading / Article Workflow (2–3x per week, 20–30 min)

1. Open `/300 Articles` in Obsidian — articles from Telegram forwarding and Web Clipper are waiting
2. Open each article note → follow the source link to read in browser
3. Add your highlights, reactions, and connections in the `## Notes` section
4. Change the `tags` frontmatter from `inbox` to a relevant topic tag
5. Link to related project or area notes using `[[double brackets]]`

This is where captured content becomes connected knowledge rather than forgotten bookmarks.

---

## Weekly Review (45–60 min, Friday or Sunday)

|Step|Action|
|---|---|
|**Inbox to zero**|Process everything in `Inbox.md`|
|**Articles review**|Check `/300 Articles` — annotate or archive anything unread for 2+ weeks|
|**Project sweep**|Open each `/100 Projects` note — does it have a clear next action?|
|**All open tasks**|Run Dataview "all open tasks" — anything stale, orphaned, or irrelevant?|
|**Waiting For**|Any `#waiting` tasks needing follow-up?|
|**Someday/Maybe**|Scan backlog — anything to activate or kill?|
|**Next week prep**|Look at calendar, assign tasks to days in advance|

---

## GTD Processing Logic (Clarify Session)

For every item in `Inbox.md`, ask in order:

|Question|If yes|If no|
|---|---|---|
|Is it actionable?|Define next action|→ Reference or Trash|
|Takes < 2 minutes?|Do it now|→ Task with context|
|Am I the right person?|Keep|→ Delegate (`#waiting`)|
|Is it one step?|Single task|→ Project note|

---

## Project Note Structure

Every project lives in `/100 Projects` using the template scaffolded in Phase 3:

```
# Project Name

## Goal
What does done look like?

## Next Action         ← always exactly ONE task here
- [ ] Next step 📅 

## All Tasks
- [ ] 
- [ ] 

## Context & Notes

## Waiting For
- [ ] #waiting 

## Done
```

**Rule:** The `## Next Action` section must always contain exactly one task. If you open a project and can't see what to do next, fix that before closing it.

---

## Ongoing Automation Usage

With automation tools connected, you can manage your vault efficiently:

|Action|What the tool does|
|---|---|
|Create project note|Creates a filled project note in `/100 Projects`|
|Add task to inbox|Appends task to `Inbox.md`|
|Search for #waiting tags|Searches vault and lists results|
|Archive note|Moves the file to 500 Archive|
|Full-text search|Search my vault for notes mentioning [topic]|

---

## The Three Non-Negotiable Habits

The system only works if these three are consistent:

1. **Capture everything immediately, clarify in batches** — never do both at once. Forward to the bot, QuickAdd the thought, then process later.
2. **Every project note has exactly one visible next action at all times** — the moment you close a project without a next action, it becomes dead weight.
3. **Weekly review is non-negotiable** — skip two weeks and the system becomes untrustworthy. Once untrustworthy, you stop using it.

---

## Tool Reference

### Automation Tools

|Function|What it does|
|---|---|
|Read note|Read any note|
|Create note|Create a new note|
|Edit note|Edit an existing note|
|Move note|Move a note to another folder|
|Create folder|Create a new folder|
|Search vault|Full-text search|
|Manage tags|Add or remove tags|
|Delete note|Delete a note|

### Telegram Sync Content Rules

|Content type|Destination|
|---|---|
|URL / link|`/300 Articles` — new note|
|Plain text|`000 Inbox/Inbox.md` — appended as task|
|File / PDF|`/400 Resources` — new note with embed|

### Tasks Plugin Syntax

|Symbol|Meaning|
|---|---|
|`⏫`|High priority|
|`🔼`|Medium priority|
|`🔽`|Low priority|
|`📅 YYYY-MM-DD`|Due date|
|`⏳ YYYY-MM-DD`|Scheduled date|
|`🔁`|Recurring|

---

## Workflow Resources

Your vault includes detailed workflow guides:

### Templates (`/Templates/`)
- **Daily Note.md** — Auto-created each morning
- **Daily Routine.md** — Morning/evening checklist
- **Weekly Review.md** — 7-step weekly processing
- **Project Note.md** — Standard project format
- **Web Clipper Article.md** — Article capture format
- **Telegram Capture.md** — Telegram message format

### Workflows (`/Workflows/`)
- **Quick Capture Cheat Sheet.md** — Device/content decision matrix
- **Archive Maintenance.md** — Monthly/quarterly cleanup guide

Use these as references until the workflows become muscle memory.

---

## Phase 8 — Build the Habit (Week 1–2, Ongoing)

Your system is now configured. This phase is about making it stick.

### The Three Non-Negotiable Habits

1. **Capture everything immediately, clarify in batches** — never do both at once
2. **Every project note has exactly one visible next action** — the moment you close a project without a next action, it becomes dead weight
3. **Weekly review is non-Negotiable** — skip two weeks and the system becomes untrustworthy

### Quick Reference Card

**Morning (10 min):**
- Open Obsidian → Daily Note auto-creates
- Review today's tasks (Dataview loads automatically)
- Check calendar → paste meetings

**Capture (5 seconds):**
- Desktop task: `Cmd/Ctrl+Shift+A` → type → Enter
- Article: Web Clipper icon → one click
- Phone: Forward to Telegram bot

**Evening (5 min):**
- Mark done tasks
- Roll unfinished to tomorrow (update `📅` dates)
- Note 1–3 things worth remembering

**Weekly (60 min):**
- Process Inbox to zero
- Review `/300 Articles` — read or archive
- Update every project's next action
- Plan next week's top 3 goals

---

## Next Steps

1. **Install Web Clipper** extension in your browser (Chrome/Firefox/Safari)
2. **Configure it**: Set vault → folder: `300 Articles` → template: `Templates/Web Clipper Article`
3. **Test capture**: Go to any article → click Web Clipper icon → verify note appears in vault
4. **Start capturing**: Use Telegram for quick links, Web Clipper for deep research
5. **Do your first Weekly Review**: This Friday or Sunday, spend 60 minutes processing everything

Your GTD system is ready. Trust it. Use it. Build the habits.
