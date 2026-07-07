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

/**
 * 动态周计划生成服务
 *
 * 核心逻辑：
 * 1. 获取用户的薄弱科目（从 UserProfile 中读取）
 * 2. 按"前置基础 → 薄弱科目 → 拓展学习"的优先级排列
 * 3. 在时间预算内截取任务序列
 * 4. 每个任务的预估耗时来自 knowledge_point.estimated_hours 字段
 */
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
        // 第一步：查询所有知识点，按 sort_order 排序
        List<KnowledgePoint> allPoints = knowledgePointMapper.selectList(
                new QueryWrapper<KnowledgePoint>().orderByAsc("sort_order")
        );

        // 第二步：构建知识点 ID → 对象的映射，供快速查找
        Map<Long, KnowledgePoint> pointMap = allPoints.stream()
                .collect(Collectors.toMap(KnowledgePoint::getId, p -> p));

        // 第三步：读取数据库中的 estimated_hours，换算成分钟
        Map<Long, Integer> estimatedMinutes = new HashMap<>();
        for (KnowledgePoint p : allPoints) {
            double hours = p.getEstimatedHours() != null ? p.getEstimatedHours().doubleValue() : 1.0;
            estimatedMinutes.put(p.getId(), (int) Math.round(hours * 60));
        }

        // 第四步：获取用户在 Onboarding 时标记的薄弱科目名称
        Set<String> weakNames = getWeakKnowledgeNames(userId);
        // 把薄弱科目名称映射为知识点 ID
        Set<Long> weakIds = allPoints.stream()
                .filter(p -> weakNames.contains(p.getName()))
                .map(KnowledgePoint::getId)
                .collect(Collectors.toSet());

        // 第五步：按优先级排序生成计划
        Set<Long> added = new HashSet<>();  // 记录已加入计划的知识点 ID，避免重复
        List<PlanItem> plan = new ArrayList<>();

        // 5a. 优先加入薄弱科目的前置依赖知识点（复习用）
        // 递归查找父节点，确保基础先学
        for (Long weakId : weakIds) {
            addPrerequisites(weakId, pointMap, estimatedMinutes, added, plan, "前置基础");
        }

        // 5b. 再加入薄弱科目本身（重点攻克）
        for (Long weakId : weakIds) {
            if (added.contains(weakId)) continue;
            addPlanItem(weakId, pointMap, estimatedMinutes, added, plan, "薄弱科目");
        }

        // 5c. 如果时间预算还有剩余，补充其他同级课程
        if (getTotalMinutes(plan) < timeBudget) {
            for (KnowledgePoint p : allPoints) {
                // 只追加顶级课程（parentId == null），且不超过时间预算
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
        // 简化版：每次重新计算。后续可改为从数据库读取已持久化的周计划
        return generatePlan(userId, 600); // 默认每周 10 小时
    }

    // ===== 私有工具方法 =====

    /**
     * 递归添加某知识点的所有前置依赖（父节点）
     * 保证"先复习基础，再攻克薄弱"的学习顺序
     */
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

    /**
     * 将一个知识点包装为 PlanItem 并加入计划列表
     */
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

    /**
     * 计算计划总耗时（分钟）
     */
    private int getTotalMinutes(List<PlanItem> plan) {
        return plan.stream().mapToInt(PlanItem::getEstimatedMinutes).sum();
    }

    /**
     * 从用户画像中解析薄弱科目名称列表
     * weak_knowledge 字段为 JSON 数组格式：["电机学", "继电保护"]
     */
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
