package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("news_tag")
public class NewsTag {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long newsId; // 资讯ID

    private String tag;  // 标签
}
