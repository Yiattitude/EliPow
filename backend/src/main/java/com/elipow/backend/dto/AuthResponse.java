package com.elipow.backend.dto;

public class AuthResponse {
    private Long id;
    private String email;
    private String nickname;
    private String role;
    private String token;
    private boolean hasProfile;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isHasProfile() { return hasProfile; }
    public void setHasProfile(boolean hasProfile) { this.hasProfile = hasProfile; }
}
