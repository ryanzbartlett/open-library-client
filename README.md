# open-library-client

A TypeScript wrapper for the Open Library API using native fetch (Node 18+ and browsers).

## Installation

```bash
npm i @ryandotzone/open-library-client
```

## Usage

### Search for books

```ts
import { search } from "@ryandotzone/open-library-client";

const results = await search({ title: "The Lord of the Rings" });
console.log(results.docs[0].title);
console.log(`Found ${results.num_found} books`);
```

### Find a book by ISBN

```ts
import { findBookByIsbn } from "@ryandotzone/open-library-client";

const book = await findBookByIsbn("9780399155345");
console.log(book.title);
console.log(book.author_name);
```

## API Reference

### `search(params: Record<string, string>): Promise<SearchResult>`

Searches the Open Library catalog for books. See [Open Library API documentation](https://openlibrary.org/dev/docs/api/search) for available search parameters.

**Parameters:**
- `params` - Query parameters (e.g., `{ title: "book title", author: "author name" }`)

**Returns:**
- `SearchResult` - Object containing `docs` array and metadata

### `findBookByIsbn(isbn: string): Promise<Doc>`

Finds a book by its ISBN (10 or 13-digit).

**Parameters:**
- `isbn` - The ISBN string (numeric characters only)

**Returns:**
- `Doc` - First book matching the ISBN

**Throws:**
- Error if ISBN format is invalid

## TypeScript Support

This library includes full TypeScript definitions. The main types are:

- `SearchResult` - Response from search operations
- `Doc` - Individual book document
