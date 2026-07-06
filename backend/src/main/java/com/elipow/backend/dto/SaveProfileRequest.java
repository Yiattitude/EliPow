package com.elipow.backend.dto;

import java.util.List;

/**
 * 用户画像保存请求
 */
public class SaveProfileRequest {

    private String grade;
    private String target;
    private String abilityLevel;
    private List<String> weakKnowledge;

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getTarget() { return target; }
    public void setTarget(String target) { this.target = target; }

    public String getAbilityLevel() { return abilityLevel; }
    public void setAbilityLevel(String abilityLevel) { this.abilityLevel = abilityLevel; }

    public List<String> getWeakKnowledge() { return weakKnowledge; }
    public void setWeakKnowledge(List<String> weakKnowledge) { this.weakKnowledge = weakKnowledge; }
}
