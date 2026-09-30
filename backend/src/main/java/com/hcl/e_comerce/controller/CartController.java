package com.hcl.e_comerce.controller;

import com.hcl.e_comerce.entity.CartItem;
import com.hcl.e_comerce.entity.Order;
import com.hcl.e_comerce.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/{userId}/add")
    public CartItem addToCart(@PathVariable Long userId,
                              @RequestParam Long productId,
                              @RequestParam(defaultValue = "1") Integer quantity) {
        return cartService.addToCart(userId, productId, quantity);
    }

    @GetMapping("/{userId}")
    public Map<String, Object> getCart(@PathVariable Long userId) {
        List<CartItem> items = cartService.getCart(userId);
        return Map.of(
                "items", items,
                "totalItems", items.size(),
                "totalAmount", cartService.getCartTotal(userId)
        );
    }

    @PutMapping("/item/{cartItemId}")
    public CartItem updateQuantity(@PathVariable Long cartItemId,
                                   @RequestParam Integer quantity) {
        return cartService.updateQuantity(cartItemId, quantity);
    }

    @DeleteMapping("/item/{cartItemId}")
    public String removeItem(@PathVariable Long cartItemId) {
        cartService.removeItem(cartItemId);
        return "Item removed from cart";
    }

    @DeleteMapping("/{userId}/clear")
    public String clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return "Cart cleared";
    }

    @PostMapping("/{userId}/checkout")
    public Order checkout(@PathVariable Long userId,
                          @RequestBody Map<String, String> body) {
        return cartService.checkout(userId, body.get("shippingAddress"));
    }
}