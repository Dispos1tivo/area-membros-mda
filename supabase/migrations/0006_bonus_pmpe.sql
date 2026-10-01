-- =====================================================================
-- Combo PMPE 2026 — bônus alinhados aos PDFs finais
-- Título = nome da página de vendas; linha de apoio = o que é o arquivo
-- =====================================================================

update public.materiais
set descricao = case arquivo
  when 'pmpe-2026/bonus-1.pdf' then 'O edital do Soldado PMPE destrinchado assunto por assunto'
  when 'pmpe-2026/bonus-2.pdf' then 'Planner de 30 dias para acompanhar estudos e acertos'
  when 'pmpe-2026/bonus-3.pdf' then 'Cronograma semanal: sua semana de estudos já montada'
  when 'pmpe-2026/bonus-4.pdf' then 'Kit de Prompts do Concurseiro: comandos prontos para estudar com IA'
  when 'pmpe-2026/bonus-5.pdf' then 'Plano de treino para o TAF do Soldado PMPE, do iniciante ao avançado'
end
where arquivo in (
  'pmpe-2026/bonus-1.pdf', 'pmpe-2026/bonus-2.pdf', 'pmpe-2026/bonus-3.pdf',
  'pmpe-2026/bonus-4.pdf', 'pmpe-2026/bonus-5.pdf'
);
