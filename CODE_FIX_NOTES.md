# Code Fix Notes

## 3 lives per level

The intended rule is:

- Each level starts with 3 lives.
- Score carries across all 10 levels.
- Lives reset when the player reaches the next level.
- The rare +1 power-up can temporarily raise lives up to 5 during the current level.

## Required index.html fix

In `nextLevel()`, add the lives reset after the level increments.

Current area:

```js
function nextLevel(){
  if(S.level>=10){ endGame(true); return; }
  S.level++; S.levelsCleared++; S.time=LEVEL_TIME; S.transition=1.4;
```

Recommended replacement:

```js
function nextLevel(){
  if(S.level>=10){ endGame(true); return; }
  S.level++;
  S.levelsCleared++;
  S.time=LEVEL_TIME;
  S.lives=START_LIVES;
  S.invuln=1.2;
  S.transition=1.4;
```

This keeps the gameplay aligned with the README and App Store copy.
