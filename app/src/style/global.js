import { createGlobalStyle } from 'styled-components'
import { above } from './mixins'
import { colours, fonts, typography } from './variables'
import fontFiles from './fonts'

export const GlobalStyle = createGlobalStyle`
  @font-face {
      font-family: 'Visby CF Heavy';
      src: url('${fontFiles.VisbyCFHeavyEOT}?#iefix') format('embedded-opentype'),
          url('${fontFiles.VisbyCFHeavyWOFF2}') format('woff2'),
          url('${fontFiles.VisbyCFHeavyWOFF}') format('woff'),
          url('${fontFiles.VisbyCFHeavyTTF}') format('truetype'),
          url('${fontFiles.VisbyCFHeavySVG}#youworkforthem') format('svg');
      font-weight: normal;
      font-style: normal;
  }

  @font-face {
      font-family: 'Visby CF Medium';
      src: url('${fontFiles.VisbyCFMediumEOT}?#iefix') format('embedded-opentype'),
          url('${fontFiles.VisbyCFMediumWOFF2}') format('woff2'),
          url('${fontFiles.VisbyCFMediumWOFF}') format('woff'),
          url('${fontFiles.VisbyCFMediumTTF}') format('truetype'),
          url('${fontFiles.VisbyCFMediumSVG}#youworkforthem') format('svg');
      font-weight: normal;
      font-style: normal;
  }

  @font-face {
      font-family: 'Visby CF Bold';
      src: url('${fontFiles.VisbyCFBoldEOT}?#iefix') format('embedded-opentype'),
          url('${fontFiles.VisbyCFBoldWOFF2}') format('woff2'),
          url('${fontFiles.VisbyCFBoldWOFF}') format('woff'),
          url('${fontFiles.VisbyCFBoldTTF}') format('truetype'),
          url('${fontFiles.VisbyCFBoldSVG}#youworkforthem') format('svg');
      font-weight: normal;
      font-style: normal;
  }

  html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}

  html {
    background-color: ${colours.map.water};
    font-size: 12px;

    ${above.sm`
      font-size: 16px;
    `}
  }

  body {
    -ms-overflow-style: -ms-autohiding-scrollbar;
    font-family: ${fonts.body};
    font-size: ${typography.body};
    font-weight: 400;
    letter-spacing: .015rem;
    line-height: 1.65;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${fonts.title};
    line-height: 1.2;
    margin: 0 0 1.75rem;
    text-transform: uppercase;
  }

  h1 {
    font-size: ${typography.h1};
    letter-spacing: 0.5rem;
  }

  h2 {
    font-size: ${typography.h2};
    letter-spacing: 0.4rem;
  }

  h3 {
    font-size: ${typography.h3};
    letter-spacing: 0.3rem;
  }

  h4 {
    font-size: ${typography.h4};
    letter-spacing: 0.2rem;
  }

  h5 {
    font-size: ${typography.h5};
    letter-spacing: 0.1rem;
  }

  h6 {
    font-size: ${typography.h6};
    letter-spacing: 0.1rem;
  }

  ul {
    list-style-type: none;
    margin-bottom: 0;
    margin-top: 0;
    padding-left: 0;
  }
`
