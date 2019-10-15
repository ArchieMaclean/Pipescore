# Contributing to Pipescore

Thank you for considering improving Pipescore 😀

Before creating a Pull Request, or adding your code, create an issue outlining what you're going to do - this is not necessary for one-off commits or commits that don't do anything groundbreaking.
When creating a Pull Request, here are some things to keep in mind:

## Branches

Currently, all the work is being done in the `master` branch, so as long as your changes are pretty small, you can keep your changes there too.
If you want to work on a larger sub-project, create a new branch with a recognisable name, e.g.
* audio-playback
* audio-recording
* ie-support

## Commit names

Commits should start with a capital, end *without* a full stop and be in past tense, e.g.
* Added popup for text editing
* Fixed bug with users being deleted

If you don't do this, I suppose I can't really blame you as I have not been very consistent either.

## Code style

Try to adhere to the following styling rules - if you do something slightly different I will probably change it if it is a big issue, but keeping these in mind so will save time and effort.

* Use `const` where possible, or `let` otherwise. Never use `var`.
* Use ES6 classes instead of old class syntax.
* Use arrow functions instead of anonymous functions.
* Use `underscore_spacing` for variables/constants, `CAPITALS` for global constants, `lowerCamelCase` for function/method names and `UpperCamelCase` for class names
* Try to have spaces on either side of equals signs and logical operators (`>`, `<`, e.t.c).
    * `const x = 3` <- Good
    * `const x=3` <- Bad

## Questions

If you have any questions, create an issue on Github.

## Thank you!

Thank you for reading this, and for supporting Pipescore!