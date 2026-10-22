package com.katasphere.execution;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.katasphere.execution.dto.ExecutionResultDto;
import com.katasphere.execution.dto.TestCaseResultDto;
import com.katasphere.problem.TestCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;

@Component
public class Judge0Adapter implements CodeExecutionProvider {

    private static final Logger log = LoggerFactory.getLogger(Judge0Adapter.class);

    private final String judge0Url;
    private final String apiKey;
    private final String apiHost;
    private final LocalExecutionEngine localExecutionEngine;
    private final CodeHarnessGenerator harnessGenerator;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Language ID mapping for Judge0 CE
    private static final Map<String, Integer> LANGUAGE_ID_MAP = Map.of(
        "PYTHON", 71,       // Python (3.8.1)
        "JAVA", 62,         // Java (OpenJDK 13/14)
        "CPP", 54,          // C++ (GCC 9.2.0)
        "JAVASCRIPT", 63    // JavaScript (Node.js 12.14.0)
    );

    public Judge0Adapter(
        @Value("${katasphere.judge0.url:https://judge0-ce.p.rapidapi.com}") String judge0Url,
        @Value("${katasphere.judge0.api-key:}") String apiKey,
        @Value("${katasphere.judge0.api-host:judge0-ce.p.rapidapi.com}") String apiHost,
        LocalExecutionEngine localExecutionEngine,
        CodeHarnessGenerator harnessGenerator,
        ObjectMapper objectMapper
    ) {
        this.judge0Url = judge0Url;
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.apiHost = apiHost != null ? apiHost.trim() : "judge0-ce.p.rapidapi.com";
        this.localExecutionEngine = localExecutionEngine;
        this.harnessGenerator = harnessGenerator;
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
    }

    @Override
    public ExecutionResultDto execute(String language, String sourceCode, List<TestCase> testCases, String problemSlug) {
        // If Judge0 API key is not configured, automatically use local execution engine
        if (apiKey.isEmpty()) {
            log.info("Judge0 API key not configured; delegating execution to local sandbox engine.");
            return localExecutionEngine.execute(language, sourceCode, testCases, problemSlug);
        }

        Integer languageId = LANGUAGE_ID_MAP.get(language.toUpperCase());
        if (languageId == null) {
            log.warn("Unsupported Judge0 language: {}. Falling back to local engine.", language);
            return localExecutionEngine.execute(language, sourceCode, testCases, problemSlug);
        }

        try {
            return executeWithJudge0(language, sourceCode, languageId, testCases);
        } catch (Exception e) {
            log.warn("Judge0 call failed ({}); falling back to local engine.", e.getMessage());
            return localExecutionEngine.execute(language, sourceCode, testCases, problemSlug);
        }
    }

    private ExecutionResultDto executeWithJudge0(String language, String sourceCode, int languageId, List<TestCase> testCases) {
        List<TestCaseResultDto> results = new ArrayList<>();
        int passedCount = 0;
        long totalRuntimeMs = 0;
        String overallVerdict = "ACCEPTED";
        String overallError = null;

        String submitUrl = judge0Url.replaceAll("/+$", "") + "/submissions?base64_encoded=false&wait=true";

        for (int i = 0; i < testCases.size(); i++) {
            TestCase tc = testCases.get(i);
            int caseNumber = i + 1;

            String harnessCode = harnessGenerator.generateHarness(language, sourceCode, tc.getInput());

            Map<String, Object> body = new HashMap<>();
            body.put("source_code", harnessCode);
            body.put("language_id", languageId);
            body.put("stdin", tc.getInput());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (!apiKey.isEmpty()) {
                headers.set("X-RapidAPI-Key", apiKey);
                headers.set("X-RapidAPI-Host", apiHost);
            }

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(submitUrl, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                try {
                    JsonNode node = objectMapper.readTree(response.getBody());
                    JsonNode statusNode = node.path("status");
                    int statusId = statusNode.path("id").asInt(0);
                    String statusDesc = statusNode.path("description").asText("Unknown");

                    String stdout = node.path("stdout").asText("");
                    String stderr = node.path("stderr").asText("");
                    String compileOutput = node.path("compile_output").asText("");
                    double timeSeconds = node.path("time").asDouble(0.0);
                    long memoryKb = node.path("memory").asLong(0L);
                    long caseRuntimeMs = (long) (timeSeconds * 1000.0);
                    totalRuntimeMs += caseRuntimeMs;

                    if (statusId == 6) { // Compilation Error
                        return new ExecutionResultDto(
                            "COMPILATION_ERROR",
                            testCases.size(),
                            0,
                            totalRuntimeMs,
                            memoryKb,
                            compileOutput,
                            compileOutput,
                            List.of(new TestCaseResultDto(caseNumber, false, tc.getInput(), tc.getExpectedOutput(), "", compileOutput, caseRuntimeMs, memoryKb, "Compilation Error")),
                            Instant.now()
                        );
                    }

                    if (statusId == 5) { // Time Limit Exceeded
                        overallVerdict = "TIME_LIMIT_EXCEEDED";
                        overallError = "Time Limit Exceeded";
                        results.add(new TestCaseResultDto(caseNumber, false, tc.getInput(), tc.getExpectedOutput(), stdout, "Time Limit Exceeded", caseRuntimeMs, memoryKb, "Time Limit Exceeded"));
                        break;
                    }

                    if (statusId >= 7 && statusId <= 12) { // Runtime Error
                        overallVerdict = "RUNTIME_ERROR";
                        overallError = stderr.isBlank() ? statusDesc : stderr;
                        results.add(new TestCaseResultDto(caseNumber, false, tc.getInput(), tc.getExpectedOutput(), stdout, overallError, caseRuntimeMs, memoryKb, "Runtime Error"));
                        break;
                    }

                    boolean passed = harnessGenerator.compareOutputs(stdout, tc.getExpectedOutput());
                    if (passed) {
                        passedCount++;
                        results.add(new TestCaseResultDto(caseNumber, true, tc.getInput(), tc.getExpectedOutput(), stdout, null, caseRuntimeMs, memoryKb, "Passed"));
                    } else {
                        if ("ACCEPTED".equals(overallVerdict)) {
                            overallVerdict = "WRONG_ANSWER";
                        }
                        results.add(new TestCaseResultDto(caseNumber, false, tc.getInput(), tc.getExpectedOutput(), stdout, "Output did not match expected result", caseRuntimeMs, memoryKb, "Wrong Answer"));
                    }
                } catch (Exception parseEx) {
                    log.error("Failed to parse Judge0 response: {}", parseEx.getMessage());
                    throw new RuntimeException(parseEx);
                }
            } else {
                throw new RuntimeException("Judge0 returned status: " + response.getStatusCode());
            }
        }

        return new ExecutionResultDto(
            overallVerdict,
            testCases.size(),
            passedCount,
            totalRuntimeMs,
            14500L,
            null,
            overallError,
            results,
            Instant.now()
        );
    }
}
