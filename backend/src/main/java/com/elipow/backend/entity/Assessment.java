package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("assessment")
public class Assessment {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;        // 用户ID

    private String title;       // 测评标题

    private BigDecimal score;   // 得分

    private String level;       // 评估层级

    private String detail;      // 测评详细结果 (JSON)

    private String status;      // 状态: PENDING | COMPLETED

    private LocalDateTime startedAt;   // 开始时间

    private LocalDateTime submittedAt; // 提交时间

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt; // 创建时间
}
