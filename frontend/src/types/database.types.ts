// Tipos escritos manualmente para refletir as migrations em supabase/migrations,
// no formato exigido pelo generic Database do @supabase/supabase-js (cada tabela
// precisa de Row/Insert/Update/Relationships; o schema precisa de Tables/Views/Functions).
// Depois que o projeto Supabase estiver criado e as migrations aplicadas,
// substitua este arquivo pelo output real de:
//   npx supabase gen types typescript --project-id <ref> > src/types/database.types.ts

export type Papel = 'proprietario' | 'funcionario'
export type TipoMovimentacao = 'entrada' | 'saida'
export type TipoLancamento = 'receita' | 'despesa'
export type StatusAtividade = 'pendente' | 'em_andamento' | 'concluida'
export type NivelAlerta = 'info' | 'atencao' | 'urgente'
export type CategoriaEstoque =
  | 'insumo'
  | 'racao'
  | 'fertilizante'
  | 'medicamento'
  | 'ferramenta'
  | 'equipamento'
  | 'outro'
export type TipoAtividade =
  | 'plantio'
  | 'irrigacao'
  | 'adubacao'
  | 'aplicacao_produtos'
  | 'vacinacao'
  | 'alimentacao'
  | 'manutencao'
  | 'colheita'
  | 'outras'
export type TipoEventoSanitario = 'vacina' | 'tratamento' | 'outro'
export type Sexo = 'macho' | 'femea'

