# Guia Rápido: Gerar APK do Conect365 no Seu Computador

Este guia mostra como gerar um APK pronto para instalar no seu dispositivo Android em poucos minutos.

## ⏱️ Tempo Estimado: 10-15 minutos

## 📋 Pré-requisitos

- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Conta Expo criada (você já criou!)
- EAS CLI instalado (`npm install -g eas-cli`)

## 🚀 Passo-a-Passo

### Passo 1: Abrir Terminal/Prompt de Comando

No seu computador, abra o terminal (Mac/Linux) ou PowerShell (Windows).

### Passo 2: Fazer Login no Expo

```bash
eas login
```

**O que acontece:**
- Uma janela do navegador abrirá automaticamente
- Faça login com suas credenciais:
  - Email: `luishdias706@gmail.com`
  - Senha: `luis.dias5847`
- Confirme o login no navegador
- Volte ao terminal (o login será confirmado automaticamente)

### Passo 3: Navegar até o Projeto

```bash
cd /home/ubuntu/cópia-de-conect365
```

**Nota:** Se você clonou o projeto em outro local, navegue até lá.

### Passo 4: Gerar o APK

```bash
eas build --platform android --profile preview
```

**O que acontece:**
- EAS começará a preparar o build
- Você verá uma barra de progresso
- O build será feito na nuvem (não usa recursos do seu computador)
- Levará ~5-10 minutos

### Passo 5: Baixar o APK

Quando o build terminar:
1. Você verá uma URL no terminal
2. Clique na URL ou copie-a no navegador
3. Clique em "Download" para baixar o APK

**Exemplo de URL:**
```
https://expo.dev/builds/abc123def456
```

## 📱 Instalar no Android

### Opção 1: Transferência Direta (Recomendado)

1. **Conecte seu Android ao computador** via cabo USB
2. **Ative "Transferência de Arquivos"** no Android
3. **Copie o APK** para a pasta `Downloads` do seu Android
4. **No Android:**
   - Abra o gerenciador de arquivos
   - Navegue até `Downloads`
   - Toque no arquivo `.apk`
   - Toque em "Instalar"
   - Confirme as permissões

### Opção 2: Email

1. **Envie o APK** para você mesmo por email
2. **No Android:**
   - Abra o email
   - Baixe o anexo
   - Toque no arquivo `.apk`
   - Toque em "Instalar"

### Opção 3: ADB (Para Desenvolvedores)

Se você tem Android SDK instalado:

```bash
adb install app-release.apk
```

## ✅ Verificar a Instalação

Após instalar:
1. Procure por "Conect365" na sua tela inicial
2. Toque no ícone para abrir
3. Você verá a tela de splash com o logo
4. Teste a simulação de financiamento

## 🐛 Troubleshooting

### "Login não funcionou"
```bash
# Faça logout e tente novamente
eas logout
eas login
```

### "Build falhou"
```bash
# Limpe o cache e tente novamente
eas build:cache --clear
eas build --platform android --profile preview
```

### "APK não instala"
1. Verifique se você tem espaço livre no Android
2. Vá para Configurações → Segurança → Ativar "Fontes Desconhecidas"
3. Tente instalar novamente

### "Não consigo fazer download"
1. Verifique sua conexão com a internet
2. Tente novamente acessando a URL no navegador
3. Se persistir, entre em contato com suporte Expo

## 📊 Monitorar o Build

Você pode acompanhar o progresso do build em tempo real:

```bash
# Ver status do build
eas build:view

# Ver logs detalhados
eas build:view --build-id <id>
```

## 🎯 Próximos Passos

Após instalar e testar:

1. **Teste a funcionalidade:**
   - Insira um valor de financiamento
   - Verifique as taxas dos bancos
   - Teste o histórico de simulações

2. **Para Deploy em Produção:**
   - Siga o `DEPLOY_GUIDE.md`
   - Submeta para Google Play Store

3. **Para Desenvolvimento:**
   - Use `pnpm dev:metro` para desenvolvimento local
   - Escaneie o QR code com Expo Go

## 💡 Dicas

- **Versão de Teste:** Este APK é para testes. Para produção, use `--profile release`
- **Atualizações:** Cada vez que você mudar o código, execute novamente o comando de build
- **Múltiplos Dispositivos:** Você pode instalar o mesmo APK em vários Android

## 📞 Suporte

- **Documentação EAS:** https://docs.expo.dev/eas
- **Comunidade Expo:** https://forums.expo.dev
- **Issues:** Reporte no repositório do projeto

---

**Pronto para começar?** Execute o Passo 2 agora! 🚀
