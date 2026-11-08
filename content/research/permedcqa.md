---
title: "PerMedCQA: Benchmarking Large Language Models on Medical Consumer Question Answering in Persian Language"
shortTitle: "PerMedCQA"
description: "A Persian medical question-answering benchmark and rubric-based evaluation of language-model responses."
date: "2025-05-23"
kind: "Research preprint"
role: "Second author"
status: "Preprint"
tags: ["Persian NLP", "Medical QA", "Evaluation"]
featured: false
diagram: "medical"
paper: "https://arxiv.org/abs/2505.18331"
authors: "Naghmeh Jamali, Milad Mohammadi, Danial Baledi, Zahra Rezvani, and Hesham Faili"
---

## The question

Medical question-answering systems need evaluation that reflects the language and questions of their users. Persian consumer questions provide a different setting from English medical examination benchmarks.

## The benchmark

PerMedCQA curates **68,138 question–answer pairs** from a medical question-answering forum, following cleaning of **87,780 raw entries**. The questions originate from consumers rather than standardized examinations.

The work evaluates multilingual and instruction-tuned language models. It introduces **MedJudge**, a rubric-based LLM evaluation framework checked against expert human annotations. I am the paper's second author.

## Why this evaluation matters

Consumer questions combine medical information needs with everyday language and context. Evaluating responses in Persian helps expose gaps that an English-only benchmark can miss.

The [preprint and linked dataset](https://arxiv.org/abs/2505.18331) provide the full benchmark description and experimental findings.

## Scope and status

This is a **2025 arXiv preprint**. Benchmark performance concerns the quality of generated answers; it does not demonstrate clinical effectiveness or authorize autonomous medical advice. An automated judge also needs scrutiny for agreement and disagreement with human experts.

## Citation

```bibtex
@misc{jamali2025permedcqa,
  title={PerMedCQA: Benchmarking Large Language Models on Medical Consumer Question Answering in Persian Language},
  author={Jamali, Naghmeh and Mohammadi, Milad and Baledi, Danial and Rezvani, Zahra and Faili, Hesham},
  year={2025},
  eprint={2505.18331},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2505.18331}
}
```
