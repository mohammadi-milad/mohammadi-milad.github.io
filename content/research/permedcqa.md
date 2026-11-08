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
abstractSource: "https://arxiv.org/html/2505.18331v1"
mainFigure:
  src: "/images/research/permedcqa.png"
  caption: "Figure 1: Overview of PerMedCQA"
  alt: "PerMedCQA overview: source selection, preprocessing, privacy filtering, and annotation create 68,138 Persian medical question-answer pairs. Language models generate answers using translation, few-shot, or role-based prompting; MedJudge and human evaluation assess correctness, coverage, and clinical impact."
  width: 2044
  height: 596
  source: "https://arxiv.org/html/2505.18331v1/Overview.png"
---

## Abstract

Medical consumer question answering (CQA) is crucial for empowering patients by providing personalized and reliable health information. Despite recent advances in large language models (LLMs) for medical QA, consumer-oriented and multilingual resources—particularly in low-resource languages like Persian—remain sparse. To bridge this gap, we present PerMedCQA, the first Persian-language benchmark for evaluating LLMs on real-world, consumer-generated medical questions. Curated from a large medical QA forum, PerMedCQA contains 68,138 question-answer pairs, refined through careful data cleaning from an initial set of 87,780 raw entries. We evaluate several state-of-the-art multilingual and instruction-tuned LLMs, utilizing MedJudge, a novel rubric-based evaluation framework driven by an LLM grader, validated against expert human annotators. Our results highlight key challenges in multilingual medical QA and provide valuable insights for developing more accurate and context-aware medical assistance systems. The data is publicly available on https://huggingface.co/datasets/NaghmehAI/PerMedCQA
