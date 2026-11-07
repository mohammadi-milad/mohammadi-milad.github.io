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
---

## The question

A natural-language question usually needs only a small part of a database. How can a Text-to-SQL system find that part without a specialized, fine-tuned schema linker?

## The approach

SchemaGraphSQL represents tables as graph nodes and foreign-key relationships as edges. A lightweight language model identifies source and destination tables; classical pathfinding recovers the connecting join paths. The resulting sub-schema goes to the SQL generator.

When foreign keys are absent or inconsistent, an LLM-guided discovery stage proposes joinable connections before graph construction. I am the second author of this collaborative work.

## What we observed

Experiments cover **BIRD development** and **Spider 2.0 Lite**. On BIRD, the force-union variant achieved **95.71% table recall** and an **F₆ score of 95.43%**.

With Gemini 2.5 Flash, BIRD execution accuracy was **62.91%**, compared with **51.50%** for the paper's no-schema-linking baseline. These are model- and benchmark-specific results. [Published paper, Tables 1–3](https://aclanthology.org/2026.findings-eacl.134.pdf).

## The tradeoff

Shortest paths can omit relevant tables on longer routes. Combining paths improves coverage but can include extra tables. The method requires no fine-tuning, while adding a linking call and input-token overhead.

## Publication

Published in **Findings of the Association for Computational Linguistics: EACL 2026**, pages 2585–2599.

## Citation

```bibtex
@inproceedings{safdarian-etal-2026-schemagraphsql,
  title={SchemaGraphSQL: Efficient Schema Linking with Pathfinding Graph Algorithms for Text-to-SQL on Large-Scale Databases},
  author={Safdarian, AmirHossein and Mohammadi, Milad and Bashirloo, Ehsan Jahanbakhsh and Naderi, Mona Shahamat and Faili, Heshaam},
  booktitle={Findings of the Association for Computational Linguistics: EACL 2026},
  year={2026},
  month=mar,
  pages={2585--2599},
  publisher={Association for Computational Linguistics},
  doi={10.18653/v1/2026.findings-eacl.134},
  url={https://aclanthology.org/2026.findings-eacl.134/}
}
```
