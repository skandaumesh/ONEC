package com.onecpharma.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    private String icon;

    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String formSchema; // JSON schema defining dynamic form fields per category

    private String targetAudience; // ELDERLY, BABY, WOMEN, MEN, ALL, HANDICAPPED

    @Builder.Default
    private Boolean requiresPrescription = false;

    @Column(columnDefinition = "TEXT")
    private String healthTags; // Comma-separated tags for AI matching (e.g., "diabetes,blood-sugar,insulin")

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Category> children = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "category")
    @Builder.Default
    private List<Product> products = new ArrayList<>();

    @Builder.Default
    private Boolean active = true;

    private Integer displayOrder;
}

