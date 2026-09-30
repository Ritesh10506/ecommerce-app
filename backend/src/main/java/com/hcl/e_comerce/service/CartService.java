package com.hcl.e_comerce.service;

import com.hcl.e_comerce.dto.OrderItemRequest;
import com.hcl.e_comerce.dto.OrderRequest;
import com.hcl.e_comerce.entity.CartItem;
import com.hcl.e_comerce.entity.Order;
import com.hcl.e_comerce.entity.Product;
import com.hcl.e_comerce.entity.User;
import com.hcl.e_comerce.exception.BadRequestException;
import com.hcl.e_comerce.exception.ResourceNotFoundException;
import com.hcl.e_comerce.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final ProductService productService;
    private final OrderService orderService;

    public CartService(CartItemRepository cartItemRepository,
                       UserService userService,
                       ProductService productService,
                       OrderService orderService) {
        this.cartItemRepository = cartItemRepository;
        this.userService = userService;
        this.productService = productService;
        this.orderService = orderService;
    }

    public CartItem addToCart(Long userId, Long productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new BadRequestException("Quantity must be at least 1");
        }

        User user = userService.getUserById(userId);
        Product product = productService.getProductById(productId);

        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, productId)
                .orElse(null);

        int newQuantity = (item == null) ? quantity : item.getQuantity() + quantity;

        if (newQuantity > product.getStock()) {
            throw new BadRequestException("Only " + product.getStock() + " items in stock");
        }

        if (item == null) {
            item = new CartItem();
            item.setUser(user);
            item.setProduct(product);
        }
        item.setQuantity(newQuantity);
        return cartItemRepository.save(item);
    }

    public List<CartItem> getCart(Long userId) {
        userService.getUserById(userId);
        return cartItemRepository.findByUserId(userId);
    }

    public BigDecimal getCartTotal(Long userId) {
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : getCart(userId)) {
            total = total.add(item.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        return total;
    }

    public CartItem updateQuantity(Long cartItemId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new BadRequestException("Quantity must be at least 1");
        }

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id " + cartItemId));

        if (quantity > item.getProduct().getStock()) {
            throw new BadRequestException("Only " + item.getProduct().getStock() + " items in stock");
        }
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeItem(Long cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new ResourceNotFoundException("Cart item not found with id " + cartItemId);
        }
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(Long userId) {
        userService.getUserById(userId);
        cartItemRepository.deleteByUserId(userId);
    }

    @Transactional
    public Order checkout(Long userId, String shippingAddress) {
        List<CartItem> cartItems = getCart(userId);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        List<OrderItemRequest> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItemRequest itemReq = new OrderItemRequest();
            itemReq.setProductId(cartItem.getProduct().getId());
            itemReq.setQuantity(cartItem.getQuantity());
            orderItems.add(itemReq);
        }

        OrderRequest request = new OrderRequest();
        request.setUserId(userId);
        request.setShippingAddress(shippingAddress);
        request.setItems(orderItems);

        Order order = orderService.placeOrder(request);
        cartItemRepository.deleteByUserId(userId);
        return order;
    }
}