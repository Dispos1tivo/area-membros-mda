/** Aparece na hora do clique, enquanto a página logada busca os dados. */
export default function Carregando() {
  return (
    <div className="carregando" role="status" aria-label="Carregando">
      <span className="carregando-giro" aria-hidden="true" />
    </div>
  )
}
