-- ============================================================
-- db2.sql — 存储过程（8 个 sp_*）
-- 用途: 用户注册/登录、学习总览、进度更新、资源推荐、
--       路径进度统计、行为日志、学习统计概览
-- ============================================================

USE elipow;

DELIMITER //

-- ============================================================
-- 1. 用户注册（含邮箱查重）
-- ============================================================
CREATE PROCEDURE sp_register_user(
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_nickname VARCHAR(50),
    OUT p_user_id BIGINT,
    OUT p_code INT,
    OUT p_msg VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_code = 5000;
        SET p_msg = '注册失败';
    END;

    START TRANSACTION;

    IF EXISTS (SELECT 1 FROM `user` WHERE email = p_email) THEN
        SET p_code = 4001;
        SET p_msg = '邮箱已被注册';
        ROLLBACK;
    ELSE
        INSERT INTO `user` (email, password, nickname, role, enabled)
        VALUES (p_email, p_password, COALESCE(p_nickname, SUBSTRING_INDEX(p_email, '@', 1)), 'STUDENT', 1);

        SET p_user_id = LAST_INSERT_ID();

        INSERT INTO `user_profile` (user_id) VALUES (p_user_id);

        SET p_code = 0;
        SET p_msg = 'ok';
        COMMIT;
    END IF;
END //

-- ============================================================
-- 2. 用户登录（按邮箱查用户）
-- ============================================================
CREATE PROCEDURE sp_login_user(
    IN p_email VARCHAR(100),
    OUT p_id BIGINT,
    OUT p_password VARCHAR(255),
    OUT p_nickname VARCHAR(50),
    OUT p_role VARCHAR(20),
    OUT p_enabled TINYINT
)
BEGIN
    SELECT id, password, nickname, role, enabled
    INTO p_id, p_password, p_nickname, p_role, p_enabled
    FROM `user`
    WHERE email = p_email;

    IF p_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '邮箱未注册';
    END IF;
END //

-- ============================================================
-- 3. 获取用户学习总览（画像 + 最新测评 + 当前路径）
-- ============================================================
CREATE PROCEDURE sp_get_user_learning_summary(IN p_user_id BIGINT)
BEGIN
    SELECT u.id, u.email, u.nickname, u.role,
           p.grade, p.major, p.target, p.ability_level, p.completed AS profile_completed
    FROM `user` u
    LEFT JOIN `user_profile` p ON p.user_id = u.id
    WHERE u.id = p_user_id;

    SELECT id, title, score, level, submitted_at
    FROM `assessment`
    WHERE user_id = p_user_id AND status = 'COMPLETED'
    ORDER BY submitted_at DESC
    LIMIT 1;

    SELECT stage, stage_name, status, sort_order
    FROM `learning_path`
    WHERE user_id = p_user_id
    ORDER BY sort_order;

    SELECT current_stage, next_steps, weekly_plan, created_at
    FROM `learning_path_recommendation`
    WHERE user_id = p_user_id AND is_active = 1
    ORDER BY created_at DESC
    LIMIT 1;
END //

-- ============================================================
-- 4. 更新学习进度（存在则更新，不存在则插入）
-- ============================================================
CREATE PROCEDURE sp_upsert_learning_progress(
    IN p_user_id BIGINT,
    IN p_knowledge_point_id BIGINT,
    IN p_status VARCHAR(20)
)
BEGIN
    DECLARE EXISTING_ID BIGINT;

    SELECT id INTO EXISTING_ID
    FROM `learning_progress`
    WHERE user_id = p_user_id AND knowledge_point_id = p_knowledge_point_id;

    IF EXISTING_ID IS NOT NULL THEN
        UPDATE `learning_progress`
        SET status = p_status,
            completed_at = IF(p_status = 'COMPLETED', NOW(), completed_at),
            updated_at = NOW()
        WHERE id = EXISTING_ID;
    ELSE
        INSERT INTO `learning_progress` (user_id, knowledge_point_id, status, completed_at)
        VALUES (p_user_id, p_knowledge_point_id, p_status,
                IF(p_status = 'COMPLETED', NOW(), NULL));
    END IF;
END //

-- ============================================================
-- 5. 按知识点推荐资源（含标签）
-- ============================================================
CREATE PROCEDURE sp_get_resources_by_knowledge(IN p_knowledge_point_id BIGINT)
BEGIN
    SELECT r.id, r.title, r.description, r.resource_type, r.url, r.difficulty, r.view_count
    FROM `resource` r
    JOIN `resource_knowledge` rk ON rk.resource_id = r.id
    WHERE rk.knowledge_point_id = p_knowledge_point_id
    ORDER BY r.view_count DESC, r.created_at DESC;

    SELECT rt.tag, COUNT(*) AS count
    FROM `resource_tag` rt
    JOIN `resource_knowledge` rk ON rk.resource_id = rt.resource_id
    WHERE rk.knowledge_point_id = p_knowledge_point_id
    GROUP BY rt.tag
    ORDER BY count DESC;
END //

-- ============================================================
-- 6. 获取用户学习路径进度（各阶段 + 关联知识点完成情况）
-- ============================================================
CREATE PROCEDURE sp_get_path_with_progress(IN p_user_id BIGINT)
BEGIN
    SELECT lp.id AS path_id, lp.stage, lp.stage_name, lp.status AS path_status,
           lp.sort_order,
           COUNT(lp2.id) AS total_knowledge,
           SUM(IF(lp2.status = 'COMPLETED', 1, 0)) AS completed_knowledge
    FROM `learning_path` lp
    LEFT JOIN `knowledge_point` kp ON 1=1
    LEFT JOIN `learning_progress` lp2 ON lp2.knowledge_point_id = kp.id AND lp2.user_id = p_user_id
    WHERE lp.user_id = p_user_id
    GROUP BY lp.id, lp.stage, lp.stage_name, lp.status, lp.sort_order
    ORDER BY lp.sort_order;
END //

-- ============================================================
-- 7. 记录用户行为日志
-- ============================================================
CREATE PROCEDURE sp_log_user_action(
    IN p_user_id BIGINT,
    IN p_action_type VARCHAR(50),
    IN p_target_type VARCHAR(50),
    IN p_target_id BIGINT,
    IN p_detail TEXT
)
BEGIN
    INSERT INTO `user_action_log` (user_id, action_type, target_type, target_id, detail)
    VALUES (p_user_id, p_action_type, p_target_type, p_target_id, p_detail);
END //

-- ============================================================
-- 8. 获取用户学习统计（概览数据）
-- ============================================================
CREATE PROCEDURE sp_get_user_stats(IN p_user_id BIGINT)
BEGIN
    SELECT
        (SELECT COUNT(*) FROM `learning_progress` WHERE user_id = p_user_id AND status = 'COMPLETED') AS learned_knowledge,
        (SELECT COUNT(*) FROM `assessment` WHERE user_id = p_user_id AND status = 'COMPLETED') AS completed_assessments,
        (SELECT MAX(score) FROM `assessment` WHERE user_id = p_user_id) AS best_score,
        (SELECT COUNT(*) FROM `qa_record` WHERE user_id = p_user_id) AS total_questions,
        (SELECT COUNT(*) FROM `user_favorite` WHERE user_id = p_user_id) AS total_favorites;
END //

DELIMITER ;
