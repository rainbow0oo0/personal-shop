package io.github.rainbow0oo0.personalshop.dto.Product;

import io.github.rainbow0oo0.personalshop.domain.Product;

public record Response(
        Long id,
        String name,
        int price,
        int stock
) {
    public static Response from(Product p) {
        return new Response(p.getId(), p.getName(), p.getPrice(), p.getStock());

    }
}
