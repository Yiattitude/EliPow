package com.elipow.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.elipow.backend.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {

    int register(User user);

    User findByEmail(String email);

    User findById(Long id);
}
