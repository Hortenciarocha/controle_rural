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
  nome: z.string().min(2, 'Informe seu nome.'),
  email: z.string().min(1, 'Informe seu e-mail.').email('E-mail inválido.'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
})

type FormValues = z.infer<typeof esquema>

export function Cadastro() {
  const { cadastrar } = useAuth()
  const navigate = useNavigate()
  const [erroServidor, setErroServidor] = useState<string | null>(null)
  const [contaCriada, setContaCriada] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(esquema) })

  async function onSubmit(valores: FormValues) {
    setErroServidor(null)
    const { erro } = await cadastrar(valores.nome, valores.email, valores.senha)
    if (erro) {
      setErroServidor(erro)
      return
    }
    setContaCriada(true)
    setTimeout(() => navigate('/propriedades'), 1200)
  }

  return (
    <AuthShell titulo="Criar conta" subtitulo="Comece a organizar sua propriedade hoje">
      {contaCriada ? (
        <Alert tipo="sucesso">Conta criada! Redirecionando...</Alert>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {erroServidor && (
              <div className="mb-4">
                <Alert tipo="erro">{erroServidor}</Alert>
              </div>
            )}
            <FormField label="Nome" erro={errors.nome?.message}>
              <input
                autoComplete="name"
                className={inputClassName}
                placeholder="Seu nome"
                {...register('nome')}
              />
            </FormField>
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
                autoComplete="new-password"
                className={inputClassName}
                placeholder="Pelo menos 6 caracteres"
                {...register('senha')}
              />
            </FormField>
            <Button type="submit" carregando={isSubmitting} className="w-full">
              Criar conta
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-neutral-500">
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-primary-700 hover:underline">
              Entrar
            </Link>
          </div>
        </>
      )}
    </AuthShell>
  )
}
