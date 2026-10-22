package com.katasphere.problem;

import com.katasphere.tag.Tag;
import com.katasphere.tag.TagDto;
import com.katasphere.tag.TagRepository;
import jakarta.persistence.criteria.Join;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final TagRepository tagRepository;

    public ProblemService(ProblemRepository problemRepository, TagRepository tagRepository) {
        this.problemRepository = problemRepository;
        this.tagRepository = tagRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProblemSummaryDto> getProblems(
        String difficulty,
        String tagSlug,
        String search,
        int page,
        int size,
        String sortBy,
        String sortDir
    ) {
        Specification<Problem> spec = Specification.where(null);

        if (difficulty != null && !difficulty.isBlank() && !difficulty.equalsIgnoreCase("ALL")) {
            String upperDifficulty = difficulty.trim().toUpperCase();
            spec = spec.and((root, query, cb) -> cb.equal(root.get("difficulty"), upperDifficulty));
        }

        if (tagSlug != null && !tagSlug.isBlank()) {
            String cleanTag = tagSlug.trim().toLowerCase();
            spec = spec.and((root, query, cb) -> {
                query.distinct(true);
                Join<Problem, Tag> tagJoin = root.join("tags");
                return cb.equal(tagJoin.get("slug"), cleanTag);
            });
        }

        if (search != null && !search.isBlank()) {
            String searchPattern = "%" + search.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("title")), searchPattern));
        }

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = (sortBy != null && (sortBy.equals("title") || sortBy.equals("difficulty") || sortBy.equals("createdAt")))
            ? sortBy
            : "title";

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));

        return problemRepository.findAll(spec, pageable).map(ProblemSummaryDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public ProblemDetailDto getProblemBySlug(String slug) {
        Problem problem = problemRepository.findBySlug(slug)
            .orElseThrow(() -> new IllegalArgumentException("Problem not found with slug: " + slug));

        return ProblemDetailDto.fromEntity(problem);
    }

    @Transactional(readOnly = true)
    public List<TagDto> getAllTags() {
        return tagRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
            .map(TagDto::fromEntity)
            .toList();
    }
}
