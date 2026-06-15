package com.onecpharma.service;

import com.onecpharma.dto.response.AiRecommendationResponse;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.Category;
import com.onecpharma.model.Product;
import com.onecpharma.model.User;
import com.onecpharma.repository.CategoryRepository;
import com.onecpharma.repository.ProductRepository;
import com.onecpharma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiRecommendationService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<AiRecommendationResponse> getPersonalizedRecommendations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<AiRecommendationResponse> recommendations = new ArrayList<>();

        // 1. Health Condition recommendations
        if (user.getHealthConditions() != null && !user.getHealthConditions().isEmpty()) {
            String[] conditions = user.getHealthConditions().split(",");
            for (String condition : conditions) {
                String cleanCondition = condition.trim().toLowerCase();
                List<Category> matchingCats = categoryRepository.findByHealthTagsContaining(cleanCondition);
                for (Category cat : matchingCats) {
                    List<Product> products = productRepository.findByCategoryNameAndActiveTrue(cat.getName());
                    for (Product product : products) {
                        recommendations.add(AiRecommendationResponse.builder()
                                .productId(product.getId())
                                .productName(product.getName())
                                .description(product.getDescription())
                                .price(product.getSellingPrice())
                                .imageUrl(product.getImageUrl())
                                .reason("Recommended based on your health condition: " + condition.trim())
                                .confidence(0.95)
                                .category(cat.getName())
                                .targetGroup("HEALTH_CONDITION")
                                .build());
                    }
                }
            }
        }

        // 2. Elderly recommendations
        if (user.getIsElderly() != null && user.getIsElderly()) {
            List<Product> elderlyProducts = productRepository.findByActiveTrueAndCategoryTargetAudience("ELDERLY");
            for (Product product : elderlyProducts) {
                recommendations.add(AiRecommendationResponse.builder()
                        .productId(product.getId())
                        .productName(product.getName())
                        .description(product.getDescription())
                        .price(product.getSellingPrice())
                        .imageUrl(product.getImageUrl())
                        .reason("Top choice for Seniors")
                        .confidence(0.90)
                        .category(product.getCategory().getName())
                        .targetGroup("ELDERLY")
                        .build());
            }
        }

        // 3. Physically Challenged recommendations
        if (user.getIsPhysicallyChallenged() != null && user.getIsPhysicallyChallenged()) {
            List<Product> handicappedProducts = productRepository.findByActiveTrueAndCategoryTargetAudience("HANDICAPPED");
            for (Product product : handicappedProducts) {
                recommendations.add(AiRecommendationResponse.builder()
                        .productId(product.getId())
                        .productName(product.getName())
                        .description(product.getDescription())
                        .price(product.getSellingPrice())
                        .imageUrl(product.getImageUrl())
                        .reason("Supportive care product recommended for accessibility needs")
                        .confidence(0.92)
                        .category(product.getCategory().getName())
                        .targetGroup("HANDICAPPED")
                        .build());
            }
        }

        // 4. Default general recommendations if empty
        if (recommendations.isEmpty()) {
            List<Product> general = productRepository.findByFeaturedTrueAndActiveTrue();
            for (Product product : general) {
                recommendations.add(AiRecommendationResponse.builder()
                        .productId(product.getId())
                        .productName(product.getName())
                        .description(product.getDescription())
                        .price(product.getSellingPrice())
                        .imageUrl(product.getImageUrl())
                        .reason("Popular choice in your area")
                        .confidence(0.80)
                        .category(product.getCategory().getName())
                        .targetGroup("GENERAL")
                        .build());
            }
        }

        return recommendations.stream().limit(15).collect(Collectors.toList());
    }

    public List<AiRecommendationResponse> getFrequentlyBoughtTogether(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        Category category = product.getCategory();
        List<Product> related = productRepository.findByCategoryNameAndActiveTrue(category.getName());

        return related.stream()
                .filter(p -> !p.getId().equals(productId))
                .limit(3)
                .map(p -> AiRecommendationResponse.builder()
                        .productId(p.getId())
                        .productName(p.getName())
                        .description(p.getDescription())
                        .price(p.getSellingPrice())
                        .imageUrl(p.getImageUrl())
                        .reason("Frequently bought together with " + product.getName())
                        .confidence(0.88)
                        .category(category.getName())
                        .targetGroup("BUNDLE")
                        .build())
                .collect(Collectors.toList());
    }
}
