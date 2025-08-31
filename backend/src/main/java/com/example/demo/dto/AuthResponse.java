package com.example.demo.dto;

public class AuthResponse {
    private String token;
    private String role;

    // Constructor with both fields
    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    // Setters (optional)
    public void setToken(String token) {
        this.token = token;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
