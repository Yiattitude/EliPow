package com.elipow.backend.service;

import com.elipow.backend.dto.AuthResponse;
import com.elipow.backend.dto.LoginRequest;
import com.elipow.backend.dto.RegisterRequest;
import com.elipow.backend.entity.User;
import com.elipow.backend.mapper.UserMapper;
import com.elipow.backend.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userMapper.findByEmail(request.getEmail());
        if (user == null) {
            throw new RuntimeException("邮箱未注册");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        return buildAuthResponse(user);
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userMapper.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("邮箱已被注册");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setNickname(request.getNickname());
        user.setRole("STUDENT");
        user.setEnabled(true);

        userMapper.register(user);

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtUtil.generate(user.getId(), user.getEmail(), user.getRole());
        AuthResponse resp = new AuthResponse();
        resp.setId(user.getId());
        resp.setEmail(user.getEmail());
        resp.setNickname(user.getNickname());
        resp.setRole(user.getRole());
        resp.setToken(token);
        return resp;
    }
}
