import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

interface AuthContextValue {
  session: Session | null
  user: User | null
  carregando: boolean
  entrar: (email: string, senha: string) => Promise<{ erro: string | null }>
  cadastrar: (nome: string, email: string, senha: string) => Promise<{ erro: string | null }>
  recuperarSenha: (email: string) => Promise<{ erro: string | null }>
  sair: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCarregando(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSession(novaSessao)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function entrar(email: string, senha: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    return { erro: error ? traduzirErroAuth(error.message) : null }
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } },
    })
    return { erro: error ? traduzirErroAuth(error.message) : null }
  }

  async function recuperarSenha(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    return { erro: error ? traduzirErroAuth(error.message) : null }
  }

  async function sair() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, carregando, entrar, cadastrar, recuperarSenha, sair }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth precisa estar dentro de um AuthProvider')
  return context
}

function traduzirErroAuth(mensagem: string): string {
  if (mensagem.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (mensagem.includes('User already registered')) return 'Já existe uma conta com este e-mail.'
  if (mensagem.includes('Password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.'
  if (mensagem.includes('Unable to validate email address')) return 'E-mail inválido.'
  return 'Não foi possível completar a ação. Verifique sua conexão e tente novamente.'
}
