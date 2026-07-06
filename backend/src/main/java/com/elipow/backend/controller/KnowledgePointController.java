package com.elipow.backend.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.elipow.backend.dto.ApiResult;
import com.elipow.backend.entity.KnowledgePoint;
import com.elipow.backend.mapper.KnowledgePointMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "知识点")
@RestController
@RequestMapping("/api/knowledge-points")
public class KnowledgePointController {

    private final KnowledgePointMapper knowledgePointMapper;

    public KnowledgePointController(KnowledgePointMapper knowledgePointMapper) {
        this.knowledgePointMapper = knowledgePointMapper;
    }

    @Operation(summary = "获取全部知识点列表（供画像选择）")
    @GetMapping
    public ApiResult<List<KnowledgePoint>> listAll() {
        QueryWrapper<KnowledgePoint> qw = new QueryWrapper<>();
        qw.orderByAsc("sort_order");
        return ApiResult.ok(knowledgePointMapper.selectList(qw));
    }
}
