# open-library-client

A TypeScript wrapper for the Open Library API using native fetch (Node 18+ and
browsers).

## Installation

```bash
npm install open-library-client
```

## Usage

```ts
import { getWorkByOLID } from "open-library-client";

async function main() {
    const work = await getWorkByOLID("OL45883W");
    console.log(work.title);
}

main();
```
