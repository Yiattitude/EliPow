package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user_action_log")
public class UserActionLog {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;       // 用户ID

    private String actionType; // 行为类型: VIEW_RESOURCE | COMPLETE_EXERCISE | ASK_QUESTION | …

    private String targetType; // 目标类型: resource | assessment | qa | …

    private Long targetId;     // 目标ID

    private String detail;     // 扩展信息 (JSON)

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt; // 行为时间
}
