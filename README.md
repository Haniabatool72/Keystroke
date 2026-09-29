# Keystroke

A typing speed and accuracy test built with HTML, CSS and JavaScript.

## Features

- Time modes: 15, 30, 60 and 120 seconds
- Levels: Easy, Medium and Hard (capitals, punctuation and numbers)
- Live WPM, accuracy, countdown and progress bar
- Result screen with WPM, accuracy, raw speed, consistency and correct/wrong keys
- Most missed keys and a speed-over-time chart
- Personal best for each mode and a history of the last 8 tests
- Light and dark theme
- Responsive layout for phones and desktops

## Tech stack

- HTML5
- CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (no frameworks or libraries)

## Project structure

```
keystroke/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to play

1. Choose a time and a level.
2. Click the text box and start typing. The timer starts on your first key.
3. Use Backspace to correct mistakes.
4. Press `Tab` or `Esc` to restart with new words.
5. On the result screen, press `Enter` to try again.

## How scores are calculated

| Metric      | Formula                                   |
| ----------- | ----------------------------------------- |
| WPM         | correct characters / 5 / minutes          |
| Raw speed   | all typed characters / 5 / minutes        |
| Accuracy    | correct keystrokes / total keystrokes     |
| Consistency | how steady the speed was second to second |

## Customisation

- Word lists: the `WORDS` object at the top of `script.js`
- Colours: the `:root` variables at the top of `style.css`

## Author

Developed by **Hania Batool**
