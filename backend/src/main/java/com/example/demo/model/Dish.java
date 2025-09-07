package com.example.demo.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "dishes")
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double price;

    private String imagePath;

    private String description;

    private String allergens;


    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private boolean isActive = true;
}
