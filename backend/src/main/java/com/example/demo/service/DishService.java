package com.example.demo.service;

import com.example.demo.dto.DishDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.DishMapper;
import com.example.demo.model.Category;
import com.example.demo.model.Dish;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.DishRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DishService {
    private final DishRepository dishRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public DishService(DishRepository dishRepository, CategoryRepository categoryRepository,    UserRepository userRepository) {
        this.dishRepository = dishRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository=userRepository;
    }

    public List<DishDTO> getAllDishes() {
        return dishRepository.findAll().stream()
                .map(DishMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }


    public List<DishDTO> getActiveDishes() {
        return dishRepository.findByIsActive(true).stream()
                .map(DishMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    public List<DishDTO> getDishesByCategory(Long categoryId) {
        return dishRepository.findByCategoryIdAndIsActive(categoryId, true).stream()
                .map(DishMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    public List<DishDTO> searchDishes(String query) {
        return dishRepository.searchActiveDishes(query).stream()
                .map(DishMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    public DishDTO getDishById(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + id));
        return DishMapper.INSTANCE.toDto(dish);
    }

    public DishDTO createDish(DishDTO dishDTO, MultipartFile imageFile) throws IOException {
        Category category = categoryRepository.findById(dishDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dishDTO.getCategoryId()));

        Dish dish = DishMapper.INSTANCE.toEntity(dishDTO);
        dish.setCategory(category);

        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile);
            dish.setImagePath(imagePath);
        }

        Dish savedDish = dishRepository.save(dish);
        return DishMapper.INSTANCE.toDto(savedDish);
    }

    public DishDTO updateDish(Long id, DishDTO dishDTO, MultipartFile imageFile) throws IOException {
        Dish existingDish = dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + id));

        Category category = categoryRepository.findById(dishDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dishDTO.getCategoryId()));

        existingDish.setName(dishDTO.getName());
        existingDish.setPrice(dishDTO.getPrice());
        existingDish.setDescription(dishDTO.getDescription());
        existingDish.setAllergens(dishDTO.getAllergens());
        existingDish.setCategory(category);
        existingDish.setActive(dishDTO.isActive());

        if (imageFile != null && !imageFile.isEmpty()) {
            // Supprimer l’ancienne image si elle existe
            if (existingDish.getImagePath() != null && !existingDish.getImagePath().isBlank()) {
                String relativePath = existingDish.getImagePath().startsWith("/")
                        ? existingDish.getImagePath().substring(1)
                        : existingDish.getImagePath();

                Path oldImagePath = Paths.get("C:/Users/SERVTECH/Desktop/Backend Spring/demo", relativePath);
                try {
                    Files.deleteIfExists(oldImagePath);
                } catch (IOException e) {
                    System.err.println("Impossible de supprimer l'ancienne image : " + e.getMessage());
                }
            }

            // Sauvegarder la nouvelle image
            String imagePath = saveImage(imageFile);
            existingDish.setImagePath(imagePath);
        }

        Dish updatedDish = dishRepository.save(existingDish);
        return DishMapper.INSTANCE.toDto(updatedDish);
    }

    public void deleteDish(Long id) {
        if (!dishRepository.existsById(id)) {
            throw new ResourceNotFoundException("Dish not found with id: " + id);
        }
        dishRepository.deleteById(id);
    }


    private String saveImage(MultipartFile imageFile) throws IOException {
        String uploadDir = "C:/Users/SERVTECH/Desktop/Backend Spring/demo/uploads/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = imageFile.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IOException("Nom de fichier invalide");
        }

        // Remplacer tous les caractères non alphanumériques par des underscores
        String cleanedFilename = originalFilename.replaceAll("[^a-zA-Z0-9\\.]", "_");

        // Préfixe avec timestamp
        String fileName = System.currentTimeMillis() + "_" + cleanedFilename;

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + fileName;
    }
}
