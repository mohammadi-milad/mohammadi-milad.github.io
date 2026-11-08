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
code: "https://github.com/mohammadi-milad-mim/Emotion-Detection-using-LLM-RolePlay"
authors: "Amirhossein Safdarian*, Milad Mohammadi*, and Heshaam Faili · * Equal contribution"
abstractSource: "https://aclanthology.org/2025.semeval-1.283/"
mainFigure:
  src: "/images/research/emotion-recognition.jpg"
  caption: "Figure 1: Brief overview of our system"
  alt: "Two-stage emotion recognition with GPT-4o mini: role-play rewriting creates anger, disgust, fear, joy, sadness, and surprise versions of an input sentence. Contrastive judging compares the rewrites with the original and supplies reasoning and an intensity score for each emotion."
  width: 1435
  height: 917
  source: "https://aclanthology.org/2025.semeval-1.283.pdf"
---

## Abstract

Emotion recognition in text is crucial in natural language processing but challenging in multilingual settings due to varying cultural and linguistic cues. In this study, we assess the zero-shot capability of GPT-4o Mini, a cost-efficient small-scale LLM, for multilingual emotion detection. Since small LLMs tend to perform better with task decomposition, we introduce a two-step approach: (1) Role-Play Rewriting, where the model minimally rewrites the input sentence to reflect different emotional tones, and (2) Contrastive Judging, where the original sentence is compared against these rewrites to determine the most suitable emotion label. Our approach requires no labeled data for fine-tuning or few-shot in-context learning, enabling a plug-and-play solution that can seamlessly integrate with any LLM. Results show promising performance, particularly in low-resource languages, though with a performance gap between high- and low-resource settings. These findings highlight how task decomposition techniques can enhance small LLMs’ zero-shot capabilities for real-world, data-scarce scenarios.
