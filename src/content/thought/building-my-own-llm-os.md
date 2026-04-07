---
title: "Building my own LLM OS"
description: "I've been running my own LLM-based operating system for months. Then Karpathy started talking about the same idea. Here's what I've built and what I've learned."
pubDate: "07 Apr 2026 12:00:00"
---

I've been running my own LLM-based operating system for a few months now. I built it out of necessity, not theory. Then Karpathy started talking publicly about the same idea, the LLM as kernel, orchestrating tools, memory, I/O across modalities, and I realised I'd already been living it.

I'm a CTO. My days are context switching. Meeting prep, stakeholder management, strategic planning, team comms, competitive intelligence, newsletters. The cognitive overhead of keeping all those threads alive is the bottleneck, not the work itself.

I didn't wait for someone to build this for me. I built it myself. I've been calling it ctOS, a Chief Technology Operating System.

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

ctOS is a personal operating system built on top of Claude Code. The LLM is the kernel. Everything else, calendar, email, Slack, CRM, meeting notes, plugs in as peripherals through MCP servers.

The interface is the terminal. No app, no dashboard. I type commands and the system does the rest.

The architecture has three layers.

A system prompt that defines my operating context, preferences, and the persona of the system. An opinionated operator. It pushes back, flags risks, holds me accountable against the executive competencies my CEO evaluates me on.

A skill layer. Slash commands that handle recurring CTO workflows. `/daily-briefing` pulls my calendar, email, Slack, and tasks into a single morning brief. `/meeting-brief` preps me for any upcoming meeting with stakeholder context and recommended positions. `/eod` wraps my day and logs commitments. `/weekly-review` synthesises the week. `/research` does deep dives and persists findings. About fifteen of these, each built for a specific part of my rhythm.

A persistent filesystem that acts as long term memory. Stakeholder CRM with interaction logs and relationship health tracking. Meeting briefs and follow ups. Strategic plans. Weekly snapshots. Newsletter digests. The filesystem is the source of truth. Conversation context is ephemeral. The filesystem persists.

## Why it works

Karpathy's framing, when it arrived, validated something I'd already figured out by using the thing daily: the value is in the orchestration. My daily briefing pulls from four different systems, cross references them against my stakeholder CRM, and surfaces what actually matters.

The persistent filesystem solves the memory problem. Most AI tools feel amnesiac. When I prep for a 1:1 with a direct report, the system reads their stakeholder file, surfaces open loops from our last conversation, checks for cold relationships, and suggests a question I should be asking. It has that context because I've been disciplined about writing back to the filesystem after every interaction.

The skill layer means I'm not prompt engineering on the fly. Each workflow is codified. The system knows how I want a CEO update structured, how I want meeting briefs formatted, what my writing voice sounds like.

## What I've learned

The system is only as good as the data you feed it. The CRM, the meeting notes, the weekly reviews. If I don't keep those current, the whole thing degrades. Same garbage in, garbage out problem as anything else. The discipline of maintaining the filesystem is the real investment.

The persona matters more than I expected. Defining the system as an opinionated operator that challenges my assumptions and flags risks changed the dynamic completely. It does what I need, which is sometimes different from what I ask for.

Terminal first is the right call. No switching between apps. No visual noise. Just me and the system, working through the day.

## The bigger picture

Karpathy talks about the LLM OS making traditional apps obsolete. I think he's right. But the theory is catching up to what practitioners have already been doing. The path forward runs through individuals building systems like this for their own workflows, discovering what works, and sharing patterns.

ctOS is bespoke. Built for how I work, what I care about, and the operational load of being a CTO at a growing company. That's the point. I didn't need a keynote to tell me this was possible. I needed a problem to solve, and the tools were already there. The LLM OS is a practice.
