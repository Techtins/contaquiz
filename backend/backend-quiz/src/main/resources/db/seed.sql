-- ============================================================
-- SEED SQL - ContaQuiz
-- Popula o banco com disciplinas, tópicos e questões de exemplo
-- para Contabilidade e Legislação (estilo CRC/Exame de Suficiência)
-- ============================================================
-- ATENÇÃO: Este script assume que o Hibernate já criou as tabelas
-- via `quarkus.hibernate-orm.database.generation=update`.
-- Execute APÓS a primeira inicialização do backend Quarkus.
--
-- Como executar:
--   Connecte ao banco PostgreSQL e execute:
--   \i backend/backend-quiz/src/main/resources/db/seed.sql
--
-- Ou via psql:
--   psql -U postgres -d contaquiz_db -f backend/backend-quiz/src/main/resources/db/seed.sql
-- ============================================================

-- Limpa dados existentes (opcional - descomente para resetar)
-- DELETE FROM tb_question_topic;
-- DELETE FROM tb_question_option;
-- DELETE FROM tb_question;
-- DELETE FROM tb_topic;
-- DELETE FROM tb_discipline;

INSERT INTO tb_user (active, created_at, email, name, password_hash, updated_at, system_role)
VALUES
  (true, now(), 'admin@quiz.com', 'admin', '$argon2id$v=19$m=65536,t=3,p=4$ZGVpemFTUW1NQ0ptTTlmWA$SdYmDivBQlyr2AwXAdV6uXTiyIU5llODBxtqkj8C6p4', now(), 'ADMIN');

--------------------------------------------------------------
-- 1. DISCIPLINAS
--------------------------------------------------------------
INSERT INTO tb_discipline (id, name, description, active, created_at, updated_at)
VALUES
  (1, 'Contabilidade Geral',       'Princípios fundamentais, normas brasileiras e estruturação das demonstrações contábeis', TRUE, NOW(), NOW()),
  (2, 'Contabilidade de Custos',   'Métodos de custeio, margem de contribuição, ponto de equilíbrio e análise de custos', TRUE, NOW(), NOW()),
  (3, 'Legislação Tributária',     'Código Tributário Nacional, impostos federais, estaduais e municipais', TRUE, NOW(), NOW()),
  (4, 'Auditoria Contábil',        'Normas de auditoria, procedimentos, papéis de trabalho e relatórios', TRUE, NOW(), NOW()),
  (5, 'Matemática Financeira',     'Juros simples e compostos, descontos, séries de pagamentos e análise de investimentos', TRUE, NOW(), NOW());

--------------------------------------------------------------
-- 2. TÓPICOS (Temas)
--------------------------------------------------------------
-- Contabilidade Geral (discipline_id = 1)
INSERT INTO tb_topic (id, name, discipline_id, parent_topic_id, active, created_at, updated_at)
VALUES
  (1,  'Princípios Contábeis',          1, NULL, TRUE, NOW(), NOW()),
  (2,  'Balanço Patrimonial',           1, NULL, TRUE, NOW(), NOW()),
  (3,  'Demonstração do Resultado',     1, NULL, TRUE, NOW(), NOW()),
  (4,  'Fluxo de Caixa',                1, NULL, TRUE, NOW(), NOW()),
  (5,  'Ativo Circulante',              1, 2, TRUE, NOW(), NOW()),
  (6,  'Passivo Circulante',            1, 2, TRUE, NOW(), NOW()),
  (7,  'Patrimônio Líquido',            1, 2, TRUE, NOW(), NOW()),
  (8,  'Receitas e Despesas',           1, 3, TRUE, NOW(), NOW());

-- Contabilidade de Custos (discipline_id = 2)
INSERT INTO tb_topic (id, name, discipline_id, parent_topic_id, active, created_at, updated_at)
VALUES
  (9,  'Custeio por Absorção',          2, NULL, TRUE, NOW(), NOW()),
  (10, 'Custeio Variável',              2, NULL, TRUE, NOW(), NOW()),
  (11, 'Margem de Contribuição',        2, NULL, TRUE, NOW(), NOW()),
  (12, 'Ponto de Equilíbrio',           2, NULL, TRUE, NOW(), NOW()),
  (13, 'Custo Padrão',                  2, NULL, TRUE, NOW(), NOW());

