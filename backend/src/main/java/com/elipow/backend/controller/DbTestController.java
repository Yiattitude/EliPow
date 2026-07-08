package com.elipow.backend.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.sql.DataSource;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class DbTestController {

    private final DataSource dataSource;
    private final PasswordEncoder passwordEncoder;

    public DbTestController(DataSource dataSource, PasswordEncoder passwordEncoder) {
        this.dataSource = dataSource;
        this.passwordEncoder = passwordEncoder;
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

    @PostMapping("/api/admin/fix-test-users")
    public Map<String, Object> fixTestUsers() {
        Map<String, Object> result = new LinkedHashMap<>();
        try (var conn = dataSource.getConnection()) {
            var stmt = conn.createStatement();
            stmt.executeUpdate("DELETE FROM `user_favorite`");
            stmt.executeUpdate("DELETE FROM `user_action_log`");
            stmt.executeUpdate("DELETE FROM `learning_progress`");
            stmt.executeUpdate("DELETE FROM `qa_record`");
            stmt.executeUpdate("DELETE FROM `assessment`");
            stmt.executeUpdate("DELETE FROM `learning_path_recommendation`");
            stmt.executeUpdate("DELETE FROM `learning_path`");
            stmt.executeUpdate("DELETE FROM `user_profile`");

            String hash = passwordEncoder.encode("123456");
            stmt.executeUpdate("INSERT INTO `user`(id,email,password,nickname,role) VALUES(1,'zhangsan@test.com','" + hash + "','张三','STUDENT')");
            stmt.executeUpdate("INSERT INTO `user`(id,email,password,nickname,role) VALUES(2,'lisi@test.com','" + hash + "','李四','STUDENT')");
            stmt.executeUpdate("INSERT INTO `user`(id,email,password,nickname,role) VALUES(3,'admin@elipow.com','" + hash + "','管理员','ADMIN')");
            stmt.executeUpdate("INSERT INTO `user_profile`(user_id,grade,major,target,ability_level,weak_knowledge,completed) VALUES(1,'大三','电力系统及其自动化','考研','INTERMEDIATE','[\"电力系统故障分析\",\"电机学\"]',1)");
            stmt.executeUpdate("INSERT INTO `user_profile`(user_id,grade,major,target,ability_level,weak_knowledge,completed) VALUES(2,'大二','新能源科学与工程','就业','BEGINNER','[\"电路分析\",\"电磁场\"]',1)");

            result.put("status", "ok");
            result.put("message", "已重置测试用户密码为123456");
        } catch (Exception e) {
            result.put("status", "error");
            result.put("error", e.getMessage());
        }
        return result;
    }
}
