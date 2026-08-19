import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { AuthShell } from './AuthShell'
import { FormField, inputClassName } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

const esquema = z.object({
  email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
  senha: z.string().min(1, 'Informe sua senha.'),
})

type FormValues = z.infer<typeof esquema>

export function Login() {
  const { entrar } = useAuth()
  const navigate = useNavigate()
  const [erroServidor, setErroServidor] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(esquema) })

  async function onSubmit(valores: FormValues) {
    setErroServidor(null)
    const { erro } = await entrar(valores.email, valores.senha)
    if (erro) {
      setErroServidor(erro)
      return
    }
    navigate('/propriedades')
  }

  return (
    <AuthShell titulo="Entrar" subtitulo="Acesse o controle da sua propriedade">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {erroServidor && (
          <div className="mb-4">
            <Alert tipo="erro">{erroServidor}</Alert>
          </div>
        )}
        <FormField label="E-mail" erro={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            className={inputClassName}
            placeholder="seu@email.com"
            {...register('email')}
          />
        </FormField>
        <FormField label="Senha" erro={errors.senha?.message}>
          <input
            type="password"
            autoComplete="current-password"
            className={inputClassName}
            placeholder="••••••••"
            {...register('senha')}
          />
        </FormField>
        <Button type="submit" carregando={isSubmitting} className="w-full">
          Entrar
        </Button>
      </form>
      <div className="mt-4 flex flex-col items-center gap-2 text-sm">
        <Link to="/recuperar-senha" className="text-primary-700 hover:underline">
          Esqueci minha senha
        </Link>
        <span className="text-neutral-500">
          Não tem conta?{' '}
          <Link to="/cadastro" className="font-medium text-primary-700 hover:underline">
            Cadastre-se
          </Link>
        </span>
      </div>
    </AuthShell>
  )
}
