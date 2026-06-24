# Guia de Testes - Conect365

Documento completo para testar todas as funcionalidades do aplicativo Conect365 em Android e iOS.

## 📋 Pré-requisitos

- App instalado no dispositivo (Android 7.0+ ou iOS 13.4+)
- Dispositivo conectado à internet (opcional, para testes de sincronização)
- Tempo estimado: 15-20 minutos

## 🎯 Testes Principais

### 1. Inicialização do App

**Passo 1:** Abra o app Conect365

**Esperado:**
- ✅ Tela de splash aparece por 2-3 segundos
- ✅ Logo Conect365 é exibido com animação suave
- ✅ Após splash, home screen é carregada
- ✅ Sem erros ou crashes

**Se falhar:**
- Reinstale o app
- Limpe cache do app (Configurações → Apps → Conect365 → Armazenamento → Limpar Cache)

---

### 2. Tela Home - Entrada de Dados

**Passo 1:** Na tela home, você verá 3 campos:
- Campo de entrada: "Valor do Financiamento"
- Campo de entrada: "Prazo em Meses"
- Botão: "Simular"

**Teste 1: Validação de Entrada**

1. Deixe os campos vazios
2. Clique em "Simular"

**Esperado:**
- ✅ Mensagem de erro: "Por favor, preencha todos os campos"
- ✅ Botão não permite simulação vazia

**Teste 2: Valores Válidos**

1. Digite no campo de valor: `50000`
2. Digite no campo de prazo: `24`
3. Clique em "Simular"

**Esperado:**
- ✅ Transição para tela de resultados
- ✅ Sem lag ou atraso

**Teste 3: Valores Extremos**

1. Teste com valor muito alto: `999999999`
2. Teste com prazo muito alto: `360`
3. Clique em "Simular"

**Esperado:**
- ✅ App calcula sem erros
- ✅ Resultados são exibidos corretamente

---

### 3. Tela de Resultados

**Passo 1:** Após simular, você verá:
- Lista de 15 bancos com suas taxas
- Melhor taxa destacada em verde
- Valor final com juros para cada banco

**Teste 1: Melhor Taxa Destacada**

1. Observe qual banco tem a menor taxa
2. Verifique se está destacado em verde

**Esperado:**
- ✅ O banco com menor taxa está destacado
- ✅ Cor verde diferencia visualmente
- ✅ Valor final é menor para melhor taxa

**Teste 2: Cálculos Corretos**

1. Selecione um banco qualquer
2. Verifique o valor final: deve ser `Valor × (1 + Taxa)^Meses`

**Exemplo:**
- Valor: 50.000
- Taxa: 1% ao mês
- Prazo: 24 meses
- Valor final esperado: ~63.863

**Teste 3: Scroll da Lista**

1. Deslize para cima/baixo na lista de bancos
2. Verifique se todos os 15 bancos aparecem

**Esperado:**
- ✅ Scroll suave
- ✅ Todos os 15 bancos visíveis
- ✅ Sem lag

---

### 4. Tela de Detalhes do Banco

**Passo 1:** Clique em qualquer banco na lista de resultados

**Esperado:**
- ✅ Abre tela de detalhes
- ✅ Exibe nome do banco
- ✅ Mostra taxa de juros
- ✅ Tabela de amortização é exibida

**Teste 1: Tabela de Amortização**

1. Observe a tabela com colunas:
   - Mês
   - Juros
   - Saldo Devedor

2. Verifique se:
   - Primeira linha mostra juros do mês 1
   - Última linha mostra saldo = 0 (ou muito próximo)
   - Valores aumentam progressivamente

**Esperado:**
- ✅ Tabela exibe todos os meses
- ✅ Valores são precisos
- ✅ Scroll funciona se tabela for grande

**Teste 2: Voltar para Resultados**

1. Clique no botão "Voltar" ou gesto de volta
2. Verifique se retorna à tela de resultados

**Esperado:**
- ✅ Retorna sem perder dados
- ✅ Simulação anterior ainda está visível

---

### 5. Histórico de Simulações

**Passo 1:** Na tela home, procure pela aba "Histórico" (se disponível)

**Teste 1: Salvar Simulação**

1. Faça uma simulação (ex: 50.000 em 24 meses)
2. Volte para home
3. Faça outra simulação (ex: 100.000 em 12 meses)
4. Acesse o histórico

**Esperado:**
- ✅ Ambas as simulações aparecem no histórico
- ✅ Mostram valor e prazo
- ✅ Ordenadas por data (mais recente primeiro)

**Teste 2: Recuperar Simulação**

1. Clique em uma simulação anterior no histórico
2. Verifique se os dados são restaurados

**Esperado:**
- ✅ Campos são preenchidos com valores anteriores
- ✅ Resultados são recalculados corretamente

**Teste 3: Limpar Histórico**

1. Procure por botão "Limpar Histórico"
2. Confirme a ação
3. Verifique se histórico está vazio

**Esperado:**
- ✅ Histórico é limpo
- ✅ Pede confirmação antes de limpar
- ✅ Sem erros

---

### 6. Tema Claro/Escuro

**Teste 1: Alternar Tema**

1. Procure por ícone de tema (lua/sol)
2. Clique para alternar entre claro e escuro

