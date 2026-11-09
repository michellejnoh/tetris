# Tetris

A Tetris game following the official Tetris Guideline rules, plus a skills course that teaches the hard techniques with small minigames.

- `index.html` is the game
- `skills.html` is the skills course
- `core.js` holds the rules, drawing and touch controls both pages share

Open `index.html` in a browser to play.

## Controls

| Action | Keyboard | Phone |
|---|---|---|
| Move | Left / Right (hold to slide) | drag sideways |
| Soft drop | Down | slide down |
| Hard drop | space | flick down |
| Rotate right | Up or X | tap |
| Rotate left | Z or Ctrl | two-finger tap |
| Hold | C or Shift | tap the Hold box, or flick up |
| Pause | Esc or P | Pause button |

## Skills course

Six short lessons, each a minigame on a small board. Every lesson has a "Show me" button that plays the solution move by move.

1. Move & drop: line up the ghost piece and hard drop
2. Rotate left: reach a spot with one rotation instead of three
3. Hold: save a piece to score a Tetris
4. Tuck: soft drop, then slide under a ledge
5. T-spin double: spin a T into a slot
6. Perfect clear: plan three pieces with the Next queue

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
