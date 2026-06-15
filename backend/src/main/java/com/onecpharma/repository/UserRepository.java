package com.onecpharma.repository;

import com.onecpharma.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    long countByRole(com.onecpharma.model.Role role);
    long countByIsElderlyTrue();
    long countByIsPhysicallyChallengedTrue();
    java.util.List<User> findByIsElderlyTrue();
    java.util.List<User> findByUdidApprovalStatus(com.onecpharma.model.UdidVerificationStatus udidApprovalStatus);
}
