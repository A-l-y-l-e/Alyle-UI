# Developer guide

1. Fork the A-l-y-l-e/Alyle-UI repo on GitHub.
2. Clone your fork to your machine with `git clone`.
3. In the root of the project run `yarn` to install the dependencies.

Before running any script with yarn, run `. ./init.sh` only once, this will set some environment variables and will expose some binaries, only for current terminal.

To bring up a local server, first run `yarn watch-docs` and then in another terminal run `yarn start`.

To build @alyle/ui, run `yarn build:@alyle/ui`. The output can be found under dist/@alyle/ui.

To run tests, run `. ./init.sh && npx ava`.

> We currently use Ava for testing, and not Jasmine & Karma, those will be added as soon as possible.
