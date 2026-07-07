package com.elipow.backend.dto;

/**
 * 周计划中的单个学习项
 */
public class PlanItem {

    private Long knowledgePointId;
    private String name;
    private String description;
    private int estimatedMinutes;
    private String reason;      // 推荐原因：薄弱科目 / 前置基础
    private String status;      // PENDING | COMPLETED

    public Long getKnowledgePointId() { return knowledgePointId; }
    public void setKnowledgePointId(Long knowledgePointId) { this.knowledgePointId = knowledgePointId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(int estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
