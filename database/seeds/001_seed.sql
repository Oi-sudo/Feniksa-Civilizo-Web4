-- Feniksa Civilizo Web4 0.1 seed data
-- Safe idempotent seeds for roles, nine halls, and core terminology.

INSERT INTO roles (code, name_zh, name_eo, name_en) VALUES
('visitor','游客','Vizitanto','Visitor'),
('learner','学习者','Lernanto','Learner'),
('member','正式成员','Membro','Member'),
('project_staff','项目工作人员','Projektano','Project Staff'),
('admin','管理员','Administranto','Administrator')
ON CONFLICT (code) DO NOTHING;

INSERT INTO museum_halls (code, title_zh, title_eo, title_en) VALUES
('NW_TECH','西方科技文明大学','Universitato de Okcidenta Scienca kaj Teknologia Civilizo','University of Western Scientific and Technological Civilization'),
('N_WEB4','凤凰网络 Web4 文明大学','Universitato de Feniksa Reta Web4-Civilizo','Phoenix Web4 Network Civilization University'),
('NE_BUD','佛法修学馆','Halo de Budhisma Lernado kaj Praktikado','Buddhist Study and Practice Hall'),
('W_GIFTS','礼物与藏品馆','Halo de Donacoj kaj Kolektaĵoj','Hall of Gifts and Collections'),
('C_DHARMA','中央佛堂','Centra Budha Halo','Central Buddhist Hall'),
('E_WISDOM','东方智慧文明大学','Universitato de Orienta Saĝeca Civilizo','University of Eastern Wisdom Civilization'),
('SW_MUSEUM','博物馆文明大学','Universitato de Muzea Civilizo','University of Museum Civilization'),
('S_PHOENIX','凤凰文明馆','Halo de Feniksa Civilizo','Phoenix Civilization Hall'),
('SE_ESPERANTO','世界语文明大学','Universitato de Esperanta Civilizo','University of Esperanto Civilization')
ON CONFLICT (code) DO NOTHING;

INSERT INTO system_terms (term_key, zh, eo, en, status, version, notes) VALUES
('technology_ai','人工智能','artefarita inteligenteco','Artificial Intelligence','active','1.0','Current default interface term.'),
('technology_si','超级智能','superinteligenteco','Super Intelligence','research','0.1','Observed/alternative term; not a global replacement for AI.'),
('est','EST 世界语教育与知识贡献记录','EST: edukado kaj scia kontribuo','EST: education and knowledge contribution record','active','0.1','Non-tradable internal record in Web4 0.1.'),
('bud','BUD 愿行与公共服务记录','BUD: vola agado kaj publika servo','BUD: vow-action and public-service record','active','0.1','Non-tradable; not spiritual ranking.'),
('wfb','WFB 文化资产与公共支持登记','WFB: kultura havaĵo kaj publika subteno','WFB: cultural-asset and public-support registry','active','0.1','Registry only; no token issuance in Web4 0.1.')
ON CONFLICT (term_key, version) DO NOTHING;
