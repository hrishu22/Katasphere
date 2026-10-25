package com.katasphere.execution;

import com.katasphere.execution.dto.ExecutionResultDto;
import com.katasphere.problem.TestCase;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class LocalExecutionEngineTest {

    @Test
    void testJavaExecutionWithStdout() {
        CodeHarnessGenerator harnessGenerator = new CodeHarnessGenerator();
        CodeSecurityValidator validator = new CodeSecurityValidator();
        LocalExecutionEngine engine = new LocalExecutionEngine(harnessGenerator, validator);

        String userCode = """
            class Solution {
                public int[] twoSum(int[] nums, int target) {
                    System.out.println("DEBUG PRINT FROM TWOSUM: nums length=" + nums.length);
                    for (int i = 0; i < nums.length; i++) {
                        for (int j = i + 1; j < nums.length; j++) {
                            if (nums[i] + nums[j] == target) {
                                return new int[]{i, j};
                            }
                        }
                    }
                    return new int[]{};
                }
            }
            """;

        TestCase tc1 = new TestCase();
        tc1.setInput("nums = [2,7,11,15], target = 9");
        tc1.setExpectedOutput("[0,1]");

        TestCase tc2 = new TestCase();
        tc2.setInput("nums = [3,2,4], target = 6");
        tc2.setExpectedOutput("[1,2]");

        TestCase tc3 = new TestCase();
        tc3.setInput("nums = [3,3], target = 6");
        tc3.setExpectedOutput("[0,1]");

        long start = System.currentTimeMillis();
        ExecutionResultDto result = engine.execute("JAVA", userCode, List.of(tc1, tc2, tc3), "two-sum");
        long duration = System.currentTimeMillis() - start;

        assertEquals("ACCEPTED", result.verdict());
        assertEquals(3, result.passedTestCases());
        assertEquals(3, result.totalTestCases());
        assertNotNull(result.testCases().get(0).stdout());
        assertTrue(result.testCases().get(0).stdout().contains("DEBUG PRINT FROM TWOSUM"));
        // Total duration for all 3 test cases including compile should be under 2000ms
        assertTrue(duration < 2500, "Execution took too long: " + duration + "ms");
    }

    @Test
    void testJavaTimeoutCapturesStdout() {
        CodeHarnessGenerator harnessGenerator = new CodeHarnessGenerator();
        CodeSecurityValidator validator = new CodeSecurityValidator();
        LocalExecutionEngine engine = new LocalExecutionEngine(harnessGenerator, validator);

        String userCode = """
            class Solution {
                public int[] twoSum(int[] nums, int target) {
                    System.out.println("PRINT BEFORE TIMEOUT OCCURS");
                    try {
                        Thread.sleep(10000);
                    } catch (Exception e) {}
                    return new int[]{};
                }
            }
            """;

        TestCase tc1 = new TestCase();
        tc1.setInput("nums = [2,7,11,15], target = 9");
        tc1.setExpectedOutput("[0,1]");

        ExecutionResultDto result = engine.execute("JAVA", userCode, List.of(tc1), "two-sum");

        assertEquals("TIME_LIMIT_EXCEEDED", result.verdict());
        assertFalse(result.testCases().isEmpty());
        assertNotNull(result.testCases().get(0).stdout());
        assertTrue(result.testCases().get(0).stdout().contains("PRINT BEFORE TIMEOUT OCCURS"));
    }

    @Test
    void testJavaRuntimeErrorCapturesStdout() {
        CodeHarnessGenerator harnessGenerator = new CodeHarnessGenerator();
        CodeSecurityValidator validator = new CodeSecurityValidator();
        LocalExecutionEngine engine = new LocalExecutionEngine(harnessGenerator, validator);

        String userCode = """
            class Solution {
                public int[] twoSum(int[] nums, int target) {
                    System.out.println("DEBUG PRINT BEFORE CRASH: target=" + target);
                    throw new IllegalArgumentException("Deliberate exception for testing");
                }
            }
            """;

        TestCase tc1 = new TestCase();
        tc1.setInput("nums = [2,7,11,15], target = 9");
        tc1.setExpectedOutput("[0,1]");

        ExecutionResultDto result = engine.execute("JAVA", userCode, List.of(tc1), "two-sum");

        assertEquals("RUNTIME_ERROR", result.verdict());
        assertFalse(result.testCases().isEmpty());
        assertNotNull(result.testCases().get(0).stdout());
        assertTrue(result.testCases().get(0).stdout().contains("DEBUG PRINT BEFORE CRASH: target=9"));
    }

    @Test
    void testJavaCompilationError() {
        CodeHarnessGenerator harnessGenerator = new CodeHarnessGenerator();
        CodeSecurityValidator validator = new CodeSecurityValidator();
        LocalExecutionEngine engine = new LocalExecutionEngine(harnessGenerator, validator);

        String invalidCode = """
            class Solution {
                public int[] twoSum(int[] nums, int target) {
                    this is invalid syntax that will not compile
                }
            }
            """;

        TestCase tc1 = new TestCase();
        tc1.setInput("nums = [2,7,11,15], target = 9");
        tc1.setExpectedOutput("[0,1]");

        ExecutionResultDto result = engine.execute("JAVA", invalidCode, List.of(tc1), "two-sum");

        assertEquals("COMPILATION_ERROR", result.verdict());
        assertNotNull(result.compileOutput());
        assertTrue(result.compileOutput().contains("error:"));
    }

    @Test
    void testJava2DArrayMatrix() {
        CodeHarnessGenerator harnessGenerator = new CodeHarnessGenerator();
        CodeSecurityValidator validator = new CodeSecurityValidator();
        LocalExecutionEngine engine = new LocalExecutionEngine(harnessGenerator, validator);

        String matrixCode = """
            class Solution {
                public int[][] merge(int[][] intervals) {
                    System.out.println("Matrix row count: " + intervals.length);
                    return intervals;
                }
            }
            """;

        TestCase tc1 = new TestCase();
        tc1.setInput("intervals = [[1,3],[2,6],[8,10],[15,18]]");
        tc1.setExpectedOutput("[[1,3],[2,6],[8,10],[15,18]]");

        ExecutionResultDto result = engine.execute("JAVA", matrixCode, List.of(tc1), "merge-intervals");

        assertEquals("ACCEPTED", result.verdict());
        assertNotNull(result.testCases().get(0).stdout());
        assertTrue(result.testCases().get(0).stdout().contains("Matrix row count: 4"));
    }
}
