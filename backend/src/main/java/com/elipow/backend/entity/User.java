package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("`user`")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String email;    // 登录邮箱

    private String password; // BCrypt 加密

    private String nickname; // 昵称

    private String avatarUrl; // 头像URL

    private String role;     // 角色: STUDENT | ADMIN

    private Boolean enabled; // 是否启用

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt; // 创建时间

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt; // 更新时间
}
