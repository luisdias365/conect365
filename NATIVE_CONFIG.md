# Configurações Nativas - Conect365

## iOS (Info.plist)

As seguintes permissões foram configuradas no `app.config.ts`:

| Permissão | Descrição | Motivo |
|-----------|-----------|--------|
| `ITSAppUsesNonExemptEncryption` | false | App não usa criptografia de exportação |
| `NSLocalNetworkUsageDescription` | "Conect365 usa sua rede local para sincronizar dados" | Acesso à rede local para sincronização |
| `NSBonjourServiceTypes` | ["_http._tcp"] | Suporte para serviços Bonjour |
| `NSUserTrackingUsageDescription` | "Rastreamento para melhorar sua experiência" | Rastreamento de usuário para analytics |

**Requisitos de Deploy iOS:**
- Xcode 15.0 ou superior
- iOS 13.4 ou superior (deployment target)
- Apple Developer Account para assinatura
- Certificados de desenvolvimento/distribuição

## Android

### Permissões Configuradas

| Permissão | Descrição |
|-----------|-----------|
| `POST_NOTIFICATIONS` | Permitir notificações push |
| `INTERNET` | Acesso à internet para API calls |

### Configurações de Build

| Propriedade | Valor | Descrição |
|-------------|-------|-----------|
| `minSdkVersion` | 24 | Android 7.0 (API 24) |
| `targetSdkVersion` | 34 | Android 14 (API 34) |
| `compileSdkVersion` | 34 | Compilar com API 34 |
| `buildArchs` | armeabi-v7a, arm64-v8a | Suportar 32 e 64 bits |
| `usesCleartextTraffic` | false | Apenas HTTPS |

**Requisitos de Deploy Android:**
- Android Studio 2024.1 ou superior
- Java Development Kit (JDK) 11 ou superior
- Google Play Developer Account
- Keystore para assinatura de APK

## Recursos Habilitados

### Expo Router
- Navegação baseada em arquivo
- Deep linking automático
- Type-safe routes

### Splash Screen
- Logo personalizado Conect365
- Animações suaves
- Suporte a tema claro/escuro

### Build Properties
- React Native New Architecture habilitada
- TypeScript compiler paths habilitados
- React Compiler habilitado

## Próximos Passos para Deploy

### Android (Google Play)
1. Gerar keystore para assinatura
2. Configurar credenciais no EAS
3. Executar `eas build --platform android`
4. Upload do APK para Google Play Console

### iOS (App Store)
1. Configurar certificados de desenvolvimento
2. Registrar bundle ID no Apple Developer
3. Executar `eas build --platform ios`
4. Upload do IPA para App Store Connect

## Variáveis de Ambiente

Nenhuma variável de ambiente é necessária para o funcionamento básico do app. Todas as configurações estão em `app.config.ts`.

## Testes Recomendados

- [ ] Testar em dispositivo físico Android
- [ ] Testar em dispositivo físico iOS
- [ ] Validar deep linking
- [ ] Testar modo offline
- [ ] Validar persistência de dados (AsyncStorage)
- [ ] Testar tema claro/escuro
- [ ] Validar animações de splash screen
