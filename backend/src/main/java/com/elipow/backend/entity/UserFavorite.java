package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user_favorite")
public class UserFavorite {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;     // 用户ID

    private Long resourceId; // 资源ID

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt; // 收藏时间
}
