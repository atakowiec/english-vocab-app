# English Vocab App

## App

### Learning mode

Intelligent learning mode that mixes up a few game modes intelligently so words are learned in a variety of ways
and are repeated unless they are learned enough well.

Users will learn new words in sessions of 20 words. There will be options to mark words as learned (or something like
bad, good, excellent, etc.)

### Available modes:

- `[1] Definition mode`: you get a definition, and you have to guess the Polish word. Possible lifebuoys: see the
  English
  word, see ABCD
- `[2] Input mode`: you get a Polish word, and you have to fill a blank in the English phrase. Possible lifebuoys: see
  the
  English definition, see ABCD
- `[3] Test mode`: you get a Polish word, and you have to guess the English word. Possible lifebuoys: see the
  definition, (works both ways)
- `[4] Pair mode`: you get four English words and four translations, and you have to pair them. You can also see the
  definition on long press.
- `[5] Speed test mode`: the same as the test mode, but you have a few seconds to pick the correct answer.
- `[6] Word building mode`: you get shuffled letters and a word (English or Polish), and you have to build a translation
  word. Possible lifebuoys: see the definition, see the next letter (possible multiple times)

Every moda has a "show answer" option.

### Learning flow

- A list of 20 random words to learn. (some of them might be learned and need a quick review)
- All not learned words go first with on of the following mode: `[4] Pair mode`, `[3] Test mode`, `[1] Definition mode`
- Then every word will appear with all modes except `[5] Speed test mode`, words that were not learned in the first step
  will more likely appear with modes: `[4]`, `[3]` and `[1]` (same as above)
- Each word appears again and again unless the user marks as learned enough times (probably three times for not learned
  and fewer times for learned)
- At the end every word goes through the `[5] Speed test mode` unless the user gives correct answer.

### Review flow

- every word appears four times, the second time is after 1 to 2 days, the third time is after another 4 to 7 days, and
  the last time it appears after 14 days
- previously learned words are skipped in the first phase (with modes `[4]`, `[3]`, `[1]`)
- previously learned words appear unless the correct answer is given at least two times in a row in this session
- every word has to appear in every learning mode, modes are picked based on the number of previous appearances with
  this word (there is a field in the database for each learning mode with a number of correct answers)

### Other features

- `[5] Speed test mode` has different styles (e.g., background color or some animations) so user can feel the pressure.
- `[5] Speed test mode` can be played separately as a game with a score.
- `[6] Word building mode` can be played separately as a game with a score.
- at the end of a session, the user can see a quick recap screen with words learned, words struggled with and words
  scheduled for review
- words have a label that shows if it's a new meaning of the word, or it's a review