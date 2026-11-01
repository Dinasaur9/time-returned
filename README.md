# Time Returned

A charity: water inspired student game by Dina Seoudi, built with HTML, CSS, and vanilla JavaScript. AI assisted with implementation and visual iteration.

Live game: https://dinasaur9.github.io/time-returned/

Help Obi gather supplies, build a rain barrel, water filter, and community well, and give time back for school. Obi is fictional; timings, upgrades, and rewards are symbolic. Playing does not create a real donation.

## How to play

Collect rope, coins, and water (+1 supply). Avoid mud (−2 supplies, never below zero). Build upgrades in order: rain barrel (8), filter (12), and community well (20). Each build reduces the daily water walk from 3 to 2 to 1 to 0 hours. You can buy during a walk or after the daily arrival summary, including the last day. Build the well to win; on the final day, Finish journey ends an unfinished attempt.

| Difficulty | Days available | Seconds per day | Item refresh | Mud puddles per batch |
| --- | --- | --- | --- | --- |
| Easy | 10 | 25 | 5 seconds | 1 |
| Normal | 10 | 20 | 3.5 seconds | 1 |
| Hard | 5 | 15 | 2.5 seconds | 2 |

Each batch contains six good supplies. Choose your pace before starting. Restart returns to the difficulty choices. Play again replays the same mode. Pause freezes the timer and collection; leaving the tab automatically pauses an active round. Use Tab and Enter to play with a keyboard.

## Project 6 features

- Difficulty presets change the pace, day limit, and obstacles.
- Collected items are removed from the DOM; supplies, upgrades, and progress update immediately.
- Links to charity: water and its donation page appear in the header, footer, and ending screen.
- Typography uses Proxima Nova or Avenir when installed, with the similar geometric sans-serif DM Sans as a web fallback. The brand book identifies Proxima Nova and Avenir: https://www.charitywater.org/about/media (Typography, p. 19).
- Sound LevelUp: downloaded audio files play on collection, mud, building, and winning, with an on/off toggle. Source and CC0 license are in `audio/`.
- Milestone LevelUp: an array and conditionals display messages at 10, 20, 30, and 40 total supplies collected. Spending or losing supplies does not retrigger messages; a new game resets milestones. The banner remains visible while ordinary collection feedback changes.
- Responsive layout, focus styles, daily summaries, reduced-motion support, win/loss screens, confetti, and a virtual campus badge.

The illustrated scenery, character, curved walking path, daily summaries, and upgrade system continue the original prototype. Project 6 also fixes the last-day shop so players can spend their final collected supplies before the result screen.

## Run and publish

Run `python3 -m http.server 8000` from this folder. Open the forwarded port in Codespaces or visit http://localhost:8000 locally. No build or package installation is required.

Commit and push to `main` to update the existing GitHub Pages site. Submit the live GitHub Pages URL above, not the repository or Codespace link. Test it in a private/incognito window before submitting. Course submission remains with the student.

## Quick verification

1. Start each mode and check its days, timer, and obstacle count.
2. Collect an item: it disappears and scores once. Mud never makes the balance negative.
3. Collect 10+ supplies, spend on an upgrade, and verify the milestone remains visible and never repeats.
4. Pause, wait, and resume: time and items stay frozen while paused.
5. Build all three upgrades to win. Play again should reset the day, score, and milestones.
6. Complete the final day and dismiss the summary. The shop still works before Finish journey.
7. Toggle sound off/on, use keyboard controls, and check a narrow phone layout.

Assets: original SVG scene and character; starter logo from GCA-Classroom/05-cw-game-water-quest. Sounds: Kenney Interface Sounds, CC0; see `audio/CREDITS.md`.
