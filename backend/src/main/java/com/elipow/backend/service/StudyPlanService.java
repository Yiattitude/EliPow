package com.elipow.backend.service;

import com.elipow.backend.dto.PlanItem;

import java.util.List;

public interface StudyPlanService {

    /**
     * 生成本周学习计划
     * @param userId      用户ID
     * @param timeBudget  本周可用总时长（分钟）
     * @return 计划项列表
     */
    List<PlanItem> generatePlan(Long userId, int timeBudget);

    /**
     * 获取当前周计划
     */
    List<PlanItem> getCurrentPlan(Long userId);
}
