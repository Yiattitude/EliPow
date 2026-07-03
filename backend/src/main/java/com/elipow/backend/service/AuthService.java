package com.elipow.backend.service;

import com.elipow.backend.dto.AuthResponse;
import com.elipow.backend.dto.LoginRequest;
import com.elipow.backend.dto.RegisterRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);
}
