---
title: "NanoSparseRetriever: Building Retrieval from First Principles"
shortTitle: "NanoSparseRetriever"
description: "A compact Python assignment for understanding inverted indexes, TF-IDF, and BM25 by implementing them."
kind: "Teaching project"
role: "Assignment designer & teaching assistant"
status: "University of Tehran · Information retrieval course"
tags: ["Information retrieval", "Teaching", "Python"]
featured: true
diagram: "retrieval"
code: "https://github.com/mohammadi-milad-mim/NanoSparseRetriever"
---

## Making retrieval understandable

Sparse retrieval remains useful both as a practical baseline and as a way to understand how a search engine ranks documents. NanoSparseRetriever is a small educational Python project I designed for the University of Tehran's Intelligent Information Retrieval course in Fall 2024.

Instead of treating retrieval as a single library call, the assignment separates the steps that students need to understand and inspect.

## From documents to ranked results

The repository organizes the work into document processing, an inverted index, query processing, retrieval models, and evaluation. Students implement **TF-IDF** and **BM25**, then examine how scoring and parameter choices change the ranking.

This modular structure supports focused experiments: keep the corpus and queries fixed while changing a scoring choice, inspect the output, and compare retrieval quality.

## My contribution

I designed the assignment and its from-scratch retrieval workflow as a teaching assistant. My related workshop introduced API-based language models and RAG pipelines using LanceDB and open-source dense retrievers.

## Explore

[Read the code and assignment notebook](https://github.com/mohammadi-milad-mim/NanoSparseRetriever) or [watch the retrieval workshop](https://www.youtube.com/watch?v=ubnmFJ5Huhc).

The project is intentionally educational. It provides a small, inspectable foundation for studying retrieval, rather than a production search platform or a claimed benchmark improvement.
