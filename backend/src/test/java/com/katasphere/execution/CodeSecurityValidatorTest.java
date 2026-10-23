package com.katasphere.execution;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CodeSecurityValidatorTest {

    private CodeSecurityValidator validator;

    @BeforeEach
    void setUp() {
        validator = new CodeSecurityValidator();
    }

    @Test
    @DisplayName("Safe Python solution should pass validation")
    void testSafePythonCode() {
        String code = """
            def twoSum(nums, target):
                seen = {}
                for i, n in enumerate(nums):
                    diff = target - n
                    if diff in seen:
                        return [seen[diff], i]
                    seen[n] = i
                return []
            """;
        var result = validator.validate("PYTHON", code);
        assertTrue(result.safe());
        assertNull(result.violationReason());
    }

    @Test
    @DisplayName("Safe Java solution should pass validation")
    void testSafeJavaCode() {
        String code = """
            import java.util.*;
            class Solution {
                public int[] twoSum(int[] nums, int target) {
                    Map<Integer, Integer> map = new HashMap<>();
                    for (int i = 0; i < nums.length; i++) {
                        int comp = target - nums[i];
                        if (map.containsKey(comp)) return new int[]{map.get(comp), i};
                        map.put(nums[i], i);
                    }
                    return new int[]{};
                }
            }
            """;
        var result = validator.validate("JAVA", code);
        assertTrue(result.safe());
        assertNull(result.violationReason());
    }

    @Test
    @DisplayName("Java System.getenv or ProcessBuilder should be blocked")
    void testJavaSystemEnvBlocked() {
        String code1 = "class Solution { void test() { System.getenv(\"DATABASE_URL\"); } }";
        var res1 = validator.validate("JAVA", code1);
        assertFalse(res1.safe());

        String code2 = "class Solution { void test() { new ProcessBuilder(\"sh\").start(); } }";
        var res2 = validator.validate("JAVA", code2);
        assertFalse(res2.safe());

        String code3 = "class Solution { void test() { Runtime.getRuntime().exec(\"id\"); } }";
        var res3 = validator.validate("JAVA", code3);
        assertFalse(res3.safe());
    }

    @Test
    @DisplayName("Java Reflection or Sockets should be blocked")
    void testJavaReflectionBlocked() {
        String code1 = "class Solution { void test() throws Exception { Class.forName(\"java.lang.Runtime\"); } }";
        var res1 = validator.validate("JAVA", code1);
        assertFalse(res1.safe());

        String code2 = "class Solution { void test() { java.net.Socket s = new java.net.Socket(); } }";
        var res2 = validator.validate("JAVA", code2);
        assertFalse(res2.safe());
    }

    @Test
    @DisplayName("Python os.system, subprocess, open, and eval should be blocked")
    void testPythonDangerousCallsBlocked() {
        assertFalse(validator.validate("PYTHON", "import os\nos.system('ls')").safe());
        assertFalse(validator.validate("PYTHON", "import subprocess\nsubprocess.run(['id'])").safe());
        assertFalse(validator.validate("PYTHON", "f = open('/etc/passwd')").safe());
        assertFalse(validator.validate("PYTHON", "eval('__import__(\"os\").system(\"id\")')").safe());
        assertFalse(validator.validate("PYTHON", "().__class__.__subclasses__()").safe());
    }

    @Test
    @DisplayName("JavaScript child_process, fs, and process.env should be blocked")
    void testJavaScriptBlocked() {
        assertFalse(validator.validate("JAVASCRIPT", "const cp = require('child_process');").safe());
        assertFalse(validator.validate("JAVASCRIPT", "const fs = require('fs');").safe());
        assertFalse(validator.validate("JAVASCRIPT", "console.log(process.env.DATABASE_URL);").safe());
        assertFalse(validator.validate("JAVASCRIPT", "eval('console.log(1)');").safe());
    }

    @Test
    @DisplayName("C++ system call and dangerous includes should be blocked")
    void testCppBlocked() {
        assertFalse(validator.validate("CPP", "#include <cstdlib>\nint main() { system(\"ls\"); }").safe());
        assertFalse(validator.validate("CPP", "#include <unistd.h>\nint main() { fork(); }").safe());
    }
}
