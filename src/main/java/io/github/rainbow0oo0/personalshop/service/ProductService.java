package io.github.rainbow0oo0.personalshop.service;

import io.github.rainbow0oo0.personalshop.domain.Product;
import io.github.rainbow0oo0.personalshop.dto.Product.CreateRequest;
import io.github.rainbow0oo0.personalshop.dto.Product.Response;
import io.github.rainbow0oo0.personalshop.dto.Product.UpdateRequest;
import io.github.rainbow0oo0.personalshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional
    public Response create(CreateRequest req) {
        Product saved = productRepository.save(new Product(req.name(), req.price(), req.stock()));
        return Response.from(saved);
    }

    public List<Response> list() {
        return productRepository.findAll().stream()
                .map(Response::from)
                .toList();
    }

    public Response get(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다. id=" + id));
        return Response.from(product);
    }

    @Transactional
    public Response update(Long id, UpdateRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다. id=" + id));

        product.update(req.name(), req.price(), req.stock());
        return Response.from(product);
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("상품이 존재하지 않습니다. id=" + id);
        }
        productRepository.deleteById(id);
    }
}