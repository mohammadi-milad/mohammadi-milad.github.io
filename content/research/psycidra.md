---
title: "From Dialogue to Diagnostic Hypotheses: Evaluating LLM Agents for Psychiatric Assessment"
cvId: "psycidra"
description: "Evaluating how LLM agents conduct free-form psychiatric interviews and generate diagnostic hypotheses, using simulated patients and human participants."
date: "2026-10-05"
kind: "Research preprint"
role: "First author"
status: "Preprint · under review"
homeStatus: "Under review"
tags: ["Language agents", "Human evaluation", "Digital mental health"]
featured: true
diagram: "psycidra"
paper: "https://arxiv.org/abs/2610.07473v2"
code: "https://github.com/PsyCIDRA/PsyCIDRA"
authors: "Milad Mohammadi, Fatemeh Akrami Shamsabadi, Zahra Mohseni, Amirhossein Safdarian, Malekfarhad Malek, Hadi Moradi, and Hesham Faili"
abstractSource: "https://arxiv.org/html/2610.07473v2"
mainFigure:
  src: "/images/research/psycidra.svg"
  caption: "Figure 1: PsyCIDRA and its evaluation. Simulated patients use PsyCPG-generated profiles. PsyDARA analyzes only PsyCIRA’s visible transcript. Case diagnoses and reconciled expert transcript judgments provide simulation and human references, respectively; neither agent sees these references."
  alt: "PsyCIDRA workflow: simulated patients and human participants interact with the PsyCIRA interviewer, supported by working notes, skills, ICD-11 lookup, and safety tools. The transcript passes to PsyDARA for diagnostic reasoning, and experts assess interview quality and compare diagnostic reports."
  width: 452
  height: 295
  source: "https://arxiv.org/html/2610.07473v2/workflow.svg"
---

## Abstract

Although LLMs show promising diagnostic reasoning on supplied clinical evidence, their ability to elicit such evidence through free-form psychiatric interviews remains less understood. We evaluate interview quality and diagnostic hypotheses using simulated patients and human participants. For controlled simulation, we introduce PsyCPG, transforming clinical cases into structured patient profiles. On 30 paired cases, experts rate PsyCPG simulations higher in quality than raw-case role-play (4.50 versus 3.83/5). We introduce PsyCIDRA, a dual-agent framework: its interviewer agent uses a notepad tool, expert-written skills, and ICD-11 reference tools to guide interviews; its diagnostic agent analyzes the transcript and produces a report for expert review, ranking differential diagnoses with supporting, conflicting, and missing evidence. Across four models and 53 development cases, PsyCIDRA achieves higher observed diagnostic agreement than direct prompting. On 81 held-out simulated cases, exact-code rank-1 accuracy reaches 60.5% versus 51.9%. We conduct 101 interviews with human participants; two psychologists, blinded to interview condition and model reports, independently assess interview quality and transcript-supported hypotheses. In separate arms, PsyCIDRA agrees with experts on whether to issue a hypothesis in 79.6% of cases versus 65.4% for direct prompting. This study provides an empirical basis for understanding and evaluating LLM agents in free-form psychiatric interviewing.
