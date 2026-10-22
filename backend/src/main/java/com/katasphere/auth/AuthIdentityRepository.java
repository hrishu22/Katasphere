package com.katasphere.auth;

import com.katasphere.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthIdentityRepository extends JpaRepository<AuthIdentity, UUID> {
    Optional<AuthIdentity> findByUserAndProvider(User user, String provider);
    Optional<AuthIdentity> findByProviderAndProviderSubject(String provider, String providerSubject);
}
