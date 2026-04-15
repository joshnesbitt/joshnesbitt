---
title: "Building my own LLM OS, ctOS"
description: "I built an LLM-based operating system for my CTO workflow. It's changed where I spend my time and what I focus on. Here's what I've built and what I've learned."
pubDate: "14 Apr 2026 12:00:00"
---

The beauty of this latest wave of agentic coding is how it's empowering people to scratch their own itch in innovate ways by creating super personalised apps to solve specific problems. It just so happens that this shift coincides with people finding new approaches to knowledge management using AI, too.

As a CTO, my days are spent context switching. Meeting prep, stakeholder management, strategic planning and competitive intelligence to name a few. The cognitive overhead of keeping all those threads active require a lot of manual admin, and if you're not careful, you can quickly get into a mess with managing all those threads.

I've been using Obsidian for note taking for a few years now, and it has naturally become my knowledge store for thoughts and actions. I'd also been increasingly using Claude Code to help author some of that documentation, it was only after a conversation with Jack about how you could use skills to add an intelligent layer on top of this that my mind turned to building an approach that was tailored to how I worked.

So I built myself an operating system. I've been calling it **ctOS**, a Chief Technology Operating System. It's been running for a few months now, and it's been an absolute game changer for me.

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

The interface is the terminal as this is where I work best.

The architecture has three layers:

**A system prompt.**  The scene setting layer, defines my operating context, preferences, and the persona of the system. An opinionated operator. It pushes back, flags risks and holds me accountable to commitments.

**A skill layer.** Slash commands that handle recurring CTO workflows. `/daily-briefing` pulls my calendar, email, Slack, and tasks into a single morning brief. `/meeting-brief` preps me for any upcoming meeting with stakeholder context and recommended positions. `/eod` wraps my day and logs commitments. `/weekly-review` logs events from the week. `/research` digs deep into a topic and persists findings. About fifteen of these skills, each built for a specific part of my workflow.

**A persistent filesystem that acts as long-term memory.** Stakeholder CRM with interaction logs and relationship health tracking. Meeting briefs and follow-ups. Strategic plans. Weekly snapshots. Newsletter digests. The filesystem is the source of truth. Conversation context is ephemeral, but the filesystem persists.

## Recovering focus

The biggest improvement I've seen from this approach is regained focus. Before ctOS, a large chunk of my morning was spent gathering context: scanning email, reading Slack, checking the calendar, cross-referencing notes from last week. Now `/daily-briefing` does that for me. It pulls from four different systems, cross-references them against my stakeholder CRM, and surfaces what actually matters. I start the day with a clear picture instead of spending the first hour assembling one.

The nice thing about a persistent filesystem is that it has a compounding effect. Every interaction that's logged, every briefing I run, every weekly review I complete provides more context for the next one. The system gets more useful over time because the filesystem grows. Most AI tools feel amnesiac, and this is a good way to solve that.

## It's never going to be perfect

The system is only as good as the data you feed it. The CRM, the meeting notes, the weekly reviews. If I don't keep those current, the whole thing degrades. It's the same rubbish in, rubbish out problem that you'd have before AI. You need to invest time in building that corpus of knowledge.

The way you build the persona also matters. I chose to have one that interrogated my plans and pushed back on ideas to ensure they're well considered. It might be that you prefer more of a coached approach or something more agreeable, but I wouldn't recommend that if you're looking for a system that can help hold you to account on things.

## Personal tools for personal things

ctOS is bespoke specifically to me. Built for how I work and what I care about. It's taken some time to hone the system to my needs, but building the foundations for it was relatively quick. I think this is the shift we're seeing in build vs buy tooling, and for products like this, building a solution exactly to your needs is now the default consideration rather than an exception to the rule.
