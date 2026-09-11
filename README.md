# Playwright QA Automation Portfolio

A production-style QA automation framework built with Playwright and TypeScript, covering UI, API, database, end-to-end testing, authentication, and CI/CD.

This project demonstrates a practical, maintainable approach to test automation for modern web applications.

## Project Overview

This project demonstrates a complete QA automation framework for a web-based admin portal.

The framework includes:

- UI automation
- API automation
- Database validation
- End-to-end testing
- Authentication and authorization
- Positive and negative test scenarios
- CI/CD execution using GitHub Actions

## Technology Stack

- Playwright
- TypeScript
- Node.js
- PostgreSQL
- Docker
- GitHub Actions

## Test Coverage

### UI Testing

- Login and authentication
- User management
- Project management
- Create, update and delete operations
- Search
- Pagination
- Form validation
- Negative scenarios

### API Testing

- Authentication
- User APIs
- Project APIs
- CRUD operations
- Validation and negative scenarios
- Search and pagination
- Authorization

### Database Testing

- PostgreSQL database validation
- Data persistence verification
- Backend data validation

### End-to-End Testing

- API to UI validation
- User workflows
- Project workflows
- Cross-layer validation

## Framework Structure

```text
qa-playwright-portfolio/
├── api/              # Reusable API clients
├── config/           # Test configuration
├── fixtures/         # Custom Playwright fixtures
├── pages/            # Page Object Model
├── tests/
│   ├── api/          # API tests
│   ├── db/           # Database tests
│   ├── e2e/          # End-to-end tests
│   └── ui/           # UI tests
├── utils/            # Reusable utilities
├── .github/
│   └── workflows/    # GitHub Actions CI/CD
├── playwright.config.ts
├── package.json
└── README.md
```

## CI/CD

The automation framework is integrated with GitHub Actions.

The CI pipeline:

1. Checks out the automation framework
2. Checks out the application under test
3. Installs dependencies
4. Installs Playwright browsers
5. Starts the application environment using Docker Compose
6. Runs the Playwright test suite
7. Publishes the Playwright test report

This allows the automation suite to run automatically in a clean CI environment.

## QA Approach

The test suite is designed to cover both functional behavior and common failure scenarios.

Testing includes:

- Positive scenarios
- Negative scenarios
- Validation scenarios
- Boundary scenarios
- Authentication and authorization
- CRUD operations
- Search and pagination
- Data validation
- End-to-end workflows

## Running Tests

### Install dependencies

```bash
npm ci

Install Playwright browsers
npx playwright install

Run all tests
npx playwright test

Run UI tests
npx playwright test tests/ui

Run API tests
npx playwright test tests/api

Run database tests
npx playwright test tests/db

Run E2E tests
npx playwright test tests/e2e

Open the Playwright report
npx playwright show-report
```

## Application Under Test

The application used for this portfolio is an external sample admin portal used as the **System Under Test (SUT)**.

The automation framework in this repository was designed and implemented by me, including:

- Test cases
- Page Objects
- API clients
- Fixtures
- Authentication setup
- Database utilities
- End-to-end scenarios
- Playwright configuration
- CI/CD workflow

## Project Status

This project is actively evolving as I continue improving the automation framework and adding more real-world QA scenarios.

Planned improvements include:

- Expanding UI, API, database, and E2E coverage
- Improving test data and reusable fixtures
- Adding additional automation best practices
- Improving CI/CD execution and reporting
- Continuously refactoring the framework for maintainability

## About Me

**Nitesh Sharma**  
QA Engineer / QA Consultant

Focused on:

- Functional & Manual Testing
- API Testing
- Playwright Automation
- TypeScript
- End-to-End Testing
- CI/CD
- Quality Engineering
