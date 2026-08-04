package com.funkofabs.service;

import com.funkofabs.entity.Product;
import com.funkofabs.repository.ProductRepository;
import com.funkofabs.dto.ProductRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> findAll() {
        List<Product> products = productRepository.findAll();
        return products;
    }

    public List<Product> search(String q) {
        return productRepository.findByNameContainingIgnoreCase(q);
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    public Product create(ProductRequest r) {
        Product product = Product.builder()
                .name(r.getName())
                .description(r.getDescription())
                .price(r.getPrice())
                .imageUrl(r.getImageUrl())
                .stock(r.getStock() != null ? r.getStock() : 0)
                .build();

        return productRepository.save(product);
    }

    public Product update(Long id, ProductRequest r) {
        Product product = findById(id);

        product.setName(r.getName());
        product.setDescription(r.getDescription());
        product.setPrice(r.getPrice());
        product.setImageUrl(r.getImageUrl());

        if (r.getStock() != null) {
            product.setStock(r.getStock());
        }

        return productRepository.save(product);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}