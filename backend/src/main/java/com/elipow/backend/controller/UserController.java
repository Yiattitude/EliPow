package com.elipow.backend.controller;

import com.elipow.backend.dto.ApiResult;
import com.elipow.backend.entity.User;
import com.elipow.backend.entity.UserProfile;
import com.elipow.backend.mapper.UserMapper;
import com.elipow.backend.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@Tag(name = "用户")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserMapper userMapper;
    private final UserProfileService userProfileService;

    public UserController(UserMapper userMapper, UserProfileService userProfileService) {
        this.userMapper = userMapper;
        this.userProfileService = userProfileService;
    }

    @Operation(summary = "查询用户信息与画像状态")
    @GetMapping("/{id}")
    public ApiResult<Map<String, Object>> getUser(@PathVariable Long id) {
        User user = userMapper.findById(id);
        if (user == null) {
            return ApiResult.error(4040, "用户不存在");
        }

        UserProfile profile = userProfileService.getProfile(id);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", user.getId());
        result.put("email", user.getEmail());
        result.put("nickname", user.getNickname());
        result.put("role", user.getRole());
        result.put("hasProfile", profile != null && Boolean.TRUE.equals(profile.getCompleted()));

        if (profile != null) {
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("grade", profile.getGrade());
            p.put("target", profile.getTarget());
            p.put("abilityLevel", profile.getAbilityLevel());
            p.put("weakKnowledge", profile.getWeakKnowledge());
            result.put("profile", p);
        }

        return ApiResult.ok(result);
    }
}
