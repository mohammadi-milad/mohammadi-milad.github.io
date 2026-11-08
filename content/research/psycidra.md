---
title: "PsyCIDRA: A Dual-Agent Framework for Psychiatric Interviewing and Diagnostic Reasoning"
shortTitle: "PsyCIDRA"
description: "Separating clinical interviewing from diagnostic reasoning, with controlled simulation and a human feasibility study."
date: "2026-10-05"
kind: "Research preprint"
role: "First author"
status: "Preprint · under review"
homeStatus: "Under review"
tags: ["Language agents", "Human evaluation", "Digital mental health"]
featured: true
diagram: "psycidra"
paper: "https://arxiv.org/abs/2610.07473"
code: "https://github.com/PsyCIDRA/PsyCIDRA"
authors: "Milad Mohammadi, Fatemeh Akrami Shamsabadi, Zahra Mohseni, Amirhossein Safdarian, Malekfarhad Malek, Hadi Moradi, and Hesham Faili"
abstractSource: "https://arxiv.org/html/2610.07473v1"
mainFigure:
  src: "/images/research/psycidra.svg"
  caption: "Figure 1: PsyCIDRA and its evaluation. Simulated patients use PsyCPG-generated profiles. PsyDARA analyzes only PsyCIRA’s visible transcript. Case diagnoses and expert judgments provide simulation and human references, respectively; neither agent sees these references."
  alt: "PsyCIDRA workflow: simulated patients and human participants interact with the PsyCIRA interviewer, supported by working notes, skills, ICD-11 lookup, and safety tools. The transcript passes to PsyDARA for diagnostic reasoning, and experts assess interview quality and compare diagnostic reports."
  width: 452
  height: 295
  source: "https://arxiv.org/html/2610.07473v1/workflow.svg"
---

## Abstract

Large language models show promise in clinical reasoning, but psychiatric interviewing requires guiding an evolving conversation. Their ability to carry out this interactive assessment remains less studied. We present PsyCIDRA, a dual-agent framework linking free-form psychiatric interviewing with diagnostic reasoning for expert review. Its interviewer agent uses tools to maintain working notes, load expert-written skills, and retrieve ICD-11 references to guide inquiry. Its diagnostic reasoning agent then receives the completed interview transcript and reports hypotheses alongside supporting, conflicting, and missing evidence, withholding a final hypothesis when none is sufficiently supported. Using patient profiles generated with PsyCPG, we first evaluate PsyCIDRA in simulation. Across four models on 53 evaluation cases, it achieves higher diagnostic agreement than direct prompting. On 81 held-out simulated cases, rank-1 accuracy is 60.5% versus 51.9%. In a blinded study of 101 human participants in separate arms, PsyCIDRA agrees with psychologists on whether to propose a diagnostic hypothesis in 79.6% of cases, compared with 65.4% for direct prompting. Together, these findings support the potential of LLM agents to assist psychiatric assessment through free-form dialogue. By examining diagnostic reasoning, interview quality, and safety together, this study contributes to understanding the capabilities and limitations of psychiatric interview agents.
