package com.elipow.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.elipow.backend.dto.SaveProfileRequest;
import com.elipow.backend.entity.UserProfile;
import com.elipow.backend.mapper.UserProfileMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileMapper userProfileMapper;
    private final ObjectMapper objectMapper;

    public UserProfileServiceImpl(UserProfileMapper userProfileMapper, ObjectMapper objectMapper) {
        this.userProfileMapper = userProfileMapper;
        this.objectMapper = objectMapper;
    }

    @Override
    public UserProfile getProfile(Long userId) {
        QueryWrapper<UserProfile> qw = new QueryWrapper<>();
        qw.eq("user_id", userId);
        return userProfileMapper.selectOne(qw);
    }

    @Override
    public UserProfile saveProfile(Long userId, SaveProfileRequest request) {
        UserProfile existing = getProfile(userId);

        String json = null;
        if (request.getWeakKnowledge() != null && !request.getWeakKnowledge().isEmpty()) {
            try {
                json = objectMapper.writeValueAsString(request.getWeakKnowledge());
            } catch (JsonProcessingException e) {
                throw new RuntimeException("薄弱知识点格式错误");
            }
        }

        if (existing != null) {
            UpdateWrapper<UserProfile> uw = new UpdateWrapper<>();
            uw.eq("user_id", userId);
            uw.set("grade", request.getGrade());
            uw.set("target", request.getTarget());
            uw.set("ability_level", request.getAbilityLevel());
            uw.set("weak_knowledge", json);
            uw.set("completed", true);
            userProfileMapper.update(uw);
            return getProfile(userId);
        } else {
            UserProfile profile = new UserProfile();
            profile.setUserId(userId);
            profile.setGrade(request.getGrade());
            profile.setTarget(request.getTarget());
            profile.setAbilityLevel(request.getAbilityLevel());
            profile.setWeakKnowledge(json);
            profile.setCompleted(true);
            userProfileMapper.insert(profile);
            return profile;
        }
    }

    @Override
    public boolean hasProfile(Long userId) {
        UserProfile profile = getProfile(userId);
        return profile != null && Boolean.TRUE.equals(profile.getCompleted());
    }
}
