package com.elipow.backend.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class DbTestController {

    private final DataSource dataSource;

    public DbTestController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/api/db-test")
    public Map<String, Object> test() {
        Map<String, Object> result = new LinkedHashMap<>();
        try (var conn = dataSource.getConnection()) {
            result.put("connected", true);
            result.put("catalog", conn.getCatalog());

            // 测试查询 user 表
            try (var stmt = conn.createStatement();
                 var rs = stmt.executeQuery("SELECT COUNT(*) FROM `user`")) {
                rs.next();
                result.put("userCount", rs.getInt(1));
            }

            // 测试查询 knowledge_point 表
            try (var stmt = conn.createStatement();
                 var rs = stmt.executeQuery("SELECT COUNT(*) FROM `knowledge_point`")) {
                rs.next();
                result.put("knowledgePointCount", rs.getInt(1));
            }

            result.put("status", "ok");
        } catch (Exception e) {
            result.put("status", "error");
            result.put("error", e.getClass().getSimpleName() + ": " + e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/api/admin/reset-users")
    public Map<String, Object> resetUsers() {
        Map<String, Object> result = new LinkedHashMap<>();
        try (var conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);
            var stmt = conn.createStatement();

            // 按外键依赖顺序删除
            stmt.executeUpdate("DELETE FROM `user_favorite`");
            stmt.executeUpdate("DELETE FROM `user_action_log`");
            stmt.executeUpdate("DELETE FROM `learning_progress`");
            stmt.executeUpdate("DELETE FROM `qa_record`");
            stmt.executeUpdate("DELETE FROM `assessment`");
            stmt.executeUpdate("DELETE FROM `learning_path_recommendation`");
            stmt.executeUpdate("DELETE FROM `learning_path`");
            stmt.executeUpdate("DELETE FROM `user_profile`");
            int deleted = stmt.executeUpdate("DELETE FROM `user`");

            conn.commit();
            result.put("status", "ok");
            result.put("deletedUsers", deleted);
            result.put("message", "已清空所有用户数据，保留知识库和资源");
        } catch (Exception e) {
            result.put("status", "error");
            result.put("error", e.getMessage());
        }
        return result;
    }

    @PostMapping("/api/admin/migrate-estimated-hours")
    public Map<String, Object> migrateEstimatedHours() {
        Map<String, Object> result = new LinkedHashMap<>();
        try (var conn = dataSource.getConnection()) {
            var stmt = conn.createStatement();

            // 添加 estimated_hours 列（如果不存在）
            try {
                stmt.executeUpdate(
                    "ALTER TABLE `knowledge_point` ADD COLUMN `estimated_hours` DECIMAL(5,1) " +
                    "DEFAULT NULL COMMENT '预估学习时长(小时)' AFTER `sort_order`"
                );
            } catch (Exception ignored) { }

            // 按层级设置默认值：一级3h, 二级1.5h, 三级0.5h
            stmt.executeUpdate("UPDATE `knowledge_point` SET estimated_hours = 3.0 WHERE parent_id IS NULL");
            // 三级：叶子节点（自己被其他节点引用，但自己不是顶级）
            stmt.executeUpdate("UPDATE `knowledge_point` SET estimated_hours = 0.5 WHERE parent_id IS NOT NULL AND id NOT IN (SELECT p FROM (SELECT DISTINCT parent_id AS p FROM knowledge_point WHERE parent_id IS NOT NULL) t)");
            // 二级：非顶级非叶子
            stmt.executeUpdate("UPDATE `knowledge_point` SET estimated_hours = 1.5 WHERE estimated_hours IS NULL");

            result.put("status", "ok");
            result.put("message", "已设置 estimated_hours 默认值");
        } catch (Exception e) {
            result.put("status", "error");
            result.put("error", e.getMessage());
        }
        return result;
    }
}
