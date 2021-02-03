# Note!
This is old spaghetti code from when I was an even worse programmer than I am now. I have since learned the error of my ways :) and given up on this code. The new project is at https://github.com/macarc/PipeScore

### Why is it bad?
I used classes but I didn't hide state. So it is full of horrible things like classes mutating parts of other classes, inefficient getters/setters, random array sorting. Changing anything is liable to break everything else in unexpected ways.

The functions don't do one thing and they don't do it well.

Also, it's just full of bad choices because I didn't really know any better, such as using the canvas API insead of the SVG one (which dramatically simplifies things).

# PipeScore

A bagpipe notation software currently under development. Uses a [Firebase](https://firebase.google.com/) backend, p5 for drawing the score and p5.pdf for converting to PDF.

You can view the site-in-progress at https://pipescore.web.app.

## Running locally

```
$ git clone https://github.com/ArchieMaclean/Pipescore
$ cd pipescore
$ npm install
$ firebase serve
```
