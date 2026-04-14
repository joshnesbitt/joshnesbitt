---
title: "Building my own LLM OS, ctOS"
description: "I built an LLM-based operating system for my CTO workflow. It's changed where I spend my time and what I focus on. Here's what I've built and what I've learned."
pubDate: "07 Apr 2026 12:00:00"
---

I'm a CTO. My days are context switching. Meeting prep, stakeholder management, strategic planning, team comms, competitive intelligence, newsletters. The cognitive overhead of keeping all those threads alive was the real bottleneck. The work itself was manageable. Keeping track of it all was not.

So I built myself an operating system. I've been calling it ctOS, a Chief Technology Operating System. It's been running for a few months now, and it's changed where I spend my time.

```
============================================

   ██████╗  ████████╗   ██████╗   ███████╗
  ██╔════╝  ╚══██╔══╝  ██╔═══██╗  ██╔════╝
  ██║          ██║     ██║   ██║  ███████╗
  ██║          ██║     ██║   ██║  ╚════██║
  ╚██████╗     ██║     ╚██████╔╝  ███████║
   ╚═════╝     ╚═╝      ╚═════╝   ╚══════╝

  Chief Technology Operating System
  v1.0.0 | 07 Apr 2026
  Operator: Josh Nesbitt, CTO @ Genio

============================================

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
/linkedin           Draft a LinkedIn post
/geo-audit          GEO audit on a given URL
/about              This screen
```

## What it is

ctOS is a personal operating system built on top of Claude Code. The LLM is the kernel. Everything else (calendar, email, Slack, CRM, meeting notes) plugs in as peripherals through MCP servers.

The interface is the terminal. No app, no dashboard. I type commands and the system does the rest.

The architecture has three layers.

A system prompt that defines my operating context, preferences, and the persona of the system. An opinionated operator. It pushes back, flags risks, holds me accountable against the executive competencies my CEO evaluates me on.

A skill layer. Slash commands that handle recurring CTO workflows. `/daily-briefing` pulls my calendar, email, Slack, and tasks into a single morning brief. `/meeting-brief` preps me for any upcoming meeting with stakeholder context and recommended positions. `/eod` wraps my day and logs commitments. `/weekly-review` synthesises the week. `/research` does deep dives and persists findings. About fifteen of these, each built for a specific part of my rhythm.

A persistent filesystem that acts as long-term memory. Stakeholder CRM with interaction logs and relationship health tracking. Meeting briefs and follow-ups. Strategic plans. Weekly snapshots. Newsletter digests. The filesystem is the source of truth. Conversation context is ephemeral. The filesystem persists.

## What it's changed

The biggest shift is where my attention goes. Before ctOS, a large chunk of my morning was spent gathering context: scanning email, reading Slack, checking the calendar, cross-referencing notes from last week. Now `/daily-briefing` does that in seconds. It pulls from four different systems, cross-references them against my stakeholder CRM, and surfaces what actually matters. I start the day with a clear picture instead of spending the first hour assembling one.

Meeting prep used to be another tax. Pulling up the last conversation, remembering what was promised, figuring out what to push on. Now when I prep for a 1:1 with a direct report, the system reads their stakeholder file, surfaces open loops from our last conversation, checks for cold relationships, and suggests a question I should be asking. It has that context because I've been disciplined about writing back to the filesystem after every interaction.

The compounding effect is real. Every interaction I log, every briefing I run, every weekly review I complete makes the next one sharper. The system gets more useful over time because the filesystem grows. Most AI tools feel amnesiac. ctOS remembers.

The result is that I spend less time on operational overhead and more time on the things that actually move the needle: strategic thinking, building relationships, making decisions with better information. The CTO role has a lot of surface area. ctOS shrinks the administrative portion of it.

## What I've learned

The system is only as good as the data you feed it. The CRM, the meeting notes, the weekly reviews. If I don't keep those current, the whole thing degrades. Same garbage in, garbage out problem as anything else. The discipline of maintaining the filesystem is the real investment. But once the habit is there, the returns compound every week.

The persona matters more than I expected. Defining the system as an opinionated operator that challenges my assumptions and flags risks changed the dynamic. It does what I need, which is sometimes different from what I ask for. That friction is valuable. A system that only agrees with you is just a mirror.

Terminal first is the right call. No switching between apps. No visual noise. Just me and the system, working through the day. It keeps me in flow rather than bouncing between tools.

## The bigger picture

Karpathy has been talking about the LLM OS concept publicly: the LLM as kernel, orchestrating tools and memory across modalities. It's a good framework. But the theory is catching up to what practitioners have already been building. The interesting work is happening in the specifics of individual workflows, not in the abstraction.

ctOS is bespoke. Built for how I work, what I care about, and the operational load of being a CTO at a growing company. That's the point. The tools were already there. I just needed a problem to solve. The LLM OS is a practice, and the practice is what makes it valuable.
