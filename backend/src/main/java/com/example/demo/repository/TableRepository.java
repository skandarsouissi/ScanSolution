package com.example.demo.repository;


import com.example.demo.model.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TableRepository extends JpaRepository<RestaurantTable, Long> {
    Optional<RestaurantTable> findByCode(String code);
    boolean existsByCode(String code);
}