-- Legislação Tributária (discipline_id = 3)
INSERT INTO tb_topic (id, name, discipline_id, parent_topic_id, active, created_at, updated_at)
VALUES
  (14, 'CTN – Introdução',              3, NULL, TRUE, NOW(), NOW()),
  (15, 'Impostos Federais',             3, NULL, TRUE, NOW(), NOW()),
  (16, 'ICMS',                          3, NULL, TRUE, NOW(), NOW()),
  (17, 'ISS',                           3, NULL, TRUE, NOW(), NOW()),
  (18, 'Obrigações Acessórias',         3, NULL, TRUE, NOW(), NOW());

-- Auditoria Contábil (discipline_id = 4)
INSERT INTO tb_topic (id, name, discipline_id, parent_topic_id, active, created_at, updated_at)
VALUES
  (19, 'Normas de Auditoria',           4, NULL, TRUE, NOW(), NOW()),
  (20, 'Procedimentos de Auditoria',    4, NULL, TRUE, NOW(), NOW()),
  (21, 'Papéis de Trabalho',            4, NULL, TRUE, NOW(), NOW()),
  (22, 'Relatórios de Auditoria',       4, NULL, TRUE, NOW(), NOW());

-- Matemática Financeira (discipline_id = 5)
INSERT INTO tb_topic (id, name, discipline_id, parent_topic_id, active, created_at, updated_at)
VALUES
  (23, 'Juros Simples',                 5, NULL, TRUE, NOW(), NOW()),
  (24, 'Juros Compostos',               5, NULL, TRUE, NOW(), NOW()),
  (25, 'Descontos',                     5, NULL, TRUE, NOW(), NOW()),
  (26, 'Séries de Pagamentos',          5, NULL, TRUE, NOW(), NOW()),
  (27, 'VPL e TIR',                     5, NULL, TRUE, NOW(), NOW());

--------------------------------------------------------------
-- 3. QUESTÕES
--------------------------------------------------------------

-- ============================================================
-- DISCIPLINA: Contabilidade Geral (1)
-- ============================================================

