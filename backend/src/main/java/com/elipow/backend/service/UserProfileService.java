package com.elipow.backend.service;

import com.elipow.backend.dto.SaveProfileRequest;
import com.elipow.backend.entity.UserProfile;

public interface UserProfileService {
    UserProfile getProfile(Long userId);
    UserProfile saveProfile(Long userId, SaveProfileRequest request);
    boolean hasProfile(Long userId);
}
