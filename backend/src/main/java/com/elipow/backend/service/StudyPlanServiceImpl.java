package com.elipow.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.elipow.backend.dto.PlanItem;
import com.elipow.backend.entity.KnowledgePoint;
import com.elipow.backend.entity.UserProfile;
import com.elipow.backend.mapper.KnowledgePointMapper;
import com.elipow.backend.mapper.UserProfileMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudyPlanServiceImpl implements StudyPlanService {

    private final KnowledgePointMapper knowledgePointMapper;
    private final UserProfileMapper userProfileMapper;
    private final ObjectMapper objectMapper;

    public StudyPlanServiceImpl(KnowledgePointMapper knowledgePointMapper,
                                 UserProfileMapper userProfileMapper,
                                 ObjectMapper objectMapper) {
        this.knowledgePointMapper = knowledgePointMapper;
        this.userProfileMapper = userProfileMapper;
        this.objectMapper = objectMapper;
    }

    @Override
    public List<PlanItem> generatePlan(Long userId, int timeBudget) {
        // 1. 获取所有知识点
        List<KnowledgePoint> allPoints = knowledgePointMapper.selectList(
                new QueryWrapper<KnowledgePoint>().orderByAsc("sort_order")
        );

        // 2. 构建层级映射
        Map<Long, KnowledgePoint> pointMap = allPoints.stream()
                .collect(Collectors.toMap(KnowledgePoint::getId, p -> p));

        // 3. 取每个点的预估耗时（从数据库 estimated_hours 字段读，转成分钟）
        Map<Long, Integer> estimatedMinutes = new HashMap<>();
        for (KnowledgePoint p : allPoints) {
            double hours = p.getEstimatedHours() != null ? p.getEstimatedHours().doubleValue() : 1.0;
            estimatedMinutes.put(p.getId(), (int) Math.round(hours * 60));
        }

        // 4. 获取用户薄弱科目
        Set<String> weakNames = getWeakKnowledgeNames(userId);
        Set<Long> weakIds = allPoints.stream()
                .filter(p -> weakNames.contains(p.getName()))
                .map(KnowledgePoint::getId)
                .collect(Collectors.toSet());

        // 5. 构建排序后的计划
        Set<Long> added = new HashSet<>();
        List<PlanItem> plan = new ArrayList<>();

        // 5a. 先加薄弱科目的前置依赖（复习用）
        for (Long weakId : weakIds) {
            addPrerequisites(weakId, pointMap, estimatedMinutes, added, plan, "前置基础");
        }

        // 5b. 再加薄弱科目本身（重点攻克）
        for (Long weakId : weakIds) {
            if (added.contains(weakId)) continue;
            addPlanItem(weakId, pointMap, estimatedMinutes, added, plan, "薄弱科目");
        }

        // 5c. 如果还有余量，加其他同级科目
        if (getTotalMinutes(plan) < timeBudget) {
            for (KnowledgePoint p : allPoints) {
                if (p.getParentId() == null && !added.contains(p.getId())
                        && getTotalMinutes(plan) + estimatedMinutes.getOrDefault(p.getId(), 60) <= timeBudget) {
                    addPlanItem(p.getId(), pointMap, estimatedMinutes, added, plan, "拓展学习");
                }
            }
        }

        return plan;
    }

    @Override
    public List<PlanItem> getCurrentPlan(Long userId) {
        // 从 user_profile 的 weekly_plan 读取（简化版：每次都重新算）
        return generatePlan(userId, 600); // 默认 10h
    }

    // ===== 私有方法 =====

    private void addPrerequisites(Long pointId, Map<Long, KnowledgePoint> pointMap,
                                   Map<Long, Integer> estimated, Set<Long> added,
                                   List<PlanItem> plan, String reason) {
        KnowledgePoint point = pointMap.get(pointId);
        if (point == null || point.getParentId() == null) return;
        Long parentId = point.getParentId();
        if (!added.contains(parentId)) {
            addPrerequisites(parentId, pointMap, estimated, added, plan, reason);
            addPlanItem(parentId, pointMap, estimated, added, plan, reason);
        }
    }

    private void addPlanItem(Long pointId, Map<Long, KnowledgePoint> pointMap,
                              Map<Long, Integer> estimated, Set<Long> added,
                              List<PlanItem> plan, String reason) {
        if (added.contains(pointId)) return;
        added.add(pointId);
        KnowledgePoint p = pointMap.get(pointId);
        if (p == null) return;

        PlanItem item = new PlanItem();
        item.setKnowledgePointId(p.getId());
        item.setName(p.getName());
        item.setDescription(p.getDescription());
        item.setEstimatedMinutes(estimated.getOrDefault(p.getId(), 60));
        item.setReason(reason);
        item.setStatus("PENDING");
        plan.add(item);
    }

    private int getTotalMinutes(List<PlanItem> plan) {
        return plan.stream().mapToInt(PlanItem::getEstimatedMinutes).sum();
    }

    private Set<String> getWeakKnowledgeNames(Long userId) {
        QueryWrapper<UserProfile> qw = new QueryWrapper<>();
        qw.eq("user_id", userId);
        UserProfile profile = userProfileMapper.selectOne(qw);
        if (profile == null || profile.getWeakKnowledge() == null) return Collections.emptySet();

        try {
            List<String> list = objectMapper.readValue(profile.getWeakKnowledge(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
            return new HashSet<>(list);
        } catch (JsonProcessingException e) {
            return Collections.emptySet();
        }
    }
}
