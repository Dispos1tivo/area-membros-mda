-- =====================================================================
-- Combo PMPE 2026 — apostilas identificadas pela matéria
-- =====================================================================

update public.materiais m
set titulo    = v.titulo,
    descricao = v.descricao
from public.produtos p,
  (values
    ('pmpe-2026/apostila-1.pdf', 'Língua Portuguesa',      'Apostila 1 · Conteúdo completo do edital da PMPE'),
    ('pmpe-2026/apostila-2.pdf', 'Raciocínio Lógico',      'Apostila 2 · Conteúdo completo do edital da PMPE'),
    ('pmpe-2026/apostila-3.pdf', 'Redação',                'Apostila 3 · Conteúdo completo do edital da PMPE'),
    ('pmpe-2026/apostila-4.pdf', 'Direito Constitucional', 'Apostila 4 · Conteúdo completo do edital da PMPE'),
    ('pmpe-2026/apostila-5.pdf', 'Direitos Humanos',       'Apostila 5 · Conteúdo completo do edital da PMPE')
  ) as v (arquivo, titulo, descricao)
where m.produto_id = p.id
  and p.slug = 'combo-pmpe-2026'
  and m.arquivo = v.arquivo;
