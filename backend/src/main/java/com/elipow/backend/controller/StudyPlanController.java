package com.elipow.backend.controller;

import com.elipow.backend.dto.ApiResult;
import com.elipow.backend.dto.PlanItem;
import com.elipow.backend.service.StudyPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "学习计划")
@RestController
@RequestMapping("/api/study-plan")
public class StudyPlanController {

    private final StudyPlanService studyPlanService;

    public StudyPlanController(StudyPlanService studyPlanService) {
        this.studyPlanService = studyPlanService;
    }

    @Operation(summary = "生成本周学习计划")
    @PostMapping("/generate")
    public ApiResult<Map<String, Object>> generate(@RequestParam Long userId,
                                                    @RequestParam int timeBudget) {
        List<PlanItem> items = studyPlanService.generatePlan(userId, timeBudget);
        int totalMinutes = items.stream().mapToInt(PlanItem::getEstimatedMinutes).sum();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("items", items);
        result.put("totalMinutes", totalMinutes);
        result.put("timeBudget", timeBudget);
        return ApiResult.ok(result);
    }

    @Operation(summary = "获取当前周计划")
    @GetMapping("/current")
    public ApiResult<Map<String, Object>> getCurrent(@RequestParam Long userId) {
        List<PlanItem> items = studyPlanService.getCurrentPlan(userId);
        int totalMinutes = items.stream().mapToInt(PlanItem::getEstimatedMinutes).sum();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("items", items);
        result.put("totalMinutes", totalMinutes);
        return ApiResult.ok(result);
    }
}
