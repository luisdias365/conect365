# Design do Simulador de Financiamento Multi-Banco

## Visão Geral
Um aplicativo móvel que permite aos usuários simular financiamentos em múltiplas instituições financeiras brasileiras, comparar taxas e identificar a melhor opção de forma visual e intuitiva.

## Telas Principais

### 1. **Home (Simulação)**
- **Conteúdo Principal:**
  - Campo para valor do financiamento (input numérico com máscara de moeda)
  - Campo para prazo em meses (input numérico ou slider)
  - Botão "Simular" destacado
  - Indicador visual do estado (vazio, preenchido, simulando, resultado)

- **Funcionalidade:**
  - Validação de entrada em tempo real
  - Simulação instantânea ao alterar valores
  - Feedback visual durante processamento

### 2. **Resultados da Simulação**
- **Conteúdo Principal:**
  - Card destacado com a melhor taxa (banco vencedor com badge "Melhor Taxa")
  - Lista de resultados ordenada por taxa (crescente)
  - Para cada banco: nome, taxa mensal (%), valor da parcela, valor total com juros
  - Card visual com gradiente para o banco vencedor
  - Botão para compartilhar resultado

- **Funcionalidade:**
  - Scroll vertical para visualizar todos os bancos
  - Destaque visual do melhor resultado
  - Cálculos precisos de juros compostos

### 3. **Detalhes do Banco**
- **Conteúdo Principal:**
  - Nome e logo do banco
  - Taxa de juros mensal e anual
  - Simulação detalhada:
    - Valor financiado
    - Prazo
    - Valor da parcela
    - Valor total com juros
    - Juros totais
  - Tabela de amortização (primeiras e últimas parcelas)
  - Botão para compartilhar ou copiar resultado

- **Funcionalidade:**
  - Toque em qualquer banco da lista para ver detalhes
  - Voltar para resultados

### 4. **Histórico de Simulações**
- **Conteúdo Principal:**
  - Lista de simulações anteriores (data, valor, prazo, melhor banco)
  - Cada item é um card com resumo
  - Botão para deletar histórico

- **Funcionalidade:**
  - Toque para recarregar simulação anterior
  - Persistência local com AsyncStorage

### 5. **Configurações**
- **Conteúdo Principal:**
  - Toggle para modo escuro/claro
  - Seleção de bancos a incluir na simulação
  - Limpar histórico
  - Sobre o aplicativo

- **Funcionalidade:**
  - Preferências do usuário persistidas

## Fluxo de Usuário Principal

1. **Usuário abre o app** → Tela Home com campos vazios
2. **Usuário insere valor e prazo** → Campos validados em tempo real
3. **Usuário toca "Simular"** → Carregamento + Cálculos
4. **Resultados exibidos** → Melhor taxa destacada no topo
5. **Usuário pode:**
   - Toque em um banco → Ver detalhes
   - Compartilhar resultado
   - Voltar e ajustar valores
   - Visualizar histórico

## Cores e Branding

### Paleta de Cores Primária
- **Primary (Destaque):** #0066CC (Azul profissional)
- **Success (Melhor Taxa):** #10B981 (Verde)
- **Warning (Alerta):** #F59E0B (Laranja)
- **Error (Erro):** #EF4444 (Vermelho)
- **Background:** #FFFFFF (Claro) / #0F172A (Escuro)
- **Surface:** #F3F4F6 (Claro) / #1E293B (Escuro)
- **Text Primary:** #111827 (Claro) / #F1F5F9 (Escuro)
- **Text Secondary:** #6B7280 (Claro) / #94A3B8 (Escuro)

### Tipografia
- **Títulos:** Font-size 28px, Font-weight 700
- **Subtítulos:** Font-size 18px, Font-weight 600
- **Body:** Font-size 16px, Font-weight 400
- **Small:** Font-size 14px, Font-weight 400

## Componentes Reutilizáveis

1. **BankResultCard** - Card com resultado de um banco
2. **SimulationInput** - Input com validação
3. **ResultsList** - Lista de resultados com scroll
4. **HistoryItem** - Item do histórico
5. **DetailTable** - Tabela de amortização

## Dados e Estrutura

### Bancos Inclusos (Exemplo)
- Banco do Brasil
- Caixa Econômica Federal
- Bradesco
- Itaú
- Santander
- Nubank
- Inter
- Sicredi

### Estrutura de Dados de Simulação
```typescript
interface SimulationResult {
  id: string;
  amount: number;
  months: number;
  timestamp: Date;
  results: BankResult[];
}

interface BankResult {
  bankId: string;
  bankName: string;
  monthlyRate: number;
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
}
```

## Considerações de UX

- **One-handed usage:** Todos os elementos interativos no terço inferior da tela
- **Feedback visual:** Loading spinners, toasts para ações
- **Acessibilidade:** Contraste adequado, textos descritivos
- **Performance:** Cálculos otimizados, sem travamentos
- **Responsividade:** Funciona em telas de 4.7" a 6.7"
