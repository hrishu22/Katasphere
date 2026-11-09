package com.katasphere.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters long")
    String password,

    /** "USER" (Student/Candidate, default) or "COLLEGE_ADMIN" (Faculty/Institution Admin) */
    String accountType,

    // Optional fields when registering as COLLEGE_ADMIN
    @Size(max = 255)
    String collegeName,

    @Email(message = "Please provide a valid official college email")
    @Size(max = 255)
    String officialCollegeEmail,

    Integer expectedStudents,

    @Size(max = 255)
    String department,

    // Optional fields when registering as STUDENT and linking immediately
    @Size(max = 20)
    String collegeCode,

    @Size(max = 64)
    String rollNumber
) {
    public RegisterRequest(String name, String email, String password) {
        this(name, email, password, "USER", null, null, null, null, null, null);
    }
}
