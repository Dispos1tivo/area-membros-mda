-- =====================================================================
-- GMF (Guarda Municipal de Fortaleza, Guarda Municipal) — 23/11/2026
-- Aplicada no banco em 23/11/2026 com o nome "0033_combo_gmf_2027" (versão 20261123024710); o arquivo virou 0034
-- porque a conversa da PMERJ commitou outro 0033 (0033_mapas_pmerj_contagem.sql) na mesma noite.
-- Concurso no radar + Combo da Aprovação GMF 2027. Por enquanto só o Combo:
-- sem página de vendas, sem Mapas e sem App (decisão do usuário em 22/11).
-- Sem edital novo: a prefeitura anunciou concurso, previsto para 2027. O material segue o
-- último edital (Edital nº 01/2023, IDECAN).
-- A Apostila 7 (Direito Penal e Processo Penal) ainda não chegou: entra depois, com o mesmo número.
-- PDFs no bucket "materiais", pasta nova-marca/gmf-2027 (conferidos em 22/11: nenhum tem texto
-- de outro concurso). Pode rodar mais de uma vez sem duplicar.
-- =====================================================================

insert into public.concursos
  (sigla, orgao, cargo, uf, estado, situacao, vagas, banca, previsao,
   inscricoes_inicio, inscricoes_fim, data_prova, fonte_url, pagina_url, ordem, atualizado_em)
values
  ('GMF', 'Guarda Municipal de Fortaleza', 'Guarda Municipal', 'CE', 'Ceará', 'anunciado',
   null, null, 'Prefeitura prevê novo concurso em 2027',
   null, null, null,
   'https://folha.qconcursos.com/n/concurso-guarda-de-fortaleza-ce-2026-novo-edital-anuncio-prefeito', null, 7, '2026-11-23')
on conflict (sigla) do update
set orgao = excluded.orgao, cargo = excluded.cargo, uf = excluded.uf, estado = excluded.estado,
    situacao = excluded.situacao, vagas = excluded.vagas, banca = excluded.banca, previsao = excluded.previsao,
    inscricoes_inicio = excluded.inscricoes_inicio, inscricoes_fim = excluded.inscricoes_fim,
    data_prova = excluded.data_prova, fonte_url = excluded.fonte_url, pagina_url = excluded.pagina_url,
    ordem = excluded.ordem, atualizado_em = excluded.atualizado_em;

-- Combo (Cakto: produto b9faf739…, checkout zqw7nro)
insert into public.produtos
  (slug, nome, etiqueta, descricao, checkout_url, cakto_produto_id, ordem, tipo, destaques, concurso_id)
select
  'combo-gmf-2027',
  'Combo da Aprovação GMF 2027',
  'GMF 2027',
  '7 apostilas com a teoria do edital, 5 simulados de 80 questões no padrão IDECAN com gabarito comentado e 5 bônus.',
  'https://pay.cakto.com.br/zqw7nro',
  'b9faf739-0664-4f87-99f5-46103a904287',
  13,
  'combo',
  '{"7 apostilas","5 simulados","5 bônus"}'::text[],
  c.id
from public.concursos c
where c.sigla = 'GMF'
on conflict (slug) do update
set nome = excluded.nome, etiqueta = excluded.etiqueta, descricao = excluded.descricao,
    checkout_url = excluded.checkout_url, cakto_produto_id = excluded.cakto_produto_id,
    ordem = excluded.ordem, tipo = excluded.tipo, destaques = excluded.destaques, concurso_id = excluded.concurso_id;

-- Materiais (números das apostilas iguais aos das capas dos PDFs; bônus com os nomes da página de vendas)
delete from public.materiais where arquivo like 'nova-marca/gmf-2027/%';

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Apostilas',  1, 'Língua Portuguesa',                        'Apostila 1 · Teoria do edital da GMF no estilo IDECAN', 'nova-marca/gmf-2027/apostila-1.pdf'),
  ('Apostilas',  2, 'Raciocínio Lógico e Informática',          'Apostila 2 · Teoria do edital da GMF no estilo IDECAN', 'nova-marca/gmf-2027/apostila-2.pdf'),
  ('Apostilas',  3, 'Atualidades',                              'Apostila 3 · Teoria do edital da GMF no estilo IDECAN', 'nova-marca/gmf-2027/apostila-3.pdf'),
  ('Apostilas',  4, 'Conhecimentos sobre Fortaleza',            'Apostila 4 · Teoria do edital da GMF no estilo IDECAN', 'nova-marca/gmf-2027/apostila-4.pdf'),
  ('Apostilas',  5, 'Direito Administrativo',                   'Apostila 5 · Teoria do edital da GMF no estilo IDECAN', 'nova-marca/gmf-2027/apostila-5.pdf'),
  ('Apostilas',  6, 'Direito Constitucional e Direitos Humanos', 'Apostila 6 · Teoria do edital da GMF no estilo IDECAN', 'nova-marca/gmf-2027/apostila-6.pdf'),
  ('Apostilas',  8, 'Legislação Extravagante',                  'Apostila 8 · Teoria do edital da GMF no estilo IDECAN', 'nova-marca/gmf-2027/apostila-8.pdf'),
  ('Simulados', 11, 'Simulado 1', '80 questões no padrão IDECAN, com gabarito comentado', 'nova-marca/gmf-2027/simulado-1.pdf'),
  ('Simulados', 12, 'Simulado 2', '80 questões no padrão IDECAN, com gabarito comentado', 'nova-marca/gmf-2027/simulado-2.pdf'),
  ('Simulados', 13, 'Simulado 3', '80 questões no padrão IDECAN, com gabarito comentado', 'nova-marca/gmf-2027/simulado-3.pdf'),
  ('Simulados', 14, 'Simulado 4', '80 questões no padrão IDECAN, com gabarito comentado', 'nova-marca/gmf-2027/simulado-4.pdf'),
  ('Simulados', 15, 'Simulado 5', '80 questões no padrão IDECAN, com gabarito comentado', 'nova-marca/gmf-2027/simulado-5.pdf'),
  ('Bônus', 21, 'Bônus 1 · Edital Verticalizado',       'As 9 matérias destrinchadas em 163 tópicos',                     'nova-marca/gmf-2027/bonus-1.pdf'),
  ('Bônus', 22, 'Bônus 2 · Planner de 30 Dias',         'Planner de 30 dias para acompanhar estudos e acertos',           'nova-marca/gmf-2027/bonus-2.pdf'),
  ('Bônus', 23, 'Bônus 3 · Planejamento de Estudos',    'Cronograma semanal: sua semana de estudos já montada',           'nova-marca/gmf-2027/bonus-3.pdf'),
  ('Bônus', 24, 'Bônus 4 · Prompts da Aprovação',       'Comandos prontos para estudar com IA',                           'nova-marca/gmf-2027/bonus-4.pdf'),
  ('Bônus', 25, 'Bônus 5 · Plano de Treino para o TAF', 'Treino masculino e feminino para os 4 testes do TAF da Guarda',  'nova-marca/gmf-2027/bonus-5.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'combo-gmf-2027';
