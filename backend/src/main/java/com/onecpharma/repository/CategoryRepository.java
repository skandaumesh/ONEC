package com.onecpharma.repository;

import com.onecpharma.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentIsNullAndActiveTrue();
    List<Category> findByParentIdAndActiveTrue(Long parentId);
    Optional<Category> findByName(String name);
    boolean existsByName(String name);
    List<Category> findByTargetAudience(String targetAudience);
    @org.springframework.data.jpa.repository.Query("SELECT c FROM Category c WHERE LOWER(c.healthTags) LIKE LOWER(CONCAT('%', :tag, '%'))")
    List<Category> findByHealthTagsContaining(@org.springframework.data.repository.query.Param("tag") String tag);
}
