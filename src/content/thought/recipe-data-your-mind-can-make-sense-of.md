---
title: "Recipe data your mind can make sense of"
description: "Long recipes are hard to decipher and hold in your head. I've added recipe tables to every recipe on my cooking site to show the path to the finished piece."
pubDate: "12 Aug 2026 15:57:58"
---
I've been publishing recipes at [joshnesbitt.cooking](https://joshnesbitt.cooking) for a while, and for some time I've been dissatisfied by how hard it can be to hold complex recipes together. The ingredients sit at the top, the method sits below, and the relationships between them live entirely in your head. Halfway through cooking you end up scrolling back to work out which bowl the zest went into and whether the butter should already be brown.

Some people are happy following a recipe top to bottom. I want to see the whole picture at a glance before I start: which ingredients combine, in what order, and what they produce. Visualising the data serves people who think that way.

## Recipe tables

The idea comes from [RecipeTables](https://recipetables.com/), built by Juan Buis. It converts any recipe into a single table: ingredients as rows, steps as merged columns. Juan's tagline is "less scrolling, more cooking", which sums it up nicely.

[Every recipe](https://joshnesbitt.cooking/aioli/) on the cooking site now has one. The table explains the dish visually before you dig into the step content. Ingredients go in on the left, the finished dish comes out on the right, and reading across shows you the whole process as a flow.

## How it works

The data structure is a recursive tree. A node is either an ingredient (a string, a leaf) or an action that combines its children:

```ts
type TableNode = string | { action: string; from: TableNode[] };
```

The whole recipe is one root node whose output is the dish. Here's the [martini](https://joshnesbitt.cooking/martini/):

```yaml
action: express the twist over the top and drop it in
from:
  - action: stir over ice for 30 seconds, strain into a chilled coupe
    from:
      - 60ml freezer-cold dry gin
      - 10ml dry vermouth
  - action: cut a strip of peel, trim the pith
    from:
      - 1 lemon
```

Rendering the tree is fun. The [Astro component](https://github.com/joshnesbitt/cooking/blob/main/src/components/RecipeTable.astro) is around 80 lines of tree walking. `leafCount` counts the ingredients under a node. `colOf` places ingredients in column 0 and each action one column to the right of its deepest child, so later steps drift towards the right edge of the table. `walk` then flattens the tree into cells: an action's rowspan is its leaf count, so it spans every ingredient it consumes, and each cell's colspan stretches right up to its parent's column, which keeps the table rectangular.

The output is a plain HTML `<table>` with rowspan and colspan merges. No JavaScript at runtime, just markup.

## The housekeeping problem

Building the component was the fun part, but maintaining the data structures manually would have been a nightmare. Before AI, I probably wouldn't have added this feature at all: the tree has to be defined alongside the post content, and keeping a parallel YAML structure in sync with a recipe wouldn't be worth it. Every edit to the method means a second edit to the data.

AI helps create the structured data from the steps. It can read the recipe and extract the YAML tree straight from the prose, so adding a table to a post takes a couple of minutes rather than a fiddly modelling exercise.

## Alternative uses

It works for anything with inputs and sequential steps (such as a deployment runbook). Have a play around with the YAML structure to see what other processes you can visualise. Let me know if you find any other fun uses for it!
