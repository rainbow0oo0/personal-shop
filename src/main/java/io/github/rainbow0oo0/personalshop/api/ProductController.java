package io.github.rainbow0oo0.personalshop.api;

import io.github.rainbow0oo0.personalshop.dto.Product.CreateRequest;
import io.github.rainbow0oo0.personalshop.dto.Product.Response;
import io.github.rainbow0oo0.personalshop.dto.Product.UpdateRequest;
import io.github.rainbow0oo0.personalshop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public Response create(@Valid @RequestBody CreateRequest req) {
        return productService.create(req);
    }

    @GetMapping
    public List<Response> list() {
        return productService.list();
    }

    @GetMapping("/{id}")
    public Response get(@PathVariable Long id) {
        return productService.get(id);
    }

    @PutMapping("/{id}")
    public Response update(@PathVariable Long id, @Valid @RequestBody UpdateRequest req) {
        return productService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}