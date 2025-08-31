package com.example.demo.dto;


import lombok.Data;

@Data
public class DishDTO {
    private Long id;
    private String name;
    private double price;
    private String imagePath;
    private String description;
    private String allergens;
    private Long categoryId;
    private boolean isActive=true;
}