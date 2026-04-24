---
title: "Building my own LLM Operating System, ctOS"
description: "A conversation with Jack a few months ago set me off on an idea that radically changed how I work. We were talking about how skills in Claude could add an intelligent layer on top of the notes I'd been keeping in Obsidian for years. By the end of it, I'd started building something tailored to how I work as a CTO."
pubDate: "24 Apr 2026 12:00:00"
---

A conversation with [Jack](https://www.linkedin.com/in/jack-sails/) a few months ago set me off on an idea that radically changed how I work. We were talking about how skills in Claude could add an intelligent layer on top of the notes I'd been keeping in Obsidian for years. By the end of it, I'd started building something tailored to how I work as a CTO.

My days are often spent context switching. Meeting prep, stakeholder management, strategic planning and competitive intelligence to name a few. The cognitive overhead of keeping all those threads active requires a lot of manual admin. If I'm not careful, things quickly get messy.

I built myself an operating system to help solve these problems. I've been calling it **ctOS**, a Chief Technology Operating System. It's been running for a few months now, and it's been an absolute revelation for me.

```
  ==========================================

   ██████╗  ████████╗   ██████╗   ███████╗
  ██╔════╝  ╚══██╔══╝  ██╔═══██╗  ██╔════╝
  ██║          ██║     ██║   ██║  ███████╗
  ██║          ██║     ██║   ██║  ╚════██║
  ╚██████╗     ██║     ╚██████╔╝  ███████║
   ╚═════╝     ╚═╝      ╚═════╝   ╚══════╝

  Chief Technology Operating System
  v1.0.8 | 24 Apr 2026
  Operator: Josh Nesbitt, CTO @ Genio

  ==========================================

  AVAILABLE MODULES

  Daily rhythm
  /daily-briefing     Morning briefing: calendar, tasks, email, Slack
  /eod                End-of-day wrap-up and commitment log
  /weekly-review      End-of-week synthesis and snapshot

  Meetings
  /meeting-brief      Pre-meeting prep for any calendar event
  /one-to-one         1:1 prep for a direct report

  Knowledge
  /pull-grain         Summarise a Grain meeting recording
  /pull-trends        Weekly newsletter digest
  /pull-competitors   Competitive intelligence brief
  /research           Deep research on a topic

  Tools
  /action-tracker     Surface all open loops and outstanding actions
  /stakeholder        Create or update a stakeholder CRM profile
  /geo-audit          GEO audit on a given URL
  /proofread          Spelling, grammar, and tone check
  /about              This screen
```

## The system architecture

ctOS is a personal operating system built on top of Claude Code. The LLM is the kernel. Everything else (calendar, email, Slack, CRM, notes) plugs in as peripherals through MCP servers and skills.

The architecture has three layers:

**A system prompt.** The scene-setting layer that defines my operating context, preferences, and the persona of the system. An opinionated operator. It pushes back, flags risks and holds me accountable to commitments.

**A skill layer.** Slash commands that handle recurring CTO workflows. `/daily-briefing` pulls my calendar, email, Slack, and tasks into a single morning brief. `/meeting-brief` preps me for any upcoming meeting with stakeholder context and recommended positions. `/eod` wraps my day and logs commitments. `/weekly-review` logs events from the week. `/research` digs deep into a topic and persists findings. About fifteen of these skills, each built to solve a specific point of friction.

**A persistent filesystem that acts as long-term memory.** Stakeholder CRM with interaction logs and relationship health tracking. Meeting briefs and follow-ups. Strategic plans. Weekly snapshots. Newsletter digests. The filesystem is the source of truth. Conversation context is ephemeral, but the filesystem persists.

The interface is the terminal. It's a task driven approach with no distractions, and it's a place I'm used to spending a lot of time in already.

## Reclaiming focus

The biggest improvement I've seen from this approach is regained focus. Before ctOS, a large chunk of my morning was spent gathering context: scanning emails, reading Slack, checking the calendar, cross-referencing notes from last week. Now `/daily-briefing` does that for me. It pulls from four different systems, cross-references them against my stakeholder CRM, and surfaces what actually matters. I start the day with a clear picture instead of spending the first hour assembling one.

A persistent filesystem has a compounding effect. Every interaction that's logged, every briefing I run, every weekly review I complete provides more context for the next one. The system gets more useful over time because the filesystem grows. Most AI tools feel amnesiac, and this is a good way to solve that.

## It's never going to be perfect

The system is only as good as the data you feed it. The CRM, the meeting notes, the weekly reviews. If I don't keep those current, the whole thing degrades. It's the same rubbish in, rubbish out problem that you'd have before AI, but is exacerbated with it. You need to invest time in building that corpus of knowledge.

The way you define the persona is also important. I chose one that interrogates my plans and pushes back on ideas to ensure they're well considered. It might be that you prefer more of a coached approach or something more agreeable, but I wouldn't recommend that if you're looking for a system that can help hold you to account on things.

## Personal tools for personal things

The operating system I've made is bespoke. Built for how I work and what I care about. It's taken some time to hone the system to my needs, but building the foundations for it was relatively quick. The beauty of this latest wave of agentic coding is how it's empowering people to scratch their own itch by creating super-personalised apps to solve specific problems. For tooling like this, building a solution exactly to your needs is becoming the default rather than the exception.

If you're craving a better way of working so you can focus on the things only you can do, I'd recommend taking a morning to try and use AI skills to streamline your workflow. I'm excited to continually evolve the operating system I've built as my needs change over time, and I'm certain I'm not alone in this approach.
