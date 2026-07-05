package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("resource")
public class Resource {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;        // 资源标题

    private String description;  // 资源描述

    private String resourceType; // 类型: VIDEO/DOCUMENT/EXERCISE/BOOK/CASE/ARTICLE

    private String url;          // 外部链接

    private String content;      // 文本内容 (文档/习题等)

    private String coverUrl;     // 封面图URL

    private String difficulty;   // 难度: BEGINNER/INTERMEDIATE/ADVANCED

    private String source;       // 来源

    private Integer viewCount;   // 浏览次数

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt; // 创建时间

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt; // 更新时间
}
