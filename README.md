# Pixelart.js

To try the app out for yourself simply head over to [https://sawfan1.github.io/pixelart.js/] or simply download the source files and host it yourself. A simple way to do that would be with python. Open the project folder in a terminal and run `py -m http.server 8000`

This project is a rough replica of mspaint featuring basic drawing and editing tools. You can adjust properties of some of the tools. After you are done with your work, you can download and save it on your computer. I have never really worked with or built photo/image editing software, so this project was a good way to acquire the underlying concepts behind these programs.

# Implementation
The project is written in plain HTML, CSS and JS. Additionally, JQuery has also been used, some of you OGs might remember it from back in the day. I use two canvases - one preview and one render to draw everything. The brush and pen tools work by stamping a circle pattern between mouse positions which is detected by canvas event listeners. The spray tool works by removing random pixels in a generated cloud. As for the shapes, they are first drawn on the render canvas and finalised when you release the mouse.

There are seven tools implemented as of now: brush, pen, spray, circle, rectangle, triangle and the eraser. Two settings are also implemented, the stroke size and color. The download and clear board features are also added as a quality of life.

The web page structure is in `index.html` and most of the heavylifting is in `script.js`. `helpers.js` contains only one function `hexToRgb()`

# Enjoy!

If you like my project, please leave a star! :)