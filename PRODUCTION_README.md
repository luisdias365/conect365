# Conect365 - Simulador de Financiamento

Aplicativo móvel para simular e comparar taxas de financiamento em 15 instituições financeiras brasileiras.

## 🎯 Características

- **Simulação de Financiamento:** Calcule o valor final com juros compostos
- **Comparação de Bancos:** Compare taxas de 15 instituições financeiras
- **Melhor Taxa Destacada:** Identifique automaticamente a melhor opção
- **Tabela de Amortização:** Visualize o cronograma de pagamentos
- **Histórico de Simulações:** Acesse simulações anteriores
- **Tema Claro/Escuro:** Interface adaptável ao seu dispositivo
- **Persistência Local:** Dados salvos localmente no dispositivo

## 📱 Bancos Suportados

1. Banco do Brasil
2. Caixa
3. Bradesco
4. Itaú
5. Santander
6. Nubank
7. Inter
8. Sicredi
9. BV Financeira
10. Banco Pan
11. Banco C6
12. Banco Safra
13. Banco Daycoval
14. Banco Omni
15. Banco Carbank

## 🛠 Stack Técnico

- **Framework:** React Native com Expo SDK 54
- **Linguagem:** TypeScript
- **Estilo:** NativeWind (Tailwind CSS)
- **Navegação:** Expo Router
- **Persistência:** AsyncStorage
- **Testes:** Vitest
- **Build:** EAS (Expo Application Services)

## 📋 Requisitos do Sistema

### Para Desenvolvimento
- Node.js 18+
- pnpm 9+
- Expo CLI
- Android Studio (para Android)
- Xcode (para iOS, macOS apenas)

### Para Usuários
- **Android:** 7.0 (API 24) ou superior
- **iOS:** 13.4 ou superior

## 🚀 Instalação e Setup

### 1. Clonar Repositório
```bash
git clone <repository-url>
cd cópia-de-conect365
```

### 2. Instalar Dependências
```bash
pnpm install
```

### 3. Executar em Desenvolvimento
```bash
# Web
pnpm dev:metro

# Android (requer Android Studio)
pnpm android

# iOS (requer macOS e Xcode)
pnpm ios
```

### 4. Testar
```bash
# Executar testes unitários
pnpm test

# Verificar tipos TypeScript
pnpm check

# Lint
pnpm lint
```

## 📦 Build e Deploy

### Build Local
```bash
# Android
eas build --platform android --profile preview

# iOS
eas build --platform ios --profile preview
```

### Deploy para Produção
```bash
# Android (Google Play)
eas build --platform android --auto-submit

# iOS (App Store)
eas build --platform ios --auto-submit
```

Para instruções detalhadas, consulte [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md).

## 🔧 Configuração Nativa

Permissões e configurações específicas de cada plataforma estão documentadas em [NATIVE_CONFIG.md](./NATIVE_CONFIG.md).

## 📊 Estrutura do Projeto

```
cópia-de-conect365/
├── app/                          # Telas e rotas
│   ├── (tabs)/
│   │   ├── index.tsx            # Tela Home
│   │   ├── results.tsx          # Tela de Resultados
│   │   └── _layout.tsx          # Layout das abas
│   ├── bank-detail.tsx          # Detalhes do banco
│   └── _layout.tsx              # Layout raiz
├── components/                   # Componentes reutilizáveis
│   ├── screen-container.tsx     # Container com SafeArea
│   ├── splash-screen.tsx        # Tela de splash
│   └── ui/
├── lib/                          # Lógica e utilitários
│   ├── banks.ts                 # Dados e cálculos de bancos
│   ├── calculations.ts          # Lógica de financiamento
│   ├── types.ts                 # Tipos TypeScript
│   └── theme-provider.tsx       # Contexto de tema
├── hooks/                        # Custom hooks
│   ├── use-colors.ts            # Hook de cores
│   ├── use-simulation-history.ts # Hook de histórico
│   └── use-color-scheme.ts      # Hook de tema
├── constants/                    # Constantes
│   ├── banks.ts                 # Lista de bancos
│   └── theme.ts                 # Cores do tema
├── assets/                       # Imagens e ícones
│   └── images/
│       ├── icon.png             # Ícone do app
│       ├── splash-icon.png      # Logo da splash
│       └── favicon.png          # Favicon web
├── app.config.ts                # Configuração Expo
├── tailwind.config.js           # Configuração Tailwind
├── package.json                 # Dependências
└── tsconfig.json                # Configuração TypeScript
```

## 🧪 Testes

O projeto inclui 24 testes unitários cobrindo 100% da lógica de cálculo.

```bash
# Executar testes
pnpm test

# Executar com coverage
pnpm test -- --coverage

# Watch mode
pnpm test -- --watch
```

## 🎨 Temas

O app suporta tema claro e escuro automaticamente baseado nas preferências do sistema.

### Cores Principais
- **Primária:** #0a7ea4 (Azul)
- **Fundo:** #ffffff (Claro) / #151718 (Escuro)
- **Superfície:** #f5f5f5 (Claro) / #1e2022 (Escuro)
- **Sucesso:** #22C55E
- **Aviso:** #F59E0B
- **Erro:** #EF4444

## 📝 Logs e Debugging

### Logs de Desenvolvimento
```bash
# Ativar logs detalhados
DEBUG=* pnpm dev:metro
```

### Debugging no Android
```bash
# Acessar logs do dispositivo
adb logcat
```

### Debugging no iOS
```bash
# Usar Xcode Console
# Ou acessar via Safari DevTools
```

## 🔐 Segurança

- Apenas HTTPS permitido (Android)
- Sem criptografia de exportação (iOS)
- AsyncStorage para dados sensíveis (com criptografia opcional)
- Validação de entrada em todos os campos

## 📈 Performance

- Testes unitários: ~500ms
- Build Android: ~5-10 minutos
- Build iOS: ~10-15 minutos
- Tamanho do APK: ~50-60MB
- Tamanho do IPA: ~80-100MB

## 🐛 Troubleshooting

### App não inicia
1. Limpar cache: `pnpm start -- --reset-cache`
2. Reinstalar dependências: `rm -rf node_modules && pnpm install`
3. Verificar logs: `adb logcat` ou Xcode Console

### Erro de permissões
1. Verificar `app.config.ts`
2. Verificar `NATIVE_CONFIG.md`
3. Reinstalar app no dispositivo

### Erro de build
1. Atualizar Expo CLI: `npm install -g expo-cli`
2. Limpar build cache: `eas build:cache --clear`
3. Verificar versões: `node --version`, `pnpm --version`

## 📞 Suporte

- **Documentação Expo:** https://docs.expo.dev
- **Comunidade Expo:** https://forums.expo.dev
- **Issues:** Reportar no repositório do projeto

## 📄 Licença

Propriedade de Conect365. Todos os direitos reservados.

## 🎉 Próximas Melhorias

- [ ] Filtro de bancos (Digital vs. Tradicional)
- [ ] Exportação em PDF
- [ ] Integração com API de taxas reais
- [ ] Notificações de promoções
- [ ] Gráficos de comparação visual
- [ ] Sincronização em nuvem
- [ ] Suporte a múltiplas moedas

---

**Versão:** 1.0.0  
**Última atualização:** Maio 2026  
**Status:** Pronto para produção ✅
