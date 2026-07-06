package com.elipow.backend.controller;

import com.elipow.backend.dto.ApiResult;
import com.elipow.backend.dto.SaveProfileRequest;
import com.elipow.backend.entity.UserProfile;
import com.elipow.backend.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "用户画像")
@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @Operation(summary = "保存或更新用户画像")
    @PutMapping("/{id}/profile")
    public ApiResult<UserProfile> saveProfile(@PathVariable Long id,
                                               @RequestBody SaveProfileRequest request) {
        UserProfile profile = userProfileService.saveProfile(id, request);
        return ApiResult.ok(profile);
    }
}
