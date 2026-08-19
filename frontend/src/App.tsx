import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { AppLayout } from '@/routes/AppLayout'
import { Login } from '@/features/auth/Login'
import { Cadastro } from '@/features/auth/Cadastro'
import { RecuperarSenha } from '@/features/auth/RecuperarSenha'
import { SelecionarPropriedade } from '@/features/propriedades/SelecionarPropriedade'
import { Dashboard } from '@/features/dashboard/Dashboard'
import { Propriedade } from '@/features/propriedades/Propriedade'
import { Plantacoes } from '@/features/plantacoes/Plantacoes'
import { Animais } from '@/features/animais/Animais'
import { FichaAnimal } from '@/features/animais/FichaAnimal'
import { Estoque } from '@/features/estoque/Estoque'
import { Financeiro } from '@/features/financeiro/Financeiro'
import { Atividades } from '@/features/atividades/Atividades'

function App() {
  return (
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
  )
}

export default App
