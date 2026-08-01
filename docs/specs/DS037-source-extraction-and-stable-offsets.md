---
id: DS037
title: Source Extraction, Adapters, and Stable Decoded Offsets
status: implemented
owner: nll-longtext
summary: Defines deterministic UTF-8 and PDF ingestion plus task-local extractor extension contracts.
---

# DS037 — Source Extraction, Adapters, and Stable Decoded Offsets

## Introduction

Source provenance begins before LongTextJS: bytes must be decoded into stable text before claims can reference exact offsets. This contract is orthogonal to the semantic DSLs and applies to every agent and task.

## Core Content

`framework/tools/source-extractors.mjs` is the extraction boundary. UTF-8 text, Markdown, CNL, CSV, and HTML use the built-in UTF-8 extractor. PDF input uses the dependency-free PDF text extractor, which validates the header, rejects encrypted documents, decodes unfiltered or Flate-compressed content streams, interprets literal and hexadecimal text operands, and records extractor and page metadata. Decoded text—not binary byte position—is the canonical coordinate space used by `SourceUnit` and `SourceSpan`.

A task may override or add a format through `source/extractors/<extension>.extractor.mjs`. The module exports `default` or `extractSource`, receives an immutable object containing path, extension, bytes, and task root, and returns a text string or `{ text, metadata }`. The ingestion tool validates this result, segments it deterministically, hashes the entire decoded text, and generates executable `source-map.mjs` with stable offsets and metadata.

Extraction failure must never fabricate text. Unsupported formats, invalid modules, encryption, unsupported PDF encodings, and decoding failures produce typed source diagnostics. Scanned PDFs require a task-local OCR/extractor adapter because Node.js built-ins cannot infer glyphs from images. Source IDs remain deterministic under a lexically sorted source-file list.

## Decisions & Questions

### Question #1: Why are PDF offsets based on extracted text rather than file bytes?

Response: PDF text is stored through drawing operators, compression, and font encodings, so a human-visible phrase generally has no contiguous byte interval. Provenance remains replayable by retaining the source digest, extractor identity, decoded text digest, source unit, and decoded interval.

### Question #2: Why may a task-local extractor override a built-in?

Response: Specialized documents may require a known font map, OCR capture, or domain decoder. The explicit task-owned module makes that choice reviewable and reproducible while preserving the common ingestion contract.

## Conclusion

Every accepted source produces deterministic decoded text and verifiable semantic spans, while unsupported decoding remains a visible diagnostic rather than an implicit loss of evidence.
