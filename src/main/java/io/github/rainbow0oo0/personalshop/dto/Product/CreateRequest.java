package io.github.rainbow0oo0.personalshop.dto.Product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateRequest(
    @NotBlank(message = "상품명은 필수입니다.")
    String name,

    @Min(value = 0, message = "가격은 0 이상이어야 합니다.")
    int price,

    @Min(value = 0, message = "재고는 0 이상이어야 합니다.")
    int stock
) {
}