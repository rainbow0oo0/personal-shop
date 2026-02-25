package io.github.rainbow0oo0.personalshop.repository;

import io.github.rainbow0oo0.personalshop.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}