-- Questão 1: FACIL, MULTIPLA_ESCOLHA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  1,
  'Assinale a alternativa que apresenta um Princípio Contábil reconhecido pela Resolução CFC nº 750/93:',
  'MULTIPLA_ESCOLHA', 'FACIL',
  'A Resolução CFC nº 750/93 (e atualizações) relaciona os Princípios de Contabilidade: Entidade, Continuidade, Oportunidade, Registro pelo Valor Original, Competência e Prudência.',
  1, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (1, 'Princípio da Entidade', TRUE),
  (1, 'Princípio da Materialidade', FALSE),
  (1, 'Princípio da Consistência', FALSE),
  (1, 'Princípio da Relevância', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (1, 1);

-- Questão 2: MEDIO, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  2,
  'No Balanço Patrimonial, as contas do Ativo são classificadas em ordem decrescente de:',
  'MULTIPLA_ESCOLHA', 'MEDIO',
  'O art. 178 da Lei 6.404/76 determina que as contas do Ativo devem ser dispostas em ordem decrescente de grau de liquidez.',
  1, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (2, 'Liquidez', TRUE),
  (2, 'Exigibilidade', FALSE),
  (2, 'Valor monetário', FALSE),
  (2, 'Prazo de vencimento', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (2, 2);

-- Questão 3: DIFICIL, CERTO_ERRADO
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  3,
  'A Demonstração dos Fluxos de Caixa (DFC) pode ser elaborada pelos métodos direto ou indireto, sendo que o método direto apresenta os recebimentos e pagamentos brutos das atividades operacionais, enquanto o método indireto parte do lucro líquido ajustado pelos itens que não afetam o caixa.',
  'CERTO_ERRADO', 'DIFICIL',
  'Definição correta. O CPC 03 (R2) — Demonstração dos Fluxos de Caixa — prevê ambos os métodos. O método direto evidencia as entradas e saídas brutas de caixa; o indireto parte do lucro líquido e faz ajustes.',
  1, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (3, 'Verdadeiro', TRUE),
  (3, 'Falso', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (3, 4);

-- Questão 4: FACIL, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  4,
  'Uma empresa adquiriu mercadorias para revenda no valor de R$ 10.000,00 com ICMS incluso de 18%. Qual o valor do ICMS a recuperar registrado no Ativo Circulante?',
  'MULTIPLA_ESCOLHA', 'FACIL',
  'O ICMS incidente na compra de mercadorias para revenda é recuperável. Valor do ICMS = 10.000 × 18% = R$ 1.800,00.',
  1, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (4, 'R$ 1.800,00', TRUE),
  (4, 'R$ 10.000,00', FALSE),
  (4, 'R$ 8.200,00', FALSE),
  (4, 'R$ 0,00', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (4, 5);

-- Questão 5: MEDIO, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  5,
  'O Patrimônio Líquido de uma empresa é de R$ 500.000,00. Sabendo que o Ativo Total é de R$ 1.200.000,00, qual o valor do Passivo Exigível?',
  'MULTIPLA_ESCOLHA', 'MEDIO',
  'Pela equação fundamental do patrimônio: Ativo = Passivo + PL. Logo, Passivo = 1.200.000 - 500.000 = R$ 700.000,00.',
  1, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (5, 'R$ 700.000,00', TRUE),
  (5, 'R$ 500.000,00', FALSE),
  (5, 'R$ 1.200.000,00', FALSE),
  (5, 'R$ 1.700.000,00', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (5, 7);

-- Questão 6: FACIL, CERTO_ERRADO
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  6,
  'O regime de competência determina que as receitas e despesas devem ser reconhecidas no momento do recebimento ou pagamento, independentemente do fato gerador.',
  'CERTO_ERRADO', 'FACIL',
  'Afirmativa FALSA. O regime de competência determina que as receitas e despesas devem ser reconhecidas no momento do fato gerador, independentemente do recebimento ou pagamento. O regime descrito é o de caixa.',
  1, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (6, 'Verdadeiro', FALSE),
  (6, 'Falso', TRUE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (6, 1);

-- Questão 7: MEDIO, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  7,
  'Na Demonstração do Resultado do Exercício (DRE), a dedução da Receita Bruta que resulta na Receita Líquida é composta por:',
  'MULTIPLA_ESCOLHA', 'MEDIO',
  'A Receita Líquida é obtida deduzindo-se da Receita Bruta as vendas canceladas, os abatimentos e os tributos incidentes sobre vendas (ICMS, PIS, COFINS).',
  1, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (7, 'Vendas canceladas, abatimentos e tributos sobre vendas', TRUE),
  (7, 'Apenas o custo das mercadorias vendidas', FALSE),
  (7, 'Despesas operacionais e financeiras', FALSE),
  (7, 'Apenas o imposto de renda', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (7, 8);

-- ============================================================
-- DISCIPLINA: Contabilidade de Custos (2)
-- ============================================================

-- Questão 8: FACIL, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  8,
  'No custeio por absorção, os Custos Indiretos de Fabricação (CIF) são apropriados aos produtos com base em:',
  'MULTIPLA_ESCOLHA', 'FACIL',
  'No custeio por absorção, todos os custos de produção (diretos e indiretos) são alocados aos produtos. Os CIF são rateados aos produtos com base em critérios de rateio (horas-máquina, horas-mão-de-obra, etc.).',
  2, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (8, 'Critérios de rateio', TRUE),
  (8, 'Identificação direta por produto', FALSE),
  (8, 'Valor de mercado do produto', FALSE),
  (8, 'Custo de oportunidade', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (8, 9);

-- Questão 9: MEDIO, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  9,
  'Uma empresa apresenta: Preço de Venda = R$ 50/unidade, Custos Variáveis = R$ 30/unidade, Custos Fixos = R$ 20.000/mês. Qual o Ponto de Equilíbrio Contábil em unidades?',
  'MULTIPLA_ESCOLHA', 'MEDIO',
  'PEC = Custos Fixos / Margem de Contribuição Unitária. MC = 50 - 30 = 20. PEC = 20.000 / 20 = 1.000 unidades.',
  2, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (9, '1.000 unidades', TRUE),
  (9, '400 unidades', FALSE),
  (9, '500 unidades', FALSE),
  (9, '2.000 unidades', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (9, 12);

-- Questão 10: DIFICIL, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  10,
  'No custeio variável, a Margem de Contribuição é calculada como:',
  'MULTIPLA_ESCOLHA', 'DIFICIL',
  'Margem de Contribuição = Receita de Vendas - (Custos e Despesas Variáveis). Representa quanto cada produto contribui para pagar os custos fixos e gerar lucro.',
  2, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (10, 'Receita de Vendas – (Custos Variáveis + Despesas Variáveis)', TRUE),
  (10, 'Receita de Vendas – Custos Fixos', FALSE),
  (10, 'Lucro Líquido + Custos Fixos', FALSE),
  (10, 'Receita de Vendas – Custos Totais', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (10, 11);

-- Questão 11: FACIL, CERTO_ERRADO
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  11,
  'O custo padrão é uma estimativa do custo real que serve como parâmetro para controle e análise de eficiência produtiva.',
  'CERTO_ERRADO', 'FACIL',
  'Verdadeiro. O custo padrão é uma meta de custo estabelecida previamente, utilizada para controle e comparação com o custo real, identificando variações.',
  2, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (11, 'Verdadeiro', TRUE),
  (11, 'Falso', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (11, 13);

-- Questão 12: MEDIO, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  12,
  'Uma indústria produz 5.000 unidades de um produto com custo variável unitário de R$ 15 e custo fixo total de R$ 50.000. Pelo custeio por absorção, qual o custo unitário total?',
  'MULTIPLA_ESCOLHA', 'MEDIO',
  'Custo fixo unitário = 50.000 / 5.000 = R$ 10. Custo unitário total = 15 + 10 = R$ 25.',
  2, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (12, 'R$ 25,00', TRUE),
  (12, 'R$ 15,00', FALSE),
  (12, 'R$ 10,00', FALSE),
  (12, 'R$ 65,00', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (12, 9);

-- ============================================================
-- DISCIPLINA: Legislação Tributária (3)
-- ============================================================

-- Questão 13: FACIL, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  13,
  'De acordo com o Código Tributário Nacional (CTN), é espécie de tributo:',
  'MULTIPLA_ESCOLHA', 'FACIL',
  'O art. 5º do CTN estabelece que são tributos: impostos, taxas, contribuições de melhoria, empréstimos compulsórios e contribuições especiais (estas previstas na CF/88).',
  3, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (13, 'Imposto, Taxa e Contribuição de Melhoria', TRUE),
  (13, 'Imposto, Multa e Juros', FALSE),
  (13, 'Taxa, Tarifa e Preço Público', FALSE),
  (13, 'Contribuição, Multa e Taxa', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (13, 14);

-- Questão 14: MEDIO, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  14,
  'O Imposto sobre Circulação de Mercadorias e Serviços (ICMS) é de competência:',
  'MULTIPLA_ESCOLHA', 'MEDIO',
  'O ICMS é um imposto estadual, previsto no art. 155, II da Constituição Federal. Cada estado e o Distrito Federal legislam sobre seu próprio ICMS.',
  3, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (14, 'Estadual', TRUE),
  (14, 'Federal', FALSE),
  (14, 'Municipal', FALSE),
  (14, 'Distrital', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (14, 16);

-- Questão 15: DIFICIL, CERTO_ERRADO
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  15,
  'O princípio da anterioridade nonagesimal (noventena) determina que um tributo só pode ser cobrado após decorridos 90 dias da data da publicação da lei que o instituiu ou aumentou.',
  'CERTO_ERRADO', 'DIFICIL',
  'Verdadeiro. Previsto no art. 150, III, "c" da CF/88 (com redação da EC 42/2003), a anterioridade nonagesimal (noventena) exige o decurso de 90 dias entre a publicação da lei e a cobrança do tributo.',
  3, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (15, 'Verdadeiro', TRUE),
  (15, 'Falso', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (15, 14);

-- Questão 16: FACIL, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  16,
  'O ISS (Imposto sobre Serviços) é um tributo de competência:',
  'MULTIPLA_ESCOLHA', 'FACIL',
  'O ISS é de competência municipal, conforme art. 156, III da CF/88 e Lei Complementar 116/2003.',
  3, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (16, 'Municipal', TRUE),
  (16, 'Estadual', FALSE),
  (16, 'Federal', FALSE),
  (16, 'Distrital', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (16, 17);

-- ============================================================
-- DISCIPLINA: Auditoria Contábil (4)
-- ============================================================

-- Questão 17: FACIL, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  17,
  'As Normas Brasileiras de Contabilidade aplicadas à Auditoria são emitidas pelo:',
  'MULTIPLA_ESCOLHA', 'FACIL',
  'As NBCs de Auditoria são emitidas pelo Conselho Federal de Contabilidade (CFC), conforme competência legal.',
  4, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (17, 'Conselho Federal de Contabilidade (CFC)', TRUE),
  (17, 'Comissão de Valores Mobiliários (CVM)', FALSE),
  (17, 'Banco Central do Brasil (BACEN)', FALSE),
  (17, 'Instituto dos Auditores Independentes (IBRACON)', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (17, 19);

-- Questão 18: MEDIO, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  18,
  'Em auditoria, o risco de que o auditor expresse uma opinião inadequada quando as demonstrações contábeis contiverem distorção relevante é denominado:',
  'MULTIPLA_ESCOLHA', 'MEDIO',
  'Conforme NBC TA 200 (R1), risco de auditoria é o risco de o auditor expressar opinião inadequada quando as demonstrações contábeis contiverem distorção relevante.',
  4, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (18, 'Risco de auditoria', TRUE),
  (18, 'Risco de negócio', FALSE),
  (18, 'Risco de controle', FALSE),
  (18, 'Risco inerente', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (18, 20);

-- Questão 19: DIFICIL, CERTO_ERRADO
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  19,
  'O parecer de auditoria com ressalva é emitido quando o auditor conclui que as demonstrações contábeis apresentam distorções relevantes e generalizadas.',
  'CERTO_ERRADO', 'DIFICIL',
  'Falso. O parecer com ressalva é emitido quando há distorções relevantes, mas NÃO generalizadas. Distorções generalizadas levam à opinião adversa (quando distorcidas) ou à abstenção de opinião (quando não foi possível obter evidência).',
  4, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (19, 'Verdadeiro', FALSE),
  (19, 'Falso', TRUE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (19, 22);

-- ============================================================
-- DISCIPLINA: Matemática Financeira (5)
-- ============================================================

-- Questão 20: FACIL, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  20,
  'Um capital de R$ 1.000,00 aplicado a juros simples de 2% ao mês durante 5 meses resulta em qual montante?',
  'MULTIPLA_ESCOLHA', 'FACIL',
  'J = C × i × t = 1.000 × 0,02 × 5 = R$ 100,00. M = C + J = 1.000 + 100 = R$ 1.100,00.',
  5, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (20, 'R$ 1.100,00', TRUE),
  (20, 'R$ 1.200,00', FALSE),
  (20, 'R$ 1.050,00', FALSE),
  (20, 'R$ 1.020,00', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (20, 23);

-- Questão 21: MEDIO, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  21,
  'Qual o montante de um capital de R$ 5.000,00 aplicado a juros compostos de 1% ao mês durante 12 meses? (Considere (1,01)^12 = 1,1268)',
  'MULTIPLA_ESCOLHA', 'MEDIO',
  'M = C × (1 + i)^t = 5.000 × (1,01)^12 = 5.000 × 1,1268 = R$ 5.634,00.',
  5, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (21, 'R$ 5.634,00', TRUE),
  (21, 'R$ 5.600,00', FALSE),
  (21, 'R$ 5.500,00', FALSE),
  (21, 'R$ 6.000,00', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (21, 24);

-- Questão 22: DIFICIL, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  22,
  'Um título de R$ 10.000,00 é descontado 3 meses antes do vencimento à taxa de desconto comercial simples de 2% ao mês. Qual o valor atual (valor descontado)?',
  'MULTIPLA_ESCOLHA', 'DIFICIL',
  'Desconto Comercial Simples: D = N × d × t = 10.000 × 0,02 × 3 = R$ 600,00. Valor Atual = N - D = 10.000 - 600 = R$ 9.400,00.',
  5, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (22, 'R$ 9.400,00', TRUE),
  (22, 'R$ 9.200,00', FALSE),
  (22, 'R$ 10.000,00', FALSE),
  (22, 'R$ 9.600,00', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (22, 25);

-- Questão 23: MEDIO, CERTO_ERRADO
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  23,
  'O Valor Presente Líquido (VPL) positivo indica que a taxa interna de retorno (TIR) de um projeto é superior à taxa mínima de atratividade (TMA).',
  'CERTO_ERRADO', 'MEDIO',
  'Verdadeiro. VPL > 0 significa que o fluxo de caixa descontado pela TMA é positivo, o que implica TIR > TMA.',
  5, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (23, 'Verdadeiro', TRUE),
  (23, 'Falso', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (23, 27);

-- Questão 24: FACIL, MULTIPLA_ESCOLA
INSERT INTO tb_question (id, statement, type, difficulty, explanation, discipline_id, timesanswered, timescorrect, active, created_at, updated_at)
VALUES (
  24,
  'Uma pessoa deseja acumular R$ 12.000,00 em 24 meses fazendo depósitos mensais iguais em uma aplicação que paga 1% ao mês. Considerando (1,01)^24 = 1,2697, o valor aproximado de cada depósito é:',
  'MULTIPLA_ESCOLHA', 'FACIL',
  'Trata-se de uma série de pagamentos uniformes postecipados (FV). PMT = FV / [((1+i)^n - 1)/i] = 12.000 / [(1,2697-1)/0,01] = 12.000 / 26,97 ≈ R$ 445,00.',
  5, 0, 0, TRUE, NOW(), NOW()
);

INSERT INTO tb_question_option (question_id, text, is_correct)
VALUES
  (24, 'Aproximadamente R$ 445,00', TRUE),
  (24, 'Aproximadamente R$ 500,00', FALSE),
  (24, 'Aproximadamente R$ 600,00', FALSE),
  (24, 'Aproximadamente R$ 400,00', FALSE);

INSERT INTO tb_question_topic (question_id, topic_id) VALUES (24, 26);

-- ============================================================
-- 4. ATUALIZA AS SEQUENCES (segurança para inserts futuros)
-- ============================================================
SELECT setval('tb_discipline_id_seq',       COALESCE((SELECT MAX(id) FROM tb_discipline), 5));
SELECT setval('tb_topic_id_seq',            COALESCE((SELECT MAX(id) FROM tb_topic), 27));
SELECT setval('tb_question_id_seq',         COALESCE((SELECT MAX(id) FROM tb_question), 24));
SELECT setval('tb_question_option_id_seq',  COALESCE((SELECT MAX(id) FROM tb_question_option), 78));

-- ============================================================
-- 5. EXEMPLO DE RESULTADO DE QUIZ (opcional - descomente se houver quizzes)
--    Nota: Resultados são normalmente criados via API.
--    Estes inserts servem como referência para testes manuais.
-- ============================================================
-- INSERT INTO tb_quiz_result (id, user_id, quiz_id, correct_answers, wrong_answers, total_questions, percentage, time_spent_in_seconds, passing_score, active, created_at, updated_at)
-- VALUES (1, 1, 1, 4, 2, 6, 66.67, 120, 0, TRUE, NOW(), NOW());
--
-- INSERT INTO tb_quiz_result_correction (result_id, question_id, user_answer, correct_answer, is_correct, explanation_snapshot)
-- VALUES
--   (1, 1, 0, 0, TRUE,  'A Resolução CFC nº 750/93 ...'),
--   (1, 2, 1, 0, FALSE, 'O art. 178 da Lei 6.404/76 ...'),
--   (1, 3, 0, 0, TRUE,  'Definição correta. O CPC 03 (R2) ...'),
--   (1, 4, 0, 0, TRUE,  'O ICMS incidente na compra ...'),
--   (1, 5, 2, 0, FALSE, 'Pela equação fundamental ...'),
--   (1, 6, 0, 1, FALSE, 'Afirmativa FALSA. O regime de competência ...');
--
-- SELECT setval('tb_quiz_result_id_seq',           COALESCE((SELECT MAX(id) FROM tb_quiz_result), 1));
-- SELECT setval('tb_quiz_result_correction_id_seq', COALESCE((SELECT MAX(id) FROM tb_quiz_result_correction), 6));
