package com.eyecare.config;

import com.eyecare.model.Product;
import com.eyecare.model.Role;
import com.eyecare.repository.ProductRepository;
import com.eyecare.service.UserService;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(UserService userService, ProductRepository productRepository) {
        return args -> {
            if (!userService.existsByEmail("admin@eyecare.com")) {
                userService.createUser(
                    "System Admin",
                    "admin@eyecare.com",
                    "admin123",
                    "0900000000",
                    "Ho Chi Minh City",
                    Role.ADMIN
                );
            }

            if (productRepository.count() == 0) {
                productRepository.save(buildProduct(
                    "Kính Titan Pro X1",
                    "Gọng titan siêu nhẹ cho nam, chống gỉ, phù hợp đi làm.",
                    new BigDecimal("1290000"),
                    new BigDecimal("1590000"),
                    "men",
                    "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
                    30
                ));

                productRepository.save(buildProduct(
                    "Kính Gentle Gold",
                    "Thiết kế thanh lịch cho nữ, tròng chống ánh sáng xanh.",
                    new BigDecimal("1190000"),
                    new BigDecimal("1490000"),
                    "women",
                    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371",
                    25
                ));

                productRepository.save(buildProduct(
                    "Kính Kids Flex",
                    "Khung dẻo cho trẻ em, bền và nhẹ.",
                    new BigDecimal("690000"),
                    new BigDecimal("790000"),
                    "kids",
                    "https://images.unsplash.com/photo-1591076482161-42ce6da69f67",
                    40
                ));
            }
        };
    }

    private Product buildProduct(
        String name,
        String description,
        BigDecimal price,
        BigDecimal oldPrice,
        String category,
        String imageUrl,
        int stock
    ) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setPrice(price);
        p.setOldPrice(oldPrice);
        p.setCategory(category);
        p.setImageUrl(imageUrl);
        p.setStock(stock);
        p.setActive(true);
        return p;
    }
}
