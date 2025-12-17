import { buildXcodebuildArgs, executeXcodebuild } from './core.js';
import type { TestResult, TestCaseResult } from '../../types.js';
import type { TestOptions } from './types.js';

function parseTestResults(output: string): TestCaseResult[] {
    const results: TestCaseResult[] = [];
    const testPassedRegex = /Test Case\s+'-\[(\w+)\s+(\w+)\]'\s+passed\s+\((\d+\.?\d*)\s+seconds\)/g;
    const testFailedRegex = /Test Case\s+'-\[(\w+)\s+(\w+)\]'\s+failed\s+\((\d+\.?\d*)\s+seconds\)/g;
    const testSkippedRegex = /Test Case\s+'-\[(\w+)\s+(\w+)\]'\s+skipped/g;

    let match;

    while ((match = testPassedRegex.exec(output)) !== null) {
        results.push({
            className: match[1],
            testName: match[2],
            status: 'passed',
            duration: parseFloat(match[3]) * 1000,
        });
    }

    while ((match = testFailedRegex.exec(output)) !== null) {
        results.push({
            className: match[1],
            testName: match[2],
            status: 'failed',
            duration: parseFloat(match[3]) * 1000,
        });
    }

    while ((match = testSkippedRegex.exec(output)) !== null) {
        results.push({
            className: match[1],
            testName: match[2],
            status: 'skipped',
            duration: 0,
        });
    }

    return results;
}

export async function test(projectPath: string, options: TestOptions): Promise<TestResult> {
    const startTime = Date.now();
    const args = buildXcodebuildArgs(projectPath, 'test', options);

    if (options.testPlan) {
        args.push(`-testPlan "${options.testPlan}"`);
    }

    if (options.onlyTesting) {
        options.onlyTesting.forEach((t) => {
            args.push(`-only-testing:"${t}"`);
        });
    }

    if (options.skipTesting) {
        options.skipTesting.forEach((t) => {
            args.push(`-skip-testing:"${t}"`);
        });
    }

    if (options.resultBundlePath) {
        args.push(`-resultBundlePath "${options.resultBundlePath}"`);
    }

    const result = await executeXcodebuild(args);

    const duration = Date.now() - startTime;
    const testDetails = parseTestResults(result.stdout);

    return {
        success: result.exitCode === 0,
        testsRun: testDetails.length,
        testsPassed: testDetails.filter((t) => t.status === 'passed').length,
        testsFailed: testDetails.filter((t) => t.status === 'failed').length,
        testsSkipped: testDetails.filter((t) => t.status === 'skipped').length,
        duration,
        details: testDetails,
    };
}

export async function testWithoutBuilding(
    projectPath: string,
    options: {
        scheme: string;
        destination?: string;
        testPlan?: string;
        derivedDataPath?: string;
        resultBundlePath?: string;
    }
): Promise<TestResult> {
    const startTime = Date.now();
    const args = buildXcodebuildArgs(projectPath, 'test-without-building', options);

    if (options.testPlan) {
        args.push(`-testPlan "${options.testPlan}"`);
    }

    if (options.resultBundlePath) {
        args.push(`-resultBundlePath "${options.resultBundlePath}"`);
    }

    const result = await executeXcodebuild(args);

    const duration = Date.now() - startTime;
    const testDetails = parseTestResults(result.stdout);

    return {
        success: result.exitCode === 0,
        testsRun: testDetails.length,
        testsPassed: testDetails.filter((t) => t.status === 'passed').length,
        testsFailed: testDetails.filter((t) => t.status === 'failed').length,
        testsSkipped: testDetails.filter((t) => t.status === 'skipped').length,
        duration,
        details: testDetails,
    };
}
