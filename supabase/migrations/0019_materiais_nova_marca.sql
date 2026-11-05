-- PDFs dos Combos com a marca MDA Concursos (04/11/2026).
-- Os arquivos novos estão no mesmo depósito "materiais", na pasta nova-marca/, com os mesmos nomes.
-- Os antigos continuam guardados no lugar de antes (sem uso). Para voltar: tirar o prefixo nova-marca/.
update public.materiais m
set arquivo = 'nova-marca/' || m.arquivo
where m.arquivo not like 'nova-marca/%'
  and exists (select 1 from storage.objects o where o.bucket_id = 'materiais' and o.name = 'nova-marca/' || m.arquivo);
