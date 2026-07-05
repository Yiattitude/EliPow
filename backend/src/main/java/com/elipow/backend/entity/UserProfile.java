package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user_profile")
public class UserProfile {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;        // 用户ID

    private String grade;       // 年级: 大一/大二/大三/大四

    private String major;       // 专业方向: 电力系统/新能源/…

    private String target;      // 学习目标: 考研/就业/竞赛/…

    private String selfAssess;  // 自评描述

    private String abilityLevel; // 能力层级: BEGINNER/INTERMEDIATE/ADVANCED

    private String weakKnowledge; // 缺失知识点 (JSON 数组)

    private Boolean completed;  // 画像是否采集完成

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt; // 创建时间

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt; // 更新时间
}
