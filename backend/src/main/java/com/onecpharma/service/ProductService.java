package com.onecpharma.service;

import com.onecpharma.dto.request.ProductRequest;
import com.onecpharma.dto.response.ProductResponse;
import com.onecpharma.exception.ResourceNotFoundException;
import com.onecpharma.model.Category;
import com.onecpharma.model.Product;
import com.onecpharma.model.Inventory;
import com.onecpharma.repository.CategoryRepository;
import com.onecpharma.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable).map(this::mapToResponse);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToResponse(product);
    }

    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable).map(this::mapToResponse);
    }

    public Page<ProductResponse> searchProducts(String query, Pageable pageable) {
        return productRepository.searchProducts(query, pageable).map(this::mapToResponse);
    }

    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getTopRatedProducts() {
        return productRepository.findTop10ByActiveTrueOrderByRatingDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .mrp(request.getMrp())
                .sellingPrice(request.getSellingPrice())
                .manufacturer(request.getManufacturer())
                .saltComposition(request.getSaltComposition())
                .uses(request.getUses())
                .sideEffects(request.getSideEffects())
                .directions(request.getDirections())
                .imageUrl(request.getImageUrl())
                .imageUrl2(request.getImageUrl2())
                .imageUrl3(request.getImageUrl3())
                .prescriptionRequired(request.getPrescriptionRequired() != null ? request.getPrescriptionRequired() : false)
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .stock(request.getStock() != null ? request.getStock() : 0)
                .packSize(request.getPackSize())
                .dosageForm(request.getDosageForm())
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            product.setCategory(category);
        }

        // Initialize Inventory
        Inventory inventory = Inventory.builder()
                .product(product)
                .quantity(product.getStock())
                .reorderLevel(10)
                .batchNumber("BATCH-" + String.format("%05d", new java.util.Random().nextInt(100000)))
                .manufacturingDate(java.time.LocalDate.now())
                .expiryDate(java.time.LocalDate.now().plusYears(2))
                .supplier("ONEC Direct")
                .supplierContact("+91 99999 99999")
                .lastRestocked(java.time.LocalDateTime.now())
                .build();
        product.setInventory(inventory);

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setMrp(request.getMrp());
        product.setSellingPrice(request.getSellingPrice());
        product.setManufacturer(request.getManufacturer());
        product.setSaltComposition(request.getSaltComposition());
        product.setUses(request.getUses());
        product.setSideEffects(request.getSideEffects());
        product.setDirections(request.getDirections());
        product.setImageUrl(request.getImageUrl());
        product.setImageUrl2(request.getImageUrl2());
        product.setImageUrl3(request.getImageUrl3());
        product.setPrescriptionRequired(request.getPrescriptionRequired() != null ? request.getPrescriptionRequired() : false);
        product.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);
        product.setStock(request.getStock() != null ? request.getStock() : 0);
        product.setPackSize(request.getPackSize());
        product.setDosageForm(request.getDosageForm());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            product.setCategory(category);
        }

        // Sync inventory quantity
        if (product.getInventory() != null) {
            product.getInventory().setQuantity(product.getStock());
            product.getInventory().setLastRestocked(java.time.LocalDateTime.now());
        }

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setActive(false);
        productRepository.save(product);
    }

    @Transactional
    public ProductResponse toggleProductActive(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setActive(!product.getActive());
        product = productRepository.save(product);
        return mapToResponse(product);
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .mrp(product.getMrp())
                .sellingPrice(product.getSellingPrice())
                .discountPercent(product.getDiscountPercent())
                .manufacturer(product.getManufacturer())
                .saltComposition(product.getSaltComposition())
                .uses(product.getUses())
                .sideEffects(product.getSideEffects())
                .directions(product.getDirections())
                .imageUrl(product.getImageUrl())
                .imageUrl2(product.getImageUrl2())
                .imageUrl3(product.getImageUrl3())
                .prescriptionRequired(product.getPrescriptionRequired())
                .featured(product.getFeatured())
                .stock(product.getStock())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .packSize(product.getPackSize())
                .dosageForm(product.getDosageForm())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .inStock(product.getStock() > 0)
                .build();
    }
}
