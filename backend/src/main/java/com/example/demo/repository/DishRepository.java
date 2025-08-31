package com.example.demo.repository;



import com.example.demo.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByCategoryIdAndIsActive(Long categoryId, boolean isActive);
    List<Dish> findByIsActive(boolean isActive);

    @Query("SELECT d FROM Dish d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) AND d.isActive = true")
    List<Dish> searchActiveDishes(String query);
}