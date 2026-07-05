package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("learning_path")
public class LearningPath {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;        // 用户ID

    private String stage;       // 阶段标识

    private String stageName;   // 阶段名称

    private String description; // 阶段描述

    private Integer sortOrder;  // 阶段排序

    private String status;      // 状态: ACTIVE | COMPLETED | LOCKED

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt; // 创建时间
}
