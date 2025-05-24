# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- **Build**: `npm run build` - Compiles TypeScript to dist/ directory
- **Lint**: `npm run lint` - Runs ESLint on TypeScript files
- **Test**: `npm run test` - Runs Jest test suite

## Architecture

This is a TypeScript library that provides a wrapper around the Open Library API. The library is designed for both Node.js (18+) and browser environments using native fetch.

### Core Structure

- **src/apiClient.ts**: Main API client with search functionality and ISBN validation
- **src/types.ts**: TypeScript interfaces for Open Library API responses
- **src/index.ts**: Public exports for the library

### Key Implementation Details

- Uses Zod for runtime validation (specifically ISBN format validation)
- All API calls go through the base URL `https://openlibrary.org`
- Search results return `SearchResult` interface containing `Doc[]` array
- ISBN validation enforces 10 or 13-digit numeric strings
- Library exports ES modules with TypeScript declarations

### Dependencies

- **Runtime**: No external dependencies (uses vanilla JavaScript validation)
- **Development**: Standard TypeScript/ESLint/Jest toolchain