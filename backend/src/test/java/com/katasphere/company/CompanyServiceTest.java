package com.katasphere.company;

import com.katasphere.problem.Problem;
import com.katasphere.problem.ProblemRepository;
import com.katasphere.tag.Tag;
import com.katasphere.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CompanyServiceTest {

    @Mock
    private ProblemRepository problemRepository;

    @InjectMocks
    private CompanyService companyService;

    private Problem sampleProblem1;
    private Problem sampleProblem2;
    private Problem sampleProblem3;
    private User freeUser;
    private User premiumUser;

    @BeforeEach
    void setUp() {
        Tag googleTag = new Tag();
        googleTag.setId(UUID.randomUUID());
        googleTag.setName("Google");
        googleTag.setSlug("google");

        sampleProblem1 = new Problem();
        sampleProblem1.setId(UUID.randomUUID());
        sampleProblem1.setTitle("Two Sum");
        sampleProblem1.setSlug("two-sum");
        sampleProblem1.setDifficulty("EASY");
        sampleProblem1.setTags(Set.of(googleTag));

        sampleProblem2 = new Problem();
        sampleProblem2.setId(UUID.randomUUID());
        sampleProblem2.setTitle("Container With Most Water");
        sampleProblem2.setSlug("container-with-most-water");
        sampleProblem2.setDifficulty("MEDIUM");
        sampleProblem2.setTags(Set.of(googleTag));

        sampleProblem3 = new Problem();
        sampleProblem3.setId(UUID.randomUUID());
        sampleProblem3.setTitle("Median of Two Sorted Arrays");
        sampleProblem3.setSlug("median-of-two-sorted-arrays");
        sampleProblem3.setDifficulty("HARD");
        sampleProblem3.setTags(Set.of(googleTag));

        freeUser = new User();
        freeUser.setId(UUID.randomUUID());
        freeUser.setRole("USER");

        premiumUser = new User();
        premiumUser.setId(UUID.randomUUID());
        premiumUser.setRole("PREMIUM");
    }

    @Test
    @DisplayName("getAllCompanies returns all 8 tier-1 companies with live counts")
    void testGetAllCompanies() {
        when(problemRepository.findAll(any(Specification.class)))
            .thenReturn(List.of(sampleProblem1, sampleProblem2));

        List<CompanySummaryDto> companies = companyService.getAllCompanies();

        assertThat(companies).isNotEmpty();
        assertThat(companies).hasSize(8);

        CompanySummaryDto google = companies.stream()
            .filter(c -> c.slug().equals("google"))
            .findFirst()
            .orElse(null);

        assertThat(google).isNotNull();
        assertThat(google.name()).isEqualTo("Google");
        assertThat(google.isPremium()).isTrue();
    }

    @Test
    @DisplayName("getCompanyDetails for non-premium user locks problems beyond preview limit")
    void testGetCompanyDetailsFreeUser() {
        when(problemRepository.findAll(any(Specification.class)))
            .thenReturn(List.of(sampleProblem1, sampleProblem2, sampleProblem3));

        CompanyDetailDto details = companyService.getCompanyDetails("google", freeUser);

        assertThat(details).isNotNull();
        assertThat(details.isUnlocked()).isFalse();
        assertThat(details.problems()).hasSize(3);

        // First 2 are preview (unlocked)
        assertThat(details.problems().get(0).isLocked()).isFalse();
        assertThat(details.problems().get(1).isLocked()).isFalse();

        // 3rd is locked
        assertThat(details.problems().get(2).isLocked()).isTrue();
    }

    @Test
    @DisplayName("getCompanyDetails for premium user unlocks all problems")
    void testGetCompanyDetailsPremiumUser() {
        when(problemRepository.findAll(any(Specification.class)))
            .thenReturn(List.of(sampleProblem1, sampleProblem2, sampleProblem3));

        CompanyDetailDto details = companyService.getCompanyDetails("google", premiumUser);

        assertThat(details).isNotNull();
        assertThat(details.isUnlocked()).isTrue();
        assertThat(details.problems()).hasSize(3);

        // All unlocked
        assertThat(details.problems().get(0).isLocked()).isFalse();
        assertThat(details.problems().get(1).isLocked()).isFalse();
        assertThat(details.problems().get(2).isLocked()).isFalse();
    }
}
