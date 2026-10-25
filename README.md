# Time Returned

A charity: water inspired student prototype by Dina Seoudi, built with HTML, CSS, and vanilla JavaScript. AI assisted with implementation and visual iteration.

Collect rope, coins, and water (+1 supply) and avoid mud (-2 supplies, floored at zero). Each day lasts 20 seconds. Build the rain barrel (8), filter (12), and community well (20) in order. The water walk falls from 3 to 2 to 1 to 0 hours. Build the well before day 10 ends. Next Day appears between rounds. Reset and Play Again clear state and timers.

Features: responsive layout, keyboard-accessible controls, live score feedback, timer, obstacles, upgrades, win/loss screens, virtual campus badge, confetti, reduced-motion support, and donation links. Original SVG scene and character; starter logo from GCA-Classroom/05-cw-game-water-quest.

Run with `python3 -m http.server 8000` from this folder.

Live game: https://dinasaur9.github.io/time-returned/ . Course submission remains with the student. The development preview is not an evaluator URL. Obi is fictional; timings, upgrades, and rewards are symbolic.


Obi follows the curved road using coordinates matched to the SVG landscape. Every completed walk opens an arrival summary, including zero-supply days. The summary tracks rope, coins, water, actual mud penalties, upgrade spending, and the current balance. Dismiss it to visit the shop; day 10 shows the final result afterward.
