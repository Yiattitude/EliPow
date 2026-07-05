package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("news")
public class News {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;       // 资讯标题

    private String summary;     // 摘要

    private String content;     // 正文

    private String url;         // 原文链接

    private String category;    // 分类

    private String source;      // 来源网站

    private LocalDateTime publishAt; // 发布时间

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt; // 创建时间
}
