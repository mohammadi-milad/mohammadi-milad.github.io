---
title: "UT-NLP at SemEval-2025 Task 11: Evaluating Zero-Shot Capability of GPT-4o mini on Emotion Recognition via Role-Play and Contrastive Judging"
shortTitle: "Emotion recognition through contrast"
description: "Testing a two-stage prompting approach to multilingual emotion recognition without task-specific training."
date: "2025-07-31"
kind: "Research paper"
role: "Co-first author"
status: "SemEval · 2025"
tags: ["Emotion recognition", "Multilingual NLP", "Zero-shot learning"]
featured: false
diagram: "emotion"
paper: "https://aclanthology.org/2025.semeval-1.283/"
authors: "Amirhossein Safdarian*, Milad Mohammadi*, and Heshaam Faili · * Equal contribution"
---

## The question

Can a small language model recognize emotional nuances across languages by comparing an utterance with alternative versions of itself?

## The approach

For SemEval-2025 Task 11, we tested GPT-4o mini using two prompting stages. **Role-play rewriting** makes small changes to express a target emotion. **Contrastive judging** compares these variants with the original text to predict an emotion label or intensity.

The pipeline uses neither task-specific fine-tuning nor labeled in-context examples. I contributed as a co-first author; the [published PDF](https://aclanthology.org/2025.semeval-1.283.pdf) explicitly records equal contribution and randomized author order.

## What we observed

Results were around the shared-task baseline, with substantial differences across languages. In Track C, macro-F1 ranged from **0.5598 for English** to **0.1894 for isiZulu**. In Track B, average Pearson correlation was **0.5693 for English**. These are distinct tasks and metrics, not a single overall accuracy score.

## What remains open

Rewrites can introduce or erase emotional cues, making the judging stage unreliable. The work motivates more systematic ablations of rewriting and judging, and stronger evaluation across languages and emotion categories. It does not establish state-of-the-art shared-task performance.

## Citation

```bibtex
@inproceedings{safdarian-etal-2025-ut,
  title={UT-NLP at SemEval-2025 Task 11: Evaluating Zero-Shot Capability of GPT-4o mini on Emotion Recognition via Role-Play and Contrastive Judging},
  author={Safdarian, Amirhossein and Mohammadi, Milad and Faili, Heshaam},
  booktitle={Proceedings of the 19th International Workshop on Semantic Evaluation (SemEval-2025)},
  year={2025},
  month=jul,
  pages={2183--2189},
  address={Vienna, Austria},
  publisher={Association for Computational Linguistics},
  url={https://aclanthology.org/2025.semeval-1.283/}
}
```
