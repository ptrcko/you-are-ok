# Tool module pattern (Step 3)

Each tool lives in its own folder under `assets/js/tools/` and has a single entry page in `tools/<tool>/`.

Minimum structure per tool:
- `index.js` — entry point that runs setup for the page
- `controller.js` — wires events to data operations
- `ui.js` — renders DOM elements only; no storage calls
- `data.js` — parses user input, enforces the tool's schema, and uses the shared storage module

To add a new tool:
1. Duplicate an existing tool folder under `assets/js/tools/`.
2. Rename the folder and update the entry page in `tools/<tool>/` to point at the new `index.js`.
3. Adjust `data.js` to reference the correct entry type and schema.
4. Keep all persistence behind the shared `assets/js/storage.js` helpers; do not mutate other entry types.