type Relationships = []

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; nome: string; email: string; criado_em: string }
        Insert: { id: string; nome: string; email: string; criado_em?: string }
        Update: { nome?: string; email?: string }
        Relationships: Relationships
      }
      propriedades: {
        Row: {
          id: string
          nome: string
          localizacao: string
          area_total: number
          criado_em: string
          atualizado_em: string
        }
        Insert: { nome: string; localizacao: string; area_total: number }
        Update: { nome?: string; localizacao?: string; area_total?: number }
        Relationships: Relationships
      }
      propriedades_usuarios: {
        Row: {
          id: string
          usuario_id: string
          propriedade_id: string
          papel: Papel
          criado_em: string
        }
        Insert: { usuario_id: string; propriedade_id: string; papel: Papel }
        Update: { papel?: Papel }
        Relationships: Relationships
      }
      talhoes: {
        Row: {
          id: string
          propriedade_id: string
          nome: string
          area: number
          criado_em: string
          atualizado_em: string
        }
        Insert: { propriedade_id: string; nome: string; area: number }
        Update: { nome?: string; area?: number }
        Relationships: Relationships
      }
      culturas: {
        Row: {
          id: string
          propriedade_id: string | null
          nome: string
          ciclo_medio_dias: number
          unidade_producao: string
          criado_em: string
        }
        Insert: {
          propriedade_id?: string | null
          nome: string
          ciclo_medio_dias: number
          unidade_producao: string
        }
        Update: { nome?: string; ciclo_medio_dias?: number; unidade_producao?: string }
        Relationships: Relationships
      }
      plantios: {
        Row: {
          id: string
          talhao_id: string
          cultura_id: string
          data_plantio: string
          area_plantada: number
          previsao_colheita: string | null
          data_colheita: string | null
          quantidade_colhida: number | null
          observacoes: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          talhao_id: string
          cultura_id: string
          data_plantio?: string
          area_plantada: number
          previsao_colheita?: string | null
          observacoes?: string | null
        }
        Update: {
          data_colheita?: string | null
          quantidade_colhida?: number | null
          previsao_colheita?: string | null
          observacoes?: string | null
        }
        Relationships: Relationships
      }
      animais: {
        Row: {
          id: string
          propriedade_id: string
          especie: string
          raca: string | null
          sexo: Sexo | null
          data_nascimento: string | null
          peso: number | null
          identificacao: string | null
          observacoes: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          propriedade_id: string
          especie: string
          raca?: string | null
          sexo?: Sexo | null
          data_nascimento?: string | null
          peso?: number | null
          identificacao?: string | null
          observacoes?: string | null
        }
        Update: {
          especie?: string
          raca?: string | null
          sexo?: Sexo | null
          data_nascimento?: string | null
          peso?: number | null
          identificacao?: string | null
          observacoes?: string | null
        }
        Relationships: Relationships
      }
      eventos_sanitarios: {
        Row: {
          id: string
          animal_id: string
          tipo: TipoEventoSanitario
          descricao: string
          data: string
          proxima_data: string | null
          responsavel: string | null
          criado_em: string
        }
        Insert: {
          animal_id: string
          tipo: TipoEventoSanitario
          descricao: string
          data?: string
          proxima_data?: string | null
          responsavel?: string | null
        }
        Update: {
          tipo?: TipoEventoSanitario
          descricao?: string
          data?: string
          proxima_data?: string | null
          responsavel?: string | null
        }
        Relationships: Relationships
      }
      producao_animal: {
        Row: {
          id: string
          animal_id: string
          tipo: string
          quantidade: number
          data: string
          criado_em: string
        }
        Insert: { animal_id: string; tipo: string; quantidade: number; data?: string }
        Update: { quantidade?: number; data?: string }
        Relationships: Relationships
      }
      estoque_itens: {
        Row: {
          id: string
          propriedade_id: string
          nome: string
          categoria: CategoriaEstoque
          unidade: string
          quantidade_atual: number
          estoque_minimo: number
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          propriedade_id: string
          nome: string
          categoria: CategoriaEstoque
          unidade: string
          estoque_minimo?: number
        }
        Update: {
          nome?: string
          categoria?: CategoriaEstoque
          unidade?: string
          estoque_minimo?: number
        }
        Relationships: Relationships
      }
      movimentacoes_estoque: {
        Row: {
          id: string
          item_id: string
          tipo: TipoMovimentacao
          quantidade: number
          data: string
          custo: number | null
          motivo: string | null
          fornecedor: string | null
          registrado_por: string | null
          criado_em: string
        }
        Insert: {
          item_id: string
          tipo: TipoMovimentacao
          quantidade: number
          data?: string
          custo?: number | null
          motivo?: string | null
          fornecedor?: string | null
        }
        Update: {
          tipo?: TipoMovimentacao
          quantidade?: number
          data?: string
          custo?: number | null
          motivo?: string | null
          fornecedor?: string | null
        }
        Relationships: Relationships
      }
      financeiro_lancamentos: {
        Row: {
          id: string
          propriedade_id: string
          tipo: TipoLancamento
          categoria: string
          valor: number
          data: string
          descricao: string | null
          movimentacao_estoque_id: string | null
          registrado_por: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          propriedade_id: string
          tipo: TipoLancamento
          categoria: string
          valor: number
          data?: string
          descricao?: string | null
        }
        Update: {
          categoria?: string
          valor?: number
          data?: string
          descricao?: string | null
        }
        Relationships: Relationships
      }
      atividades: {
        Row: {
          id: string
          propriedade_id: string
          titulo: string
          tipo: TipoAtividade
          data_prevista: string
          status: StatusAtividade
          responsavel_id: string | null
          descricao: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          propriedade_id: string
          titulo: string
          tipo: TipoAtividade
          data_prevista: string
          status?: StatusAtividade
          responsavel_id?: string | null
          descricao?: string | null
        }
        Update: {
          titulo?: string
          tipo?: TipoAtividade
          data_prevista?: string
          status?: StatusAtividade
          responsavel_id?: string | null
          descricao?: string | null
        }
        Relationships: Relationships
      }
      alertas: {
        Row: {
          id: string
          propriedade_id: string
          tipo: string
          mensagem: string
          nivel: NivelAlerta
          referencia_tabela: string | null
          referencia_id: string | null
          lido: boolean
          criado_em: string
        }
        Insert: {
          propriedade_id: string
          tipo: string
          mensagem: string
          nivel?: NivelAlerta
          referencia_tabela?: string | null
          referencia_id?: string | null
          lido?: boolean
        }
        Update: { lido?: boolean }
        Relationships: Relationships
      }
    }
    Views: Record<string, never>
    Functions: {
      criar_propriedade: {
        Args: { p_nome: string; p_localizacao: string; p_area_total: number }
        Returns: Database['public']['Tables']['propriedades']['Row']
      }
    }
  }
}
