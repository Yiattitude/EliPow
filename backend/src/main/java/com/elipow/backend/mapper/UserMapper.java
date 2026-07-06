package com.elipow.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.elipow.backend.entity.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper extends BaseMapper<User> {

    @Insert("INSERT INTO `user` (email, password, nickname, role) " +
            "VALUES (#{email}, #{password}, #{nickname}, COALESCE(#{role}, 'STUDENT'))")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int register(User user);

    @Select("SELECT id, email, password, nickname, avatar_url, role, enabled, created_at, updated_at " +
            "FROM `user` WHERE email = #{email}")
    @Results({
        @Result(column = "avatar_url", property = "avatarUrl"),
        @Result(column = "created_at", property = "createdAt"),
        @Result(column = "updated_at", property = "updatedAt")
    })
    User findByEmail(String email);

    @Select("SELECT id, email, password, nickname, avatar_url, role, enabled, created_at, updated_at " +
            "FROM `user` WHERE id = #{id}")
    @Results({
        @Result(column = "avatar_url", property = "avatarUrl"),
        @Result(column = "created_at", property = "createdAt"),
        @Result(column = "updated_at", property = "updatedAt")
    })
    User findById(Long id);
}
