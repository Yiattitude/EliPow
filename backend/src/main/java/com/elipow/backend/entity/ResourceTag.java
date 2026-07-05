package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("resource_tag")
public class ResourceTag {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long resourceId; // 资源ID

    private String tag;      // 标签
}
