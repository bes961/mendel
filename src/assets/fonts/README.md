# Fontes Poppins

Para usar as fontes Poppins localmente no projeto, siga estas instruções:

## Baixando as fontes

1. Acesse o site do Google Fonts: https://fonts.google.com/specimen/Poppins
2. Clique em "Download family"
3. Extraia o arquivo ZIP
4. Copie os seguintes arquivos para esta pasta (`frontend/src/assets/fonts/`):
   - Poppins-Light.ttf
   - Poppins-Regular.ttf
   - Poppins-Italic.ttf
   - Poppins-Medium.ttf
   - Poppins-MediumItalic.ttf
   - Poppins-SemiBold.ttf
   - Poppins-Bold.ttf

## Ativando as fontes locais

Depois de adicionar as fontes, descomente as definições `@font-face` no arquivo `frontend/src/styles/LerQRCode.css` e comente a importação do Google Fonts.

```css
/* Comente esta linha */
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'); */

/* E descomente estas definições */
@font-face {
    font-family: 'Poppins';
    src: url('../assets/fonts/Poppins-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
}

// ... outras definições de fonte
``` 