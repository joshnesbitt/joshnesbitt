---
title: "Building my own LLM OS, ctOS"
description: "I built an LLM-based operating system for my CTO workflow. It's changed where I spend my time and what I focus on. Here's what I've built and what I've learned."
pubDate: "14 Apr 2026 12:00:00"
---

As a CTO, my days are spent context switching. Meeting prep, stakeholder management, strategic planning, competitive intelligence. The cognitive overhead of keeping all those threads active require a lot of manual admin. Keeping track of everything can easily become a mess.

So I built myself an operating system. I've been calling it **ctOS**, a Chief Technology Operating System. It's been running for a few months now, and it's changed where I spend my time.

```
  ==========================================

   ██████╗  ████████╗   ██████╗   ███████╗
  ██╔════╝  ╚══██╔══╝  ██╔═══██╗  ██╔════╝
  ██║          ██║     ██║   ██║  ███████╗
  ██║          ██║     ██║   ██║  ╚════██║
  ╚██████╗     ██║     ╚██████╔╝  ███████║
   ╚═════╝     ╚═╝      ╚═════╝   ╚══════╝

  Chief Technology Operating System
  v1.0.8 | 14 Apr 2026
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
  /pull-tldr          Weekly TLDR newsletter digest
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

ctOS is a personal operating system built on top of Claude Code. The LLM is the kernel. Everything else (calendar, email, Slack, CRM, meeting notes) plugs in as peripherals through MCP servers and skills.

The interface is the terminal. The architecture has three layers:

**A system prompt.**  The scene setting layer, defines my operating context, preferences, and the persona of the system. An opinionated operator. It pushes back, flags risks and holds me accountable to commitments.

**A skill layer.** Slash commands that handle recurring CTO workflows. `/daily-briefing` pulls my calendar, email, Slack, and tasks into a single morning brief. `/meeting-brief` preps me for any upcoming meeting with stakeholder context and recommended positions. `/eod` wraps my day and logs commitments. `/weekly-review` logs events from the week. `/research` digs deep into a topic and persists findings. About fifteen of these skills, each built for a specific part of my workflow.

**A persistent filesystem that acts as long-term memory.** Stakeholder CRM with interaction logs and relationship health tracking. Meeting briefs and follow-ups. Strategic plans. Weekly snapshots. Newsletter digests. The filesystem is the source of truth. Conversation context is ephemeral, but the filesystem persists.

## Recovering focus

The biggest shift has been where my attention goes. Before ctOS, a large chunk of my morning was spent gathering context: scanning email, reading Slack, checking the calendar, cross-referencing notes from last week. Now `/daily-briefing` does that in seconds. It pulls from four different systems, cross-references them against my stakeholder CRM, and surfaces what actually matters. I start the day with a clear picture instead of spending the first hour assembling one.

Meeting prep used to be another tax. Pulling up the last set of conversations, remembering what was promised, figuring out what to push on. ctOS has that context because I've been disciplined about writing back to the filesystem after every interaction.

The nice thing about a persistent filesystem is that it has a compounding effect. Every interaction I log, every briefing I run, every weekly review I complete makes the next one sharper. The system gets more useful over time because the filesystem grows. Most AI tools feel amnesiac, and this is a good way to solve that.

I spend less time on operational overhead and more time on the things that actually matter: strategic thinking and making decisions with better information. The CTO role has a wide span of responsibility and ctOS shrinks the administrative portion of it.

## It's never going to be perfect

The system is only as good as the data you feed it. The CRM, the meeting notes, the weekly reviews. If I don't keep those current, the whole thing degrades. Same rubbish in, rubbish out problem as anything else.

The persona matters more than I expected. Defining the system as an opinionated operator that challenges my assumptions and flags risks changed the usefulness. It does what I need, which is sometimes different from what I ask for. A bit of friction is valuable. A system that only agrees with you is just a mirror.

Terminal first works well for me. No switching between apps. No complicated UX. It keeps me in flow rather than bouncing between tools.

## Personal tools for personal things

ctOS is bespoke. Built for how I work, what I care about, and the operational load of being a CTO at a growing company. That's the point. The tools were already there. I just needed a problem to solve. The LLM OS is a practice, and the practice is what makes it valuable.
