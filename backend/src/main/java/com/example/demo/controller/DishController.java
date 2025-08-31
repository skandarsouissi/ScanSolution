package com.example.demo.controller;


import com.example.demo.dto.DishDTO;
import com.example.demo.service.DishService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/dishes")
public class DishController {
    private final DishService dishService;

    public DishController(DishService dishService) {
        this.dishService = dishService;
    }

    @GetMapping
    public ResponseEntity<List<DishDTO>> getAllDishes() {
        List<DishDTO> dishes = dishService.getAllDishes();
        return ResponseEntity.ok(dishes);
    }

    @GetMapping("/active")
    public ResponseEntity<List<DishDTO>> getActiveDishes() {
        List<DishDTO> dishes = dishService.getActiveDishes();
        return ResponseEntity.ok(dishes);
    }
    @PostMapping(consumes = "application/json")
    public ResponseEntity<DishDTO> createDish(@RequestBody DishDTO dishDTO) throws IOException {
        DishDTO createdDish = dishService.createDish(dishDTO, null);
        return ResponseEntity.ok(createdDish);
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<DishDTO> createDishWithImage(
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "allergens", required = false) String allergens,
            @RequestParam(value = "isActive", defaultValue = "true") boolean isActive,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        DishDTO dishDTO = new DishDTO();
        dishDTO.setName(name);
        dishDTO.setPrice(price);
        dishDTO.setCategoryId(categoryId);
        dishDTO.setDescription(description);
        dishDTO.setAllergens(allergens);
        dishDTO.setActive(isActive);

        DishDTO createdDish = dishService.createDish(dishDTO, image);
        return ResponseEntity.ok(createdDish);
    }


    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<DishDTO>> getDishesByCategory(@PathVariable Long categoryId) {
        List<DishDTO> dishes = dishService.getDishesByCategory(categoryId);
        return ResponseEntity.ok(dishes);
    }

    @GetMapping("/search")
    public ResponseEntity<List<DishDTO>> searchDishes(@RequestParam(required = false) String query) {
        if (query == null || query.isBlank()) {
            // retourne tous les plats actifs si aucun query fourni
            return ResponseEntity.ok(dishService.getActiveDishes());
        }
        List<DishDTO> dishes = dishService.searchDishes(query);
        return ResponseEntity.ok(dishes);
    }
    @GetMapping("/{id}")
    public ResponseEntity<DishDTO> getDishById(@PathVariable Long id) {
        DishDTO dish = dishService.getDishById(id);
        return ResponseEntity.ok(dish);
    }



    @PutMapping("/{id}")
    public ResponseEntity<DishDTO> updateDish(
            @PathVariable Long id,
            @RequestPart DishDTO dishDTO,
            @RequestPart(required = false) MultipartFile image) throws IOException {
        DishDTO updatedDish = dishService.updateDish(id, dishDTO, image);
        return ResponseEntity.ok(updatedDish);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long id) {
        dishService.deleteDish(id);
        return ResponseEntity.noContent().build();
    }
}