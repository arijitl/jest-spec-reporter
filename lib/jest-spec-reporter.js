const moment = require("moment");
const chalk = require("chalk");

const passedFmt = chalk.greenBright;
const passedTitleFmt = chalk.bold.green;
const failedFmt = chalk.redBright;
const failedTitleFmt = chalk.bold.red;
const pendingFmt = chalk.yellowBright;
const pendingTitleFmt = chalk.bold.yellow;
const titleFmt = chalk.white;
const headFmt = chalk.white;
const durationFmt = chalk.gray;
const infoFmt = chalk.white;

class JestSpecReporter {
    constructor(globalConfig, options) {
        this._globalConfig = globalConfig;
        this._options = options;
    }

    onRunStart({ numTotalTestSuites }) {
        console.log();
        console.log(infoFmt(`Found ${numTotalTestSuites} test suites`));
    }

    onRunComplete(test, results) {
        const {
            numFailedTests,
            numPassedTests,
            numPendingTests,
            testResults,
            numTotalTests,
            startTime
        } = results;

        testResults.map(({ failureMessage }) => {
            if (failureMessage) {
                console.log(failureMessage);
            }
        });
        console.log(infoFmt(`Ran ${numTotalTests} tests in ${testDuration()}`));
        if (numPassedTests) {
            console.log(
                this._getStatus("passed") +
                    passedFmt(` ${numPassedTests} passing`)
            );
        }
        if (numFailedTests) {
            console.log(
                this._getStatus("failed") +
                    failedFmt(` ${numFailedTests} failing`)
            );
        }
        if (numPendingTests) {
            console.log(
                this._getStatus("pending") +
                    pendingFmt(` ${numPendingTests} pending`)
            );
        }

        function testDuration() {
            const delta = moment.duration(moment() - new Date(startTime));
            const seconds = delta.seconds();
            const millis = delta.milliseconds();
            return `${seconds}.${millis} s`;
        }
    }

    onTestResult(test, { testResults }) {
        testResults.map(result => {
            const { title, duration, status, ancestorTitles } = result;
            const head = `${ancestorTitles.join(" > ")} >`;
            if (status === "pending") {
                console.log(
                    `    ${this._getStatus(status)} ${pendingTitleFmt(
                        head
                    )} ${pendingFmt(title)} ${durationFmt(
                        "(" + duration + "ms)"
                    )}`
                );
            } else {
                if (status === "passed") {
                    console.log(
                        `    ${this._getStatus(status)} ${passedTitleFmt(
                            head
                        )} ${titleFmt(title)} ${durationFmt(
                            "(" + duration + "ms)"
                        )}`
                    );
                } else {
                    console.log(
                        `    ${this._getStatus(status)} ${failedTitleFmt(
                            head
                        )} ${titleFmt(title)} ${durationFmt(
                            "(" + duration + "ms)"
                        )}`
                    );
                }
            }
        });
    }

    _getStatus(status) {
        switch (status) {
            case "passed":
                return passedFmt("✔");
            default:
            case "failed":
                return failedFmt("✘");
            case "pending":
                return pendingFmt("○");
        }
    }
}

module.exports = JestSpecReporter;
