# Motion

The user's request is the brief. Build every motion they named. The notes below are recommendations for a request that left motion unspecified. They do not delete a named background, a second animation, or a looping scene.

| Situation | Motion |
| --- | --- |
| Press, hover on a fine pointer, open or close of an occasional overlay, success, error, empty-state invitation | Short feedback. `transform` and `opacity`, `ease-out`, under 300ms. Press uses a scale around `0.97`. |
| Keyboard shortcut, command palette, or any control used many times a day | No animation. |
| Keystrokes and focus moving between fields | No animation. |
| First screen, when the user asked for a page or a visual | Recommend one catalog effect (hero, background, or text), plus the other motion they named. A looping background is allowed. |
| `prefers-reduced-motion: reduce` | Keep color and opacity. Drop movement. |

A success moment may use one catalog success record or the single Lottie file from [license-gate.md](license-gate.md). A looping paragraph is a recommendation to skip, unless the user asked for it.

Closed motion lane: do not add animation, and do not install an effect.
