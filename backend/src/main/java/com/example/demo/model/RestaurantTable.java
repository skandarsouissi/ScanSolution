package com.example.demo.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "tables")
public class RestaurantTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String qrUrl;
    @Lob
    @Column(name = "qr_code_base64", columnDefinition = "LONGTEXT")
    private String qrCodeBase64;


}