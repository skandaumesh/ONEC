package com.onecpharma.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesReportResponse {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private BigDecimal averageOrderValue;
    private List<DailyRevenue> dailyRevenue;
    private List<ProductSales> topProducts;
    private List<CategorySales> categoryBreakdown;

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyRevenue {
        private String date;
        private BigDecimal revenue;
        private Long orderCount;
    }

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductSales {
        private Long productId;
        private String productName;
        private Long unitsSold;
        private BigDecimal totalSales;
    }

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategorySales {
        private String categoryName;
        private BigDecimal totalSales;
        private Double percentage;
    }
}
