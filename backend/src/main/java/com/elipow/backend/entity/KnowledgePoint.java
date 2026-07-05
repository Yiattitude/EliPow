package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("knowledge_point")
public class KnowledgePoint {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;        // 知识点名称

    private String description; // 知识点描述

    private Long parentId;      // 父知识点ID (构建层级)

    private Integer sortOrder;  // 排序

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt; // 创建时间
}
