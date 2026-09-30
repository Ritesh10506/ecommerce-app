package com.hcl.e_comerce.service;

import com.hcl.e_comerce.dto.OrderItemRequest;
import com.hcl.e_comerce.dto.OrderRequest;
import com.hcl.e_comerce.entity.Order;
import com.hcl.e_comerce.entity.OrderItem;
import com.hcl.e_comerce.entity.Product;
import com.hcl.e_comerce.entity.User;
import com.hcl.e_comerce.enums.OrderStatus;
import com.hcl.e_comerce.exception.BadRequestException;
import com.hcl.e_comerce.exception.ResourceNotFoundException;
import com.hcl.e_comerce.repository.OrderRepository;
import com.hcl.e_comerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final ProductService productService;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserService userService,
                        ProductService productService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userService = userService;
        this.productService = productService;
    }

    @Transactional
    public Order placeOrder(OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must have at least one item");
        }
        if (request.getShippingAddress() == null || request.getShippingAddress().isBlank()) {
            throw new BadRequestException("Shipping address is required");
        }

        User user = userService.getUserById(request.getUserId());

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus(OrderStatus.PENDING);

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productService.getProductById(itemReq.getProductId());

            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new BadRequestException("Quantity must be at least 1");
            }
            if (itemReq.getQuantity() > product.getStock()) {
                throw new BadRequestException("Not enough stock for " + product.getName()
                        + ". Available: " + product.getStock());
            }

            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(product.getPrice());
            order.getItems().add(item);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + id));
    }

    public List<Order> getOrdersByUser(Long userId) {
        userService.getUserById(userId);
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateStatus(Long orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot change status of a cancelled order");
        }
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);

        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel order that is already " + order.getStatus());
        }
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }

        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }
}