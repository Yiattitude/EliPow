package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("resource_knowledge")
public class ResourceKnowledge {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long resourceId;       // 资源ID

    private Long knowledgePointId; // 知识点ID
}
