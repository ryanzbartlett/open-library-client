# open-library-client

A TypeScript wrapper for the Open Library API using native fetch (Node 18+ and
browsers).

## Installation

```bash
npm i @ryandotzone/open-library-client
```

## Usage

### Search for books

See
[Open Library API documentation](https://openlibrary.org/dev/docs/api/search)
for available search parameters.

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
