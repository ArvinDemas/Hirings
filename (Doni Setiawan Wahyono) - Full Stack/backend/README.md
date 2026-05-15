# Hirings Backend

Express REST API for the Hirings capstone project.

## Auth Endpoints

Base URL: `/api/v1`

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Successful register and login responses return a JWT token and sanitized user object.

## Onboarding Endpoints

All onboarding endpoints require `Authorization: Bearer <token>`.

- `GET /onboarding/me`
- `POST /onboarding/cv-uploads` with multipart field `cv` (`.pdf` or `.docx`, max 5MB)
- `POST /onboarding/manual-skills`
- `PATCH /onboarding/skills`
- `POST /onboarding/confirm`
- `DELETE /onboarding/skills/:skillId`

The CV upload endpoint proxies the file to the external FastAPI AI service configured with
`AI_SERVICE_BASE_URL` and `AI_SERVICE_PARSE_CV_PATH`. If the AI service is unavailable, the upload
still returns a controlled `202` response with `ai.status = "failed"` so the frontend can fall back
to manual skill input.

## Skill Suggestion Endpoints

All skill suggestion endpoints require `Authorization: Bearer <token>`.

- `GET /skills/search?q=pyt&limit=10`
- `GET /skills/search?q=git&limit=10`

This endpoint uses a local curated skill catalog so onboarding can support autocomplete before the
external AI service or a full taxonomy integration is ready.

## Skill Gap Endpoints

All skill gap endpoints require `Authorization: Bearer <token>`.

- `GET /skill-gap/targets`
- `POST /skill-gap/analyses`
- `GET /skill-gap/analyses/latest`

Example analysis body:

```json
{
  "roleId": "data-analyst",
  "industryId": "technology",
  "levelId": "entry"
}
```

The response is shaped for the Skill Gap Analyzer UI: radar chart values, owned skills, missing
skills with priority, overall match score, estimated close-gap duration, and course recommendations.

## Career Recommendation Endpoints

All career recommendation endpoints require `Authorization: Bearer <token>`.

- `GET /career-recommendations/filters`
- `GET /career-recommendations/latest`
- `GET /career-recommendations/latest?industryId=technology&sortBy=highest-match`
- `POST /career-recommendations/generate`
- `POST /career-recommendations/saved`
- `DELETE /career-recommendations/saved/:careerId`

Example generate body:

```json
{
  "industryId": "technology",
  "sortBy": "highest-match"
}
```

The response is shaped for the Career Recommender UI: recommendation summary, career cards,
salary ranges, match percentages, readiness estimates, roadmap steps, course recommendations, and
saved career state.
