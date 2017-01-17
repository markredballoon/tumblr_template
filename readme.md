# Red Balloon Tumblr Theme Template

This package is a template for creating Tumblr Themes quickly and easily. The index.html file is used as a base for the rapid prototyping of the themes frontend.
The theme.html file is a skeleton of the final theme.

The css folder contains an example of a less style structure. This doesn't include a grid system. If a grid system is required you may want to use bootstrap or a [custom grid system](https://github.com/goodpixels/less-grid-system).

## File structure

```
.
├── css
│   ├── fonts
│   ├── source
│   │   ├── fallbacks.less
│   │   ├── fonts.less
│   │   ├── header.less
│   │   ├── index.less
│   │   ├── main.less
│   │   ├── mixins.less
│   │   ├── reset.less
│   │   ├── style.less
│   │   ├── typeography.less
│   │   ├── utilities.less
│   │   └── variables.less
│   ├── style.map.css
│   └── style.min.css
├── demos
├── gruntfile.js
├── index.html
├── js
│   ├── custom_api_index.js
│   └── general.js
├── package.json
├── readme.md
└── theme.html
```

## Build tools
This template includes a grunt autocompiler that listens for any updates to files within the source/css folder and compiles them. This compilation includes minification, concatination of the media queries and autoprefixing.
A sourcemap is also created.

## Installation
* Download or clone this repo onto your machine.
* Install the build tools by running run `$ npm install` then `$ grunt`


    