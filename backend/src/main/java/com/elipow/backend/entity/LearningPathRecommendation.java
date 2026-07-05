package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("learning_path_recommendation")
public class LearningPathRecommendation {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;         // 用户ID

    private String currentStage; // 当前阶段

    private String nextSteps;    // 下一步建议 (JSON)

    private String weeklyPlan;   // 每周计划 (JSON)

    private Boolean isActive;    // 是否生效

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt; // 创建时间
}
