package com.katasphere.problem;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.katasphere.problem.dto.CreateProblemRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class ProblemDataInitializer {

    private static final Logger log = LoggerFactory.getLogger(ProblemDataInitializer.class);

    private final ProblemAdminService problemAdminService;
    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;

    public ProblemDataInitializer(
        ProblemAdminService problemAdminService,
        ResourceLoader resourceLoader,
        ObjectMapper objectMapper
    ) {
        this.problemAdminService = problemAdminService;
        this.resourceLoader = resourceLoader;
        this.objectMapper = objectMapper;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initializeCatalogProblems() {
        try {
            Resource resource = resourceLoader.getResource("classpath:problems/catalog.json");
            if (!resource.exists()) {
                log.info("No problems/catalog.json found; skipping auto-import.");
                return;
            }

            try (InputStream is = resource.getInputStream()) {
                List<CreateProblemRequest> problems = objectMapper.readValue(
                    is,
                    new TypeReference<List<CreateProblemRequest>>() {}
                );

                for (CreateProblemRequest req : problems) {
                    problemAdminService.createOrUpdateProblem(req);
                }
                log.info("Successfully ingested {} problems from catalog.json", problems.size());
            }
        } catch (Exception e) {
            log.warn("Could not auto-import catalog.json problems: {}", e.getMessage());
        }
    }
}
