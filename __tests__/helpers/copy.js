// Shared helpers for the tests that read copy out of source files.
//
// Every copy guard in this repo has the same shape: read a .js or .jsx file,
// throw away the parts a visitor never sees, then assert on what is left. The
// throwing-away step is the part that quietly breaks, so it lives here once.

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Remove comments from JS/JSX source, leaving string and template contents
 * alone.
 *
 * This walks the source character by character rather than running two regex
 * passes, because the two-regex version had a hole big enough to blind an
 * entire guard. It stripped block comments FIRST, so this real line in
 * lib/learn/registry.js:
 *
 *     // components/learn/content/*.jsx (hand-JSX, matching the site's ...
 *
 * opened a block comment inside a line comment. The stripper then ate
 * everything up to the next star-slash, 1300 lines later: 93,817 bytes of
 * registry became 3,457. The fifteen-year guard in
 * __tests__/chrome/site-chrome.test.jsx ran over that file and saw almost none
 * of it, and reported clean. Its own header warns that a check returning zero
 * because of its own flags is worse than no check. That is what it had become.
 *
 * Known limit: a regex literal containing a double slash (/\/\//) reads as the
 * start of a line comment, so the rest of that one line is dropped. It costs
 * coverage on a single line rather than on a file, and copy modules do not
 * carry regexes. Strings are tracked, so "https://..." survives.
 */
export function stripComments(src) {
  let out = "";
  let quote = null;
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1];
    if (quote) {
      if (c === "\\") {
        out += c + (next ?? "");
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      out += c;
      i += 1;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      out += c;
      i += 1;
      continue;
    }
    if (c === "/" && next === "/") {
      while (i < src.length && src[i] !== "\n") i += 1;
      continue;
    }
    if (c === "/" && next === "*") {
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i += 1;
      i += 2;
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
}

/** Every .js and .jsx file under `dir`, recursively, as absolute paths. */
export function sourceFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (/\.jsx?$/.test(entry)) out.push(full);
  }
  return out;
}
