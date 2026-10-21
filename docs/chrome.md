# Instalar o Google Chrome pelo terminal.

## 1. Verifique sua distribuição Linux

Execute:

```bash
cat /etc/os-release

PRETTY_NAME="Ubuntu 26.04.1 LTS"
NAME="Ubuntu"
VERSION_ID="26.04"
VERSION="26.04.1 LTS (Resolute Raccoon)"
VERSION_CODENAME=resolute
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=resolute
LOGO=ubuntu-logo
```

Se aparecer Ubuntu, Debian ou Linux Mint, siga os passos abaixo.

## 2. Instale o Google Chrome

Para Ubuntu, Debian e distribuições baseadas em Debian de 64 bits.

Execute estes comandos no terminal, um de cada vez.

Passo 1 — Baixar o instalador oficial:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
```

Passo 2 — Instalar o Chrome:

```bash
sudo apt install ./google-chrome-stable_current_amd64.deb
```

Digite sua senha do Linux quando solicitado e confirme a instalação, se necessário. Esses são os procedimentos de instalação por pacote `.deb` indicados para sistemas compatíveis.

Se o seu sistema não for baseado em Debian/Ubuntu, não execute esses comandos ainda.

## 3. Verifique se foi instalado

Execute:

```bash
google-chrome --version

Google Chrome 156.0.8078.47 
```

Se aparecer algo como `Google Chrome  ...`, a instalação funcionou.

## 4. Execute seu teste Cypress no Chrome

Entre na pasta do projeto e execute:

```bash
npx cypress run --spec "cypress/e2e/usuarios/crud.cy.js" --browser chrome
```

Para abrir a interface visual do Cypress usando o Chrome:

bash
```
npx cypress open
```

Depois, selecione o navegador Chrome na interface.
