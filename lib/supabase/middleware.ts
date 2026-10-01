import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SUPABASE_KEY, SUPABASE_URL } from './env'

/** Rotas que qualquer pessoa pode abrir sem estar logada. */
function ehRotaPublica(path: string) {
  // /api/webhooks/* é chamado por servidores (Cakto), que se autenticam com segredo próprio.
  return path === '/login' || path.startsWith('/auth/') || path.startsWith('/api/webhooks/')
}

/**
 * Renova a sessão do aluno a cada requisição e protege a área:
 * - sem login → vai para /login (guardando para onde ia em ?next=)
 * - logado abrindo /login → vai direto para o painel
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  // Não coloque código entre createServerClient e getUser():
  // é o getUser() que valida e renova a sessão.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  if (!user && !ehRotaPublica(path)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    if (path !== '/') url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  if (user && path === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/painel'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}
