# TM Task Tracker

> Reference project for students of Thomas More

## Info

Task Tracker is a little tool that allows the end user to track tasks, note comments on tasks and set an task he is actively working on. Task Tracker also believes that priority should be singular and for that reason
only one task can be active at the same time.

## Prequisites

Before you can use the app you have to install it locally:

`npm install`

Then you have to build the transpile the TypeScript code to runnable JavaScript:

`npm run build`

Because we won't be adding any binaries to the codebase the way you run the console application is:

`npm start -- ...`

Where ... are the options you wish to specify.

## Testing

To run the tests use `npm test`
The test files can be found in the folder [tests](./tests)

A test report will also be written to `./mochawesome-report`.

### Coverage

To see your test coverage you can run: `npm run test:coverage`.

This will create a report in the folder `./coverage` in which a HTML site is uploaded.
You can open this file in your browser to get a full overview of you code coverage.

If you run the coverage script the test success report will come in `./coverage/mochawesome-report/`
