# 🤝 HumanaEthica — volunteering platform (new features)

> **TL;DR:** HumanaEthica is a real, open-source web platform that connects charities with volunteers. In a team of 6, we added three new features to it: **volunteers can suggest activities**, **volunteers have a profile**, and **institutions have a profile**. Each feature goes from the database to the screen: Java/Spring Boot backend, Vue.js frontend, and automated tests at every level. My part was the **Institution Profile**. University project for *Software Engineering* at Instituto Superior Técnico.

---

## What is this, in plain words?

Charities (called *institutions*) publish volunteering **activities**; **volunteers** sign up, take part and give feedback. HumanaEthica is the website that manages all of this. It was created at IST/INESC-ID and is used as a teaching codebase.

In this course, we did what software engineers do in a company: we received a large existing codebase, read it, and **added new features without breaking anything**, using issues, branches, merge requests and code review.

## What we added

| Feature | What it does |
|---|---|
| **Activity Suggestion** | A volunteer can suggest a new activity to an institution. The institution's members see the list of suggestions. Rules enforced: description of at least 10 characters, no duplicate names from the same volunteer, sign-up deadline at least 7 days ahead. |
| **Volunteer Profile** | A volunteer can create a public profile with a short bio, automatic statistics (enrollments, participations, average rating) and a selection of their rated participations. |
| **Institution Profile** *(my part)* | A member of an institution can create a public profile for it with a short description, automatic statistics (members, activities, volunteers, average rating) and a selection of volunteer reviews. Rules enforced: description of at least 10 characters, at least 50% of the reviews shown and at least 20% of them among the most recent. Anyone, even without logging in, can see it. |

For each feature we implemented:

1. **Domain model** (Java entities + business rules/invariants).
2. **Service layer and REST API** (Spring Boot controllers, access control: only the right type of user can call each endpoint).
3. **Frontend** pages and dialogs (Vue.js + Vuetify, TypeScript).
4. **Tests:** unit tests and integration tests for the backend (Spock/Groovy) and end-to-end tests that click through the website (Cypress).

## Tech stack

Java 21 · Spring Boot · PostgreSQL · Vue.js 2 · Vuetify · TypeScript · Spock (Groovy) · Cypress · Docker

## How to run it

The easiest way is with Docker:

```bash
docker compose up
```

Detailed instructions (bare-metal install, database setup, running the tests) are in the original project README: [`UPSTREAM-README.md`](UPSTREAM-README.md).

## Where to look

```
backend/src/main/java/.../humanaethica/
  activitysuggestion/   # Activity Suggestion feature
  profile/              # Volunteer and Institution Profile features
backend/src/test/groovy/.../profile/   # Unit + integration tests for profiles
frontend/src/views/profile/            # Profile pages (Vue)
frontend/tests/e2e/specs/              # Cypress end-to-end tests
```

## Authors

Vasco Caetano and group colleagues, Instituto Superior Técnico.

## Credits and license

- **HumanaEthica** is developed by IST / INESC-ID and released under the **MIT License** (see [`LICENSE`](LICENSE)). The base code is theirs; this repository adds our coursework features on top of it.
- **Course:** Software Engineering (Engenharia de Software), Instituto Superior Técnico, University of Lisbon.
