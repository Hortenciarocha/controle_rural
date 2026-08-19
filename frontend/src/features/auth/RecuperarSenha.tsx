import { useState } from 'react'
import { Link } from 'react-router-dom'
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
})

type FormValues = z.infer<typeof esquema>

export function RecuperarSenha() {
  const { recuperarSenha } = useAuth()
  const [enviado, setEnviado] = useState(false)
  const [erroServidor, setErroServidor] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(esquema) })

  async function onSubmit(valores: FormValues) {
    setErroServidor(null)
    const { erro } = await recuperarSenha(valores.email)
    if (erro) {
      setErroServidor(erro)
      return
    }
    setEnviado(true)
  }

  return (
    <AuthShell titulo="Recuperar senha" subtitulo="Enviaremos um link para redefinir sua senha">
      {enviado ? (
        <Alert tipo="sucesso">
          Se o e-mail informado existir em nossa base, você receberá um link para redefinir a senha.
        </Alert>
      ) : (
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
          <Button type="submit" carregando={isSubmitting} className="w-full">
            Enviar link de recuperação
          </Button>
        </form>
      )}
      <div className="mt-4 text-center text-sm">
        <Link to="/login" className="text-primary-700 hover:underline">
          Voltar para o login
        </Link>
      </div>
    </AuthShell>
  )
}
