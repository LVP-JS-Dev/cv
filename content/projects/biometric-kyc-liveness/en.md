---
title: "Biometric KYC / Liveness Verification"
slug: "biometric-kyc-liveness"
role: "Senior Fullstack Developer"
period: "2024 -- 2025"
summary: "Built an iframe widget with cross-browser getUserMedia support and optimized real-time video streaming over WebSocket."
impact: "Latency 250ms -> 150ms - 95%+ success rate"
tech:
  - React
  - TypeScript
  - WebSocket
  - MediaStream
overview:
  - "Designed a secure in-app verification flow for high-volume onboarding."
  - "Embedded the experience via iframe to fit multiple partner products."
outcomes:
  - "Reduced streaming latency while improving verification completion."
  - "Raised success rate with clearer guidance and real-time feedback."
challenges:
  - "Cross-browser MediaStream support and permissions UX."
  - "Consistent video quality over variable network conditions."
stackNotes:
  - "Used WebSocket backpressure handling to stabilize streams."
  - "Added PostMessage bridge for host app integration."
industry: "Fintech identity"
anonymous: true
links:
  - label: "Case study (placeholder)"
    href: "#"
order: 1
---

## Context
High-volume onboarding needed a secure, embedded verification flow that could run across partner apps.

## What I built
- Iframe-based capture experience with permission UX and device checks
- Real-time guidance (lighting, positioning) and progress feedback
- WebSocket streaming tuned for jitter and backpressure

## Result
- Lower latency and more stable video delivery
- Higher completion and verification success
