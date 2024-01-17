# Slot car lap counter

This project will communicate with an esp board using websocket and display information about an analog slot car race status, or simply measure lap times.
[Visit site](https://csicsi2000.github.io/svelte-slot-car-race-management/)

# Browser configuration
For the server connection to work you need to enable the insecure content for the webpage as described in this answer: 
https://stackoverflow.com/a/24434461

Reason: the esp8266 board hosts an insecure websocket which the browser by default ignores.

# Other projects used

## Starter template

[visit @ github pages](https://sroehrl.github.io/svelte-flowbite-boilerplate)

## Converted F1 lights

[f1-lights](https://github.com/jan25/f1-lights)

# Notes

## Light signals
https://www.fia.com/sites/default/files/regulation/file/03__Recommended_light_signals.pdf

## Ready for GitHub pages
This package contains GitHub actions to automatically deploy your app on GitHub pages. To activate, simply go to "Settings > Pages"
and use "GitHub Actions" as your source.

