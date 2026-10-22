package com.katasphere.execution;

import com.katasphere.execution.dto.ExecutionResultDto;
import com.katasphere.problem.TestCase;

import java.util.List;

public interface CodeExecutionProvider {

    /**
     * Executes the given source code against test cases in an isolated sandbox.
     *
     * @param language Programming language (PYTHON, JAVA, CPP, JAVASCRIPT)
     * @param sourceCode User written source code
     * @param testCases List of evaluation test cases
     * @param problemSlug Identifier for the problem
     * @return Granular execution verdicts, runtime, and memory telemetry
     */
    ExecutionResultDto execute(String language, String sourceCode, List<TestCase> testCases, String problemSlug);
}
