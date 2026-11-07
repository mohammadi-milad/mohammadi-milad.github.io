---
title: "Text-to-Insight: A Data Analyst Agent"
shortTitle: "Text-to-Insight"
description: "A course prototype that turns natural-language questions into database queries, Python analyses, plots, and reports."
kind: "Project"
role: "Co-developer · team of three"
status: "Large Language Models course · final project"
tags: ["Text-to-SQL", "Language agents", "Data analysis"]
featured: false
diagram: "schema"
code: "https://github.com/safdarian/llm-project"
---

## Beyond returning a query

A natural-language data question often needs more than SQL. After retrieving the right rows, an analyst may need to calculate a summary, visualize a pattern, and explain what the results mean.

For a Large Language Models course final project, I worked in a team of three to build an agent that connects these stages.

## The workflow

The prototype queries **BIRD databases in SQLite**, generates Python analyses and plots, and assembles a report from the original natural-language request. SQL correctness and report quality were evaluated with an LLM-as-judge framework.

This makes the project an exercise in coordinating multiple outputs: a query that runs, an analysis tied to its results, and a report grounded in the computation.

## My contribution

I co-developed the agent and its evaluation workflow. This project complements my research on [schema linking for Text-to-SQL](/research/schemagraphsql/) and my work designing agent-based teaching assignments.

## Scope

This is a course prototype, not a production analytics service. Automated evaluation is one source of evidence; a report judged fluent or plausible still requires checking against the query and underlying data. No benchmark performance claim is made here.
