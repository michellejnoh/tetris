# Tetris

A Tetris game following the official Tetris Guideline rules, plus a skills course that teaches the hard techniques with small minigames.

- `index.html` is the game
- `skills.html` is the skills course
- `core.js` holds the rules, drawing and touch controls both pages share

Open `index.html` in a browser to play.

## Controls

| Action | Keyboard | Phone |
|---|---|---|
| Move | Left / Right (hold to slide) | drag sideways (Slow / Normal / Fast setting on the start screen) |
| Soft drop | Down | slide down |
| Hard drop | space | flick down |
| Rotate right | Up or X | tap |
| Rotate left | Z or Ctrl | two-finger tap |
| Hold | C or Shift | tap the Hold box, or flick up |
| Pause | Esc or P | Pause button |

## Skills course

Four chapters of minigame lessons on expert techniques, each with a "Show me" demo and up to three stars. Every board was checked with a solver that runs the same rules as the game.

1. **Foundations (기본기):** ghost and hard drop, rotating both ways, hold, tucking under a ledge, and a finesse drill that scores you on using the fewest inputs
2. **T-spins (T스핀):** mini, single (TSS), double (TSD), triple (TST), and a drill of random T-spin slots
3. **Attack (공격):** back-to-back, combo (REN) in a 4-wide well, perfect clears, a perfect clear puzzle with a Z-spin, and an endless 4-wide combo drill
4. **Openers (빌드):** a first-bag opener that builds a T-spin double (개막TSD)

## Rules

- Super Rotation System (SRS) with official wall kicks
- 7-bag randomizer, 5-piece next queue, hold (once per piece), ghost piece
- 0.5 s lock delay that resets on move/rotate, up to 15 times
- Official gravity curve, level up every 10 lines
- Guideline scoring: singles to Tetrises, T-spins and mini T-spins, back-to-back ×1.5, combos, perfect clears

## Block colours

From the Pantone palette, matched to each piece's official colour as closely as possible:
I Cerulean `#A5BCD6`, O Transparent Yellow `#F5EFC6`, Z Sceptre Red `#4D0E12`, L Potting Soil `#4A2E27`, S Java `#231815`.
Added to match the palette: J dusty blue `#6E86A6`, T raspberry `#8C3B57`.

The rest of the site is black and white, set in Helvetica Neue.
