package com.elipow.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("qa_record")
public class QaRecord {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;      // 提问用户ID

    private String question;  // 问题

    private String answer;    // 回答

    private String sources;   // 引用来源 (JSON 数组)

    private Boolean satisfied; // 用户满意度

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt; // 提问时间
}
