---
title: "MedYar: A Medical Appointment Agent"
shortTitle: "MedYar"
description: "A 48-hour hackathon prototype for navigating doctor search and appointment booking through conversation."
kind: "Project"
role: "Co-developer · team of three"
status: "Hackathon prototype · Summer 2025"
tags: ["Language agents", "Web automation", "Healthcare access"]
featured: false
diagram: "agent"
code: "https://github.com/Medi-Yar/FindDoctor"
---

## From a request to an appointment

Finding an appointment involves several steps: understanding a user's needs, identifying an appropriate specialty, checking availability, and completing a booking flow.

In a **48-hour hackathon in Summer 2025**, the summer of my second master’s year, I worked in a team of three to prototype a conversational assistant for this process.

## The approach

MedYar uses a ReAct-style workflow to gather symptoms and preferences, suggest medical specialties, check availability, and interact with **Paziresh24** through web automation.

The [public repository](https://github.com/Medi-Yar/FindDoctor) separates agent logic from the appointment-platform interface, including tools for doctor discovery and reservation.

## My contribution

I co-developed the prototype as part of the hackathon team. The project brings together the practical issues of agent design: eliciting the information an action requires, coordinating tools, and grounding a conversational response in an external system.

## Scope

MedYar is an appointment-navigation prototype, not a validated diagnostic system. Its symptom collection supports specialty and booking workflows; it should not be interpreted as evidence of clinical effectiveness. Appointment-platform interfaces and availability can change, so the repository is best read as a record of the prototype.
