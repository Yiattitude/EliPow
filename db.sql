DROP DATABASE IF EXISTS elipow;

CREATE DATABASE IF NOT EXISTS elipow
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE elipow;

-- ============================================================
-- 前置清理（先删外键依赖表，再删主表）
-- ============================================================

DROP TABLE IF EXISTS `user_favorite`;
DROP TABLE IF EXISTS `user_action_log`;
DROP TABLE IF EXISTS `learning_progress`;
DROP TABLE IF EXISTS `news_tag`;
DROP TABLE IF EXISTS `news`;
DROP TABLE IF EXISTS `qa_record`;
DROP TABLE IF EXISTS `resource_knowledge`;
DROP TABLE IF EXISTS `resource_tag`;
DROP TABLE IF EXISTS `resource`;
DROP TABLE IF EXISTS `learning_path_recommendation`;
DROP TABLE IF EXISTS `learning_path`;
DROP TABLE IF EXISTS `assessment`;
DROP TABLE IF EXISTS `knowledge_point`;
DROP TABLE IF EXISTS `user_profile`;
DROP TABLE IF EXISTS `user`;

-- ============================================================
-- 1. 用户与认证
-- ============================================================

CREATE TABLE `user` (
  `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `email`       VARCHAR(100) NOT NULL UNIQUE,
  `password`    VARCHAR(255) NOT NULL COMMENT 'BCrypt 加密',
  `nickname`    VARCHAR(50),
  `avatar_url`  VARCHAR(255),
  `role`        VARCHAR(20)  NOT NULL DEFAULT 'STUDENT' COMMENT 'STUDENT | ADMIN',
  `enabled`     TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户认证与基础信息';

CREATE TABLE `user_profile` (
  `id`              BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `user_id`         BIGINT       NOT NULL UNIQUE,
  `grade`           VARCHAR(20)  COMMENT '年级: 大一/大二/大三/大四',
  `major`           VARCHAR(50)  COMMENT '专业方向: 电力系统/新能源/…',
  `target`          VARCHAR(100) COMMENT '学习目标: 考研/就业/竞赛/…',
  `self_assess`     VARCHAR(255) COMMENT '自评描述',
  `ability_level`   VARCHAR(20)  COMMENT '能力层级: BEGINNER/INTERMEDIATE/ADVANCED',
  `weak_knowledge`  TEXT         COMMENT '缺失知识点列表 (JSON 数组)',
  `completed`       TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '画像是否采集完成',
  `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户画像';

-- ============================================================
-- 2. 知识点
-- ============================================================

CREATE TABLE `knowledge_point` (
  `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `name`        VARCHAR(100) NOT NULL,
  `description` TEXT,
  `parent_id`   BIGINT       COMMENT '父知识点，构建层级',
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `knowledge_point`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识点';

-- ============================================================
-- 3. 测评
-- ============================================================

CREATE TABLE `assessment` (
  `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `user_id`     BIGINT       NOT NULL,
  `title`       VARCHAR(100) NOT NULL,
  `score`       DECIMAL(5,2) COMMENT '得分',
  `level`       VARCHAR(20)  COMMENT '评估层级',
  `detail`      TEXT         COMMENT '测评详细结果 (JSON)',
  `status`      VARCHAR(20)  NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING | COMPLETED',
  `started_at`  DATETIME,
  `submitted_at` DATETIME,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='测评记录';

-- ============================================================
-- 4. 学习路径
-- ============================================================

CREATE TABLE `learning_path` (
  `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `user_id`     BIGINT       NOT NULL,
  `stage`       VARCHAR(20)  NOT NULL COMMENT '当前阶段标识',
  `stage_name`  VARCHAR(100) NOT NULL COMMENT '阶段名称',
  `description` TEXT,
  `sort_order`  INT          NOT NULL DEFAULT 0 COMMENT '阶段排序',
  `status`      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE | COMPLETED | LOCKED',
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学习路径阶段';

CREATE TABLE `learning_path_recommendation` (
  `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `user_id`     BIGINT       NOT NULL,
  `current_stage` VARCHAR(20) NOT NULL COMMENT '当前阶段',
  `next_steps`  TEXT         COMMENT '下一步建议 (JSON)',
  `weekly_plan` TEXT         COMMENT '每周计划 (JSON)',
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路径推荐记录（每次重新推荐生成新行）';

-- ============================================================
-- 5. 学习资源
-- ============================================================

CREATE TABLE `resource` (
  `id`            BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `title`         VARCHAR(200) NOT NULL,
  `description`   TEXT,
  `resource_type` VARCHAR(20)  NOT NULL COMMENT 'VIDEO | DOCUMENT | EXERCISE | BOOK | CASE | ARTICLE',
  `url`           VARCHAR(500),
  `content`       MEDIUMTEXT   COMMENT '文本内容（文档/习题等）',
  `cover_url`     VARCHAR(255),
  `difficulty`    VARCHAR(20)  COMMENT 'BEGINNER | INTERMEDIATE | ADVANCED',
  `source`        VARCHAR(100) COMMENT '来源',
  `view_count`    INT          NOT NULL DEFAULT 0,
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学习资源';

CREATE TABLE `resource_tag` (
  `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `resource_id` BIGINT       NOT NULL,
  `tag`         VARCHAR(50)  NOT NULL,
  FOREIGN KEY (`resource_id`) REFERENCES `resource`(`id`),
  INDEX `idx_tag` (`tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资源标签';

CREATE TABLE `resource_knowledge` (
  `id`          BIGINT PRIMARY KEY AUTO_INCREMENT,
  `resource_id` BIGINT NOT NULL,
  `knowledge_point_id` BIGINT NOT NULL,
  FOREIGN KEY (`resource_id`) REFERENCES `resource`(`id`),
  FOREIGN KEY (`knowledge_point_id`) REFERENCES `knowledge_point`(`id`),
  UNIQUE KEY `uk_resource_knowledge` (`resource_id`, `knowledge_point_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资源与知识点关联';

-- ============================================================
-- 6. 问答
-- ============================================================

CREATE TABLE `qa_record` (
  `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `user_id`     BIGINT       NOT NULL,
  `question`    TEXT         NOT NULL,
  `answer`      TEXT         NOT NULL,
  `sources`     TEXT         COMMENT '引用来源 (JSON 数组)',
  `satisfied`   TINYINT(1)   COMMENT '用户满意度',
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='问答记录';

-- ============================================================
-- 7. 行业资讯
-- ============================================================

CREATE TABLE `news` (
  `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `title`       VARCHAR(200) NOT NULL,
  `summary`     TEXT,
  `content`     TEXT,
  `url`         VARCHAR(500) NOT NULL,
  `category`    VARCHAR(50)  COMMENT '分类',
  `source`      VARCHAR(100) COMMENT '来源网站',
  `publish_at`  DATETIME,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_url` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='行业资讯';

CREATE TABLE `news_tag` (
  `id`      BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `news_id` BIGINT       NOT NULL,
  `tag`     VARCHAR(50)  NOT NULL,
  FOREIGN KEY (`news_id`) REFERENCES `news`(`id`),
  INDEX `idx_tag` (`tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资讯标签';

-- ============================================================
-- 8. 学习进度与行为
-- ============================================================

CREATE TABLE `learning_progress` (
  `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `user_id`     BIGINT       NOT NULL,
  `knowledge_point_id` BIGINT NOT NULL,
  `status`      VARCHAR(20)  NOT NULL DEFAULT 'NOT_STARTED' COMMENT 'NOT_STARTED | IN_PROGRESS | COMPLETED',
  `completed_at` DATETIME,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
  FOREIGN KEY (`knowledge_point_id`) REFERENCES `knowledge_point`(`id`),
  UNIQUE KEY `uk_user_knowledge` (`user_id`, `knowledge_point_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学习进度';

CREATE TABLE `user_action_log` (
  `id`          BIGINT       PRIMARY KEY AUTO_INCREMENT,
  `user_id`     BIGINT       NOT NULL,
  `action_type` VARCHAR(50)  NOT NULL COMMENT 'VIEW_RESOURCE | COMPLETE_EXERCISE | ASK_QUESTION | …',
  `target_type` VARCHAR(50)  COMMENT 'resource | assessment | qa | …',
  `target_id`   BIGINT,
  `detail`      TEXT         COMMENT '扩展信息 (JSON)',
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
  INDEX `idx_user_action` (`user_id`, `action_type`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户行为日志';

-- ============================================================
-- 9. 资源收藏
-- ============================================================

CREATE TABLE `user_favorite` (
  `id`          BIGINT   PRIMARY KEY AUTO_INCREMENT,
  `user_id`     BIGINT   NOT NULL,
  `resource_id` BIGINT   NOT NULL,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
  FOREIGN KEY (`resource_id`) REFERENCES `resource`(`id`),
  UNIQUE KEY `uk_user_resource` (`user_id`, `resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户资源收藏';
