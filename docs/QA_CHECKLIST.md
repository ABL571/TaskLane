# Manual QA checklist before submission

Run `npm install`, `npm run test`, `npm run typecheck`, and `npm run build`.
Then run `npm run dev` and verify the **actual browser experience**:

| Test | Steps | Expected result |
|---|---|---|
| Sidebar navigation | Switch sidebar pages on desktop, collapse/expand, open mobile drawer | Navigation remains usable and board layout intact |
| Invalid login | Enter fake credentials | Helpful error; no dashboard access |
| Demo login | `emilys` / `emilyspass` | Redirect to dashboard |
| Protected route | Sign out, manually open `/dashboard` | Redirect to `/login` |
| Refresh session | Log in and press F5 | Auth state restored after `/auth/me` |
| Create | Create an issue with all required fields | New card in selected column |
| Required fields | Leave title/description/date empty | Form validation blocks save |
| Edit | Open a card; change fields/status | Card and statistics update |
| Delete | Delete a task, cancel first, then confirm | Cancel retains card; confirm removes it |
| Drag between columns | Drag by grip from To Do to In Progress | Status immediately changes |
| Sort in column | Drag a card above/below another | Order updates and stays after refresh |
| Drop into empty column | Drag into column with zero cards | Task appears in target column |
| Combined filters | Search title plus priority, assignee, status, due date | Only matching cards shown |
| No results | Filter for impossible combination | Clear empty message |
| Data persistence | Create/drag/edit; refresh page | Changes remain in localStorage |
| Account separation | Log out; log in as another valid DummyJSON user | Different user task storage key |
| Assignee on cards | Open the board with assigned and unassigned tasks | Task cards show assignee name and avatar |
| Browser widths | Use responsive mode: desktop, tablet, phone | Header/modal fit and board scrolls |
| Keyboard | Navigate with Tab; use drag handle with keyboard | Interactive controls receive focus |
| API network failure | Disconnect network before login | User-friendly network message |
| Screenshots | Capture Login, Dashboard summary, Active sprint board | Three images ready for submission |

The automated `npm run test` covers pure logic and repository handling;
**it does not replace browser integration tests**. The code provided here was
syntax/import/domain-tested without a full npm install in the authoring runtime.
