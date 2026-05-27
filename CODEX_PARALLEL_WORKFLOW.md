# Codex Parallel Deck Workflow

## Edit Sessions

1. Use Worktree mode only.
2. Paste `prompts/CODEX_PARALLEL_DECK_TASK_PROMPT.txt`.
3. Add one exact edit request at the bottom.
4. The session creates `deck/[short-task-name]`, edits only `GnR_deck.html` unless assets are explicitly required, commits, and does not push.
5. The session verifies the requested change in the active live source path before reporting `DONE`.

## Active Source Contract

- Main-flow slides are active only when present in `SLIDE_ORDER`.
- Dot variants are active only when present in the correct `SLIDE_ALTS[slot]`.
- Staff slides are active only when present in `STAFF_ORDER`.
- If the visible requested target is not active, stop with `BLOCKED` and report the inactive slide ID instead of editing it.
- Red dots are alternate candidates for the same slot, not different slides.

## Publish Sessions

1. Use Local mode on `main`.
2. Paste `prompts/CODEX_DECK_PUBLISH_PROMPT.txt`.
3. Preserve unrelated dirty work before publishing.
4. Merge only reviewed safe `deck/*` branches.
5. Copy `GnR_deck.html` to `index.html`, verify hash identity, push if requested, then verify raw GitHub and Pages source.

Never run multiple Local edit sessions against `GnR_deck.html`.
Never edit the old `pitch_visuals` copy during parallel work.
Never push from parallel edit sessions.