**Esperado:**
- ✅ Interface muda de cor
- ✅ Transição suave
- ✅ Texto legível em ambos os temas

**Teste 2: Persistência de Tema**

1. Altere para tema escuro
2. Feche o app completamente
3. Reabra o app

**Esperado:**
- ✅ Tema escuro é mantido
- ✅ Preferência é salva

---

### 7. Persistência de Dados

**Teste 1: Dados Persistem**

1. Faça uma simulação
2. Acesse o histórico
3. Feche o app completamente (force close)
4. Reabra o app

**Esperado:**
- ✅ Histórico ainda contém a simulação
- ✅ Dados não foram perdidos
- ✅ Tema preferido é mantido

**Teste 2: Limpar Dados do App**

1. Vá para Configurações → Apps → Conect365
2. Clique em "Armazenamento" → "Limpar Dados"
3. Reabra o app

**Esperado:**
- ✅ Histórico está vazio
- ✅ App reinicia como novo
- ✅ Sem erros

---

### 8. Responsividade e Layout

**Teste 1: Orientação Retrato**

1. Mantenha o dispositivo em modo retrato
2. Verifique se todos os elementos são visíveis
3. Teste scroll se necessário

**Esperado:**
- ✅ Layout se adapta bem
- ✅ Botões são clicáveis
- ✅ Texto é legível

**Teste 2: Orientação Paisagem** (se suportado)

1. Rotacione o dispositivo para paisagem
2. Verifique layout

**Esperado:**
- ✅ Layout se adapta
- ✅ Sem elementos cortados
- ✅ Sem erros

---

### 9. Testes de Performance

**Teste 1: Tempo de Cálculo**

1. Digite um valor grande: 999.999.999
2. Digite prazo grande: 360 meses
3. Clique em "Simular"

**Esperado:**
- ✅ Cálculo completa em < 1 segundo
- ✅ Sem travamento
- ✅ Interface responsiva

**Teste 2: Scroll da Tabela**

1. Abra detalhes de um banco
2. Deslize a tabela de amortização

**Esperado:**
- ✅ Scroll suave (60 FPS)
- ✅ Sem lag ou stuttering

---

### 10. Testes de Acessibilidade

**Teste 1: Tamanho de Fonte**

1. Vá para Configurações do dispositivo
2. Aumente o tamanho da fonte
3. Reabra o app

**Esperado:**
- ✅ Texto é maior
- ✅ Layout se adapta
- ✅ Sem elementos cortados

**Teste 2: Contraste**

1. Verifique se texto é legível em ambos os temas
2. Teste em diferentes iluminações

**Esperado:**
- ✅ Contraste adequado
- ✅ Texto legível em luz solar

---

### 11. Testes de Erro

**Teste 1: Valores Inválidos**

1. Tente digitar letras no campo de valor
2. Tente digitar caracteres especiais

**Esperado:**
- ✅ Apenas números são aceitos
- ✅ Sem crashes

**Teste 2: Valores Negativos**

1. Tente digitar valor negativo: `-50000`
2. Clique em "Simular"

**Esperado:**
- ✅ Rejeita valores negativos
- ✅ Mensagem de erro clara

---

## 📊 Checklist de Testes

Marque cada teste conforme completa:

### Funcionalidades Principais
- [ ] Splash screen funciona
- [ ] Home screen carrega
- [ ] Entrada de dados valida
- [ ] Simulação calcula corretamente
- [ ] Resultados exibem 15 bancos
- [ ] Melhor taxa é destacada
- [ ] Detalhes do banco abrem
- [ ] Tabela de amortização exibe corretamente

### Histórico
- [ ] Simulações são salvas
- [ ] Histórico exibe todas as simulações
- [ ] Recuperar simulação funciona
- [ ] Limpar histórico funciona

### Tema e Persistência
- [ ] Alternar tema funciona
- [ ] Tema é persistido
- [ ] Dados persistem após fechar app
- [ ] Limpar dados funciona

### Performance
- [ ] Cálculos são rápidos
- [ ] Scroll é suave
- [ ] Sem travamentos

### Acessibilidade
- [ ] Texto é legível
- [ ] Layout se adapta
- [ ] Contraste é adequado

### Erros
- [ ] Validação de entrada funciona
- [ ] Sem crashes em valores extremos
- [ ] Mensagens de erro são claras

---

## 🐛 Reportar Bugs

Se encontrar algum problema, anote:

1. **O que você estava fazendo:**
   - Ex: "Tentei simular com valor 50.000 e prazo 24 meses"

2. **O que aconteceu:**
   - Ex: "App crashou com erro de cálculo"

3. **O que deveria ter acontecido:**
   - Ex: "Deveria exibir resultados com 15 bancos"

4. **Informações do dispositivo:**
   - Modelo: Ex: "Samsung Galaxy S21"
   - Android/iOS: Ex: "Android 12"
   - Versão do app: Ex: "1.0.0"

---

## ✅ Teste Completo

Se todos os testes acima passarem, o app está **pronto para produção**! 🎉

**Tempo total estimado:** 15-20 minutos

---

**Última atualização:** Junho 2026  
**Versão do app:** 1.0.0  
**Status:** Pronto para testes ✅
