---
title: "PsyCIDRA: A Dual-Agent Framework for Psychiatric Interviewing and Diagnostic Reasoning"
shortTitle: "PsyCIDRA"
description: "Separating clinical interviewing from diagnostic reasoning, with controlled simulation and a human feasibility study."
date: "2026-10-05"
kind: "Research preprint"
role: "First author"
status: "Preprint · arXiv 2026"
tags: ["Language agents", "Human evaluation", "Digital mental health"]
featured: true
diagram: "psycidra"
paper: "https://arxiv.org/abs/2610.07473"
code: "https://github.com/PsyCIDRA/PsyCIDRA"
authors: "Milad Mohammadi, Fatemeh Akrami Shamsabadi, Zahra Mohseni, Amirhossein Safdarian, Malekfarhad Malek, Hadi Moradi, and Hesham Faili"
---

## The question

Can language agents gather useful psychiatric evidence through conversation and organize it for expert review? This first-author work grew out of my M.Sc. thesis at the University of Tehran.

## The approach

PsyCIDRA separates two jobs. An interviewer maintains notes, consults expert-written skills, and retrieves ICD-11 references. A second agent reviews the completed transcript, distinguishing evidence that supports, contradicts, or leaves gaps in a diagnostic hypothesis. It can withhold a hypothesis when evidence is insufficient.

PsyCPG generates configurable patient profiles for controlled experiments. Evaluation then moves from simulation to a blinded feasibility study with human volunteers.

## What we observed

On **81 held-out simulated profiles**, exact-code rank-1 accuracy was **60.5%**, compared with **51.9%** for direct prompting.

In a separate study of **101 adult volunteers**, agreement with psychologists on whether the transcript supported proposing a diagnostic hypothesis was **79.6%** versus **65.4%**. The arms contained 49 and 52 volunteers, respectively.

These measure different outcomes and should be read separately. [Methods and results](https://arxiv.org/html/2610.07473v1).

## How to interpret it

This is a **preprint and feasibility study**, not evidence of clinical benefit. Volunteers were not a representative patient cohort; simulated profiles do not establish fidelity to real individuals. The system is intended for expert review.

## Citation

```bibtex
@misc{mohammadi2026psycidra,
  title={PsyCIDRA: A Dual-Agent Framework for Psychiatric Interviewing and Diagnostic Reasoning},
  author={Mohammadi, Milad and Akrami Shamsabadi, Fatemeh and Mohseni, Zahra and Safdarian, Amirhossein and Malek, Malekfarhad and Moradi, Hadi and Faili, Hesham},
  year={2026},
  eprint={2610.07473},
  archivePrefix={arXiv},
  primaryClass={cs.AI},
  url={https://arxiv.org/abs/2610.07473}
}
```
