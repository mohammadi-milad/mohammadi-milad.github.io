---
title: "SchemaGraphSQL: Efficient Schema Linking with Pathfinding Graph Algorithms for Text-to-SQL on Large-Scale Databases"
shortTitle: "SchemaGraphSQL"
description: "Combining lightweight language-model guidance with classical graph search to find the tables a SQL query needs."
date: "2026-03-24"
kind: "Research paper"
role: "Second author"
status: "Findings of EACL · 2026"
tags: ["Text-to-SQL", "Graph algorithms", "Efficient NLP"]
featured: true
diagram: "schema"
paper: "https://aclanthology.org/2026.findings-eacl.134/"
authors: "AmirHossein Safdarian, Milad Mohammadi, Ehsan Jahanbakhsh Bashirloo, Mona Shahamat Naderi, and Heshaam Faili"
abstractSource: "https://aclanthology.org/2026.findings-eacl.134/"
mainFigure:
  src: "/images/research/schemagraphsql.png"
  caption: "Figure 1: SchemaGraphSQL pipeline. Main flow (1–1): (i) build a table graph from foreign keys or, when FKs are missing, via LLM-based joinability discovery (Section 2); (ii) identify one source and one destination table with a single LLM call; (iii) find a shortest join path (Dijkstra-style) and pass only the filtered tables on that path to the SQL generator."
  alt: "SchemaGraphSQL overview: database tables and foreign keys become an undirected graph. A language model identifies source and destination tables from a question; shortest-path search finds the joining tables and produces a filtered schema."
  width: 1960
  height: 720
  source: "https://aclanthology.org/2026.findings-eacl.134.pdf"
---

## Abstract

Text-to-SQL systems translate natural language questions into executable SQL queries, and recent progress with large language models (LLMs) has driven substantial improvements in this task. Schema linking remains a critical component in Text-to-SQL systems, reducing prompt size for models with narrow context windows and sharpening model focus even when the entire schema fits. We present a zero-shot, training-free schema linking approach that first constructs a schema graph based on foreign key relations, then uses a single prompt to a lightweight LLM to extract source and destination tables from the user query, followed by applying classical path-finding algorithms and post-processing to identify the optimal sequence of tables and columns that should be joined, enabling the LLM to generate more accurate SQL queries. To handle real-world databases where foreign keys may be missing or inconsistent, we further propose an LLM-guided joinability discovery step that infers table connections before graph construction, ensuring robustness across diverse schemas. Despite being simple, cost-effective, and highly scalable, our method achieves state-of-the-art results on both the BIRD and Spider 2.0 benchmarks, outperforming previous specialized, fine-tuned, and complex multi-step LLM-based approaches.
