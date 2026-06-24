# Guia de Deploy - Conect365

## Informações do Projeto

| Propriedade | Valor |
|-------------|-------|
| **Nome do App** | Conect365 |
| **Slug** | simulador-financiamento-mobile |
| **Versão** | 1.0.0 |
| **Bundle ID (iOS)** | space.manus.simulador.financiamento.mobile.t20260504203015 |
| **Package (Android)** | space.manus.simulador.financiamento.mobile.t20260504203015 |
| **Orientação** | Portrait |
| **Suporte a Tablet** | Sim (iOS) |

## Pré-requisitos

### Para Ambas as Plataformas
- Node.js 18+ e pnpm 9+
- Expo CLI instalado globalmente
- Conta no Expo (https://expo.dev)
- EAS CLI instalado (`npm install -g eas-cli`)

### Para Android
- Android Studio 2024.1+
- Java Development Kit (JDK) 11+
- Google Play Developer Account
- Keystore para assinatura (será gerado automaticamente pelo EAS)

### Para iOS
- macOS 12+
- Xcode 15+
- Apple Developer Account
- Certificados de desenvolvimento/distribuição

## Processo de Deploy com EAS

### 1. Configurar EAS

```bash
# Fazer login no Expo
eas login

# Inicializar EAS no projeto (se não estiver configurado)
eas build:configure
```

### 2. Build para Android

#### Opção A: Build Gerenciado (Recomendado)
```bash
# Build para Google Play (release)
eas build --platform android --auto-submit

# Build para teste (debug)
eas build --platform android --profile preview
```

#### Opção B: Build Local
```bash
# Gerar APK localmente
eas build --platform android --local
```

**Saída esperada:** `app-release.apk` ou `app-release-unsigned.apk`

### 3. Build para iOS

#### Opção A: Build Gerenciado (Recomendado)
```bash
# Build para App Store
eas build --platform ios --auto-submit

# Build para TestFlight
eas build --platform ios --profile preview
```

#### Opção B: Build Local
```bash
# Requer macOS e Xcode
eas build --platform ios --local
```

**Saída esperada:** `app.ipa`

## Upload para Lojas de Apps

### Google Play Store

1. **Preparar Assinatura:**
   ```bash
   # EAS gerencia automaticamente
   # Ou gerar manualmente:
   keytool -genkey -v -keystore conect365.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias conect365
   ```

2. **Upload do APK:**
   - Acessar Google Play Console (https://play.google.com/console)
   - Criar novo app ou usar existente
   - Upload do APK gerado
   - Preencher informações (descrição, screenshots, etc.)
   - Submeter para review

3. **Configurações Recomendadas:**
   - Versão mínima: Android 7.0 (API 24)
   - Versão alvo: Android 14 (API 34)
   - Arquiteturas: ARM 32-bit e 64-bit

### App Store

1. **Preparar Certificados:**
   - Acessar Apple Developer (https://developer.apple.com)
   - Registrar bundle ID: `space.manus.simulador.financiamento.mobile.t20260504203015`
   - Criar certificados de distribuição
   - Criar provisioning profile

2. **Upload do IPA:**
   - Usar Xcode ou Transporter
   - Acessar App Store Connect (https://appstoreconnect.apple.com)
   - Criar novo app
   - Upload do IPA
   - Preencher informações (descrição, screenshots, etc.)
   - Submeter para review

3. **Configurações Recomendadas:**
   - Versão mínima: iOS 13.4
   - Suporte a iPad: Sim
   - Orientações: Portrait

## Configurações de Versão

### Versionamento Semântico
```
1.0.0 = MAJOR.MINOR.PATCH
```

**Para atualizar versão:**
1. Editar `version` em `app.config.ts`
2. Editar `runtimeVersion` em `app.config.ts`
3. Commit e push
4. Executar novo build

### Exemplo de Atualização
```typescript
// app.config.ts
version: "1.1.0",
runtimeVersion: "1.1.0",
```

## Testes Pré-Deploy

### Testes Locais
```bash
# TypeScript check
pnpm check

# Executar testes unitários
pnpm test

# Lint
pnpm lint
```

### Testes em Dispositivo
```bash
# Android
eas build --platform android --profile preview
# Escanear QR code com Expo Go

# iOS
eas build --platform ios --profile preview
# Escanear QR code com Expo Go
```

## Monitoramento Pós-Deploy

### Métricas para Acompanhar
- Taxa de crash
- Tempo de inicialização
- Uso de memória
- Taxa de retenção de usuários

### Ferramentas Recomendadas
- **Firebase Crashlytics:** Para relatórios de crash
- **Sentry:** Para error tracking
- **Google Analytics:** Para comportamento do usuário

## Troubleshooting

### Erro: "Bundle ID já existe"
```bash
# Usar bundle ID único
# Editar app.config.ts e alterar o timestamp
```

### Erro: "Certificado expirado"
```bash
# Renovar certificados no Apple Developer
# Atualizar provisioning profiles
```

### Erro: "APK não assinado"
```bash
# EAS assina automaticamente
# Se build local: usar keytool para gerar keystore
```

### App não inicia no dispositivo
```bash
# Verificar logs
eas build:view

# Verificar permissões em app.config.ts
# Validar deep linking
```

## Rollback de Versão

### Google Play
1. Acessar Google Play Console
2. Ir para "Releases" → "Production"
3. Selecionar versão anterior
4. Clicar "Rollback"

### App Store
1. Acessar App Store Connect
2. Ir para "TestFlight" ou "Production"
3. Selecionar versão anterior
4. Clicar "Reject This Version"

## Próximas Melhorias

- [ ] Implementar Firebase Crashlytics
- [ ] Adicionar analytics
- [ ] Configurar CI/CD automático
- [ ] Adicionar testes E2E
- [ ] Implementar beta testing via TestFlight/Google Play Beta

## Contato e Suporte

Para dúvidas sobre deploy:
- Documentação Expo: https://docs.expo.dev
- Documentação EAS: https://docs.expo.dev/eas
- Comunidade Expo: https://forums.expo.dev
