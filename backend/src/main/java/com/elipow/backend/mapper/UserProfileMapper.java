package com.elipow.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.elipow.backend.entity.UserProfile;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserProfileMapper extends BaseMapper<UserProfile> {
}
