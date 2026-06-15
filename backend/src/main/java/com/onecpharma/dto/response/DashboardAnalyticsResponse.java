package com.onecpharma.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAnalyticsResponse {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalCustomers;
    private Long totalProducts;
    
    private Long pendingOrders;
    private Long lowStockCount;
    private Long todayOrders;
    private BigDecimal todayRevenue;
    
    private Long elderlyUsersCount;
    private Long handicappedUsersCount;
    
    private List<OrderResponse> recentOrders;
    private Map<String, Long> categoryBreakdown;
    private Map<String, BigDecimal> monthlyRevenueChart;
    private Map<String, Long> orderStatusBreakdown;
}
