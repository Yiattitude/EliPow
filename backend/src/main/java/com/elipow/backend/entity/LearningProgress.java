package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("learning_progress")
public class LearningProgress {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;           // 用户ID

    private Long knowledgePointId; // 知识点ID

    private String status;         // 状态: NOT_STARTED | IN_PROGRESS | COMPLETED

    private LocalDateTime completedAt; // 完成时间

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt; // 创建时间

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt; // 更新时间
}
