import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { AppLayout } from '@/routes/AppLayout'
import { PageLoader } from '@/components/ui/PageLoader'
import { Login } from '@/features/auth/Login'
import { Cadastro } from '@/features/auth/Cadastro'
import { RecuperarSenha } from '@/features/auth/RecuperarSenha'

// Carregadas sob demanda: cada módulo só baixa seu próprio código quando o
// usuário navega até ele, mantendo o primeiro carregamento (login) leve em
// conexões instáveis (RNF-002/RNF-003 do PRD).
const SelecionarPropriedade = lazy(() =>
  import('@/features/propriedades/SelecionarPropriedade').then((m) => ({ default: m.SelecionarPropriedade })),
)
const Dashboard = lazy(() => import('@/features/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })))
const Propriedade = lazy(() => import('@/features/propriedades/Propriedade').then((m) => ({ default: m.Propriedade })))
const Plantacoes = lazy(() => import('@/features/plantacoes/Plantacoes').then((m) => ({ default: m.Plantacoes })))
const Animais = lazy(() => import('@/features/animais/Animais').then((m) => ({ default: m.Animais })))
const FichaAnimal = lazy(() => import('@/features/animais/FichaAnimal').then((m) => ({ default: m.FichaAnimal })))
const Estoque = lazy(() => import('@/features/estoque/Estoque').then((m) => ({ default: m.Estoque })))
const Financeiro = lazy(() => import('@/features/financeiro/Financeiro').then((m) => ({ default: m.Financeiro })))
const Atividades = lazy(() => import('@/features/atividades/Atividades').then((m) => ({ default: m.Atividades })))

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/propriedades" element={<SelecionarPropriedade />} />

          <Route path="/p/:propriedadeId" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="propriedade" element={<Propriedade />} />
            <Route path="plantacoes" element={<Plantacoes />} />
            <Route path="animais" element={<Animais />} />
            <Route path="animais/:animalId" element={<FichaAnimal />} />
            <Route path="estoque" element={<Estoque />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="atividades" element={<Atividades />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/propriedades" replace />} />
        <Route path="*" element={<Navigate to="/propriedades" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
