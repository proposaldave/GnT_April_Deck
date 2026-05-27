# Codex Parallel Deck Workflow

## Edit Sessions

1. Use Worktree mode only.
2. Paste `prompts/CODEX_PARALLEL_DECK_TASK_PROMPT.txt`.
3. Dave adds only the desired edit at the bottom.
4. Codex creates an acceptance contract, finds the active live slide/section, edits only that target, and self-corrects once if verification fails.
5. The session creates `deck/[short-task-name]`, commits, and does not push.
6. The session reports `DONE` only after active-source verification and required rendered/visual verification pass.

## Active Source Contract

- Main-flow slides are active only when present in `SLIDE_ORDER`.
- Dot variants are active only when present in the correct `SLIDE_ALTS[slot]`.
- Staff slides are active only when present in `STAFF_ORDER`.
- If the visible requested target is not active, stop with `BLOCKED` and report the inactive slide ID instead of editing it.
- Red dots are alternate candidates for the same slot, not different slides.
- Codex owns verification. Dave should not have to inspect branches or identify failed edits manually.
- Visual/layout/copy-positioning/image/order edits require rendered evidence unless Dave explicitly approves source-only.
- If verification fails, Codex attempts one targeted correction, verifies again, then reports `BLOCKED` with the root cause.

## Publish Sessions

1. Use Local mode on `main`.
2. Paste `prompts/CODEX_DECK_PUBLISH_PROMPT.txt`.
3. Preserve unrelated dirty work before publishing.
4. Merge only verified safe `deck/*` branches.
5. Skip conflict, delete/trash/risky, and unverified inactive-variant branches.
6. Copy `GnR_deck.html` to `index.html`, verify hash identity, push if requested, then verify raw GitHub and Pages source.
7. Report exactly what is `MERGED AND LIVE`, `SKIPPED / NEEDS REVIEW`, `CONFLICTS`, and `NOT VERIFIED`.

## Dave Workflow

Normal edit:
New Codex chat -> GnR_Deck -> New worktree -> main -> No environment -> 5.5 Medium -> paste normal edit request.

Dave only provides the desired edit.
Codex must verify active rendered success or report `BLOCKED`.

Publish:
Deck Ops session -> Work locally -> main -> use publish prompt.
Publish merges only verified safe branches and reports exactly what went live.

Completed-session rule:
A solid status dot in the Codex app means the worktree session is done. Publish control should treat the matching `deck/*` branch as a publish candidate, not wait for Dave to name it again. Merge it if it is clean and active-source verified; otherwise skip it with the exact blocker.

Before declaring a publish pass done, run a completed-session audit: compare `git worktree list --porcelain`, local `deck/*` branches, merge status, branch commit messages, and current `main`. Publish every clean safe completed candidate found in that audit, and list every skipped candidate with its blocker.

Never run multiple Local edit sessions against `GnR_deck.html`.
Never edit the old `pitch_visuals` copy during parallel work.
Never push from parallel edit sessions.
