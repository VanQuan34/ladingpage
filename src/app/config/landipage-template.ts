import { uid } from "uid";

interface IEmptyPage{
  style: string;
  body: string;

}
const getDefaultTemplate = (): IEmptyPage =>
{
  const sectionId = `comp-${uid()}`;
  const headerId = `comp-${uid()}`;
  const footerId = `comp-${uid()}`;
  const logoId = `comp-${uid()}`;
  const textId = `comp-${uid()}`;
  const pageId = `comp-${uid()}`;
  const pageContainerId = `comp-${uid()}`;

  const template: IEmptyPage = {
  style: `
    body{
      font-family: Helvetica, Helvetica neue, Arial, Verdana, sans-serif;
      width: 100%; background-color: #fff;
    }

    *{
      box-sizing:border-box;
      background: transparent;
      border: 0;
      margin: 0;
      outline: 0;
      padding: 0;
      vertical-align: baseline;
    }
    
    p {
      margin: 0px;
      padding: 0px;
    }

    .mo-comp-container {
      position: relative;
      box-sizing: border-box;
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr;
    }
    
    .mo-comp {
      align-self: start;
      justify-self: start;
      position: relative;
      grid-area: 1/1/2/2;
      display: grid;
    }

    .mo-comp-text {
      word-wrap: break-word;
      text-align: start;
    }

    h1,h2,h3,h4,h5,h6 {
      margin: 0px;
    }

    #${headerId} {
      min-height: 100px;
      --bg: rgba(var(--c11) ,0);
      background: var(--bg);
      grid-template-rows: 1fr;
      grid-template-columns: 1fr;
    }

    #${footerId} {
      min-height: 100px;
      --bg: rgba(var(--c11) ,0);
      background: var(--bg);
      grid-template-rows: 1fr;
      grid-template-columns: 1fr;
    }

    #${sectionId} {
      min-height: 500px;
      --bg: rgba(var(--c11) ,0);
      background: var(--bg);
      grid-template-rows: 1fr;
      grid-template-columns: 1fr;
    }


    #${logoId} {
      height: 50px; 
      width: 125px; 
      margin-left: 60px;
      margin-right: 0px;
      margin-top: 0px;
      margin-bottom: 0px;
      align-self: center;
      justify-self: start;
    }

    #${textId} {
      align-self: center;
      justify-self: center;
      margin-left: 0px;
      margin-right: 0%;
      margin-top: 0px;
      margin-bottom: 0px;
      grid-area: 1/1/2/2;
    }

    .mo-page-bg {
      bottom: 0;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      background: var(--bg);
      overflow: hidden;
    } 

    .mo-page {
      position: relative;
    }

    #${pageId} {
      --bg: rgba(var(--c11) ,1);
    }
    
    .flickity-prev-next-button {
      position: absolute;
      top: 50%;
      width: 35px;
      height: 35px;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      /* vertically center */
      -webkit-transform: translateY(-50%);
              transform: translateY(-50%);
    }
    
    .flickity-prev-next-button:hover { background: white; }
    
    .flickity-prev-next-button:focus {
      outline: none;
      box-shadow: 0 0 0 5px #09F;
    }
    
    .flickity-prev-next-button:active {
      opacity: 0.6;
    }
    
    .flickity-prev-next-button.previous { left: 10px; }
    .flickity-prev-next-button.next { right: 10px; }
    
    .flickity-prev-next-button:disabled {
      opacity: 0.3;
      cursor: auto;
    }
    
    .flickity-prev-next-button svg {
      position: absolute;
      left: 20%;
      top: 20%;
      width: 60%;
      height: 60%;
    }
    
    `,
  body: `
  <body>

    <div class="mo-page" id="${pageId}" mo-type="page">
      <div class="mo-page-bg"></div>

      <div id="${headerId}" mo-type="header" class="mo-comp mo-comp-container">
        <div id="${logoId}" mo-type="icon" class="mo-comp">
            <a href="https://nguyenlqvn1.editorx.io/my-site-10">
              <div class="full-object">
                <svg preserveAspectRatio="xMidYMid meet" data-bbox="0.5 0 113.59 44" xmlns="http://www.w3.org/2000/svg" viewBox="0.5 0 113.59 44" height="44" width="115" data-type="color" role="img" aria-labelledby="svgcid--nj1wt1-ovfqno"><defs></defs><title id="svgcid--nj1wt1-ovfqno">Homepage</title>
                  <g>
                    <path d="M44.5 0v44H.5V0h44zm32.15 15.6c1.268 0 2.37.273 3.31.82.94.547 1.664 1.333 2.17 2.36.508 1.027.76 2.233.76 3.62s-.252 2.593-.76 3.62c-.506 1.027-1.23 1.813-2.17 2.36-.94.547-2.042.82-3.31.82-1.266 0-2.366-.273-3.3-.82-.932-.547-1.652-1.333-2.16-2.36-.506-1.027-.76-2.233-.76-3.62s.254-2.593.76-3.62c.508-1.027 1.228-1.813 2.16-2.36.934-.547 2.034-.82 3.3-.82zm15.87 0c1.36 0 2.48.253 3.36.76.88.507 1.573 1.293 2.08 2.36l-1.96.94-.09-.234a3.001 3.001 0 00-1.19-1.406c-.6-.373-1.32-.56-2.16-.56-1.253 0-2.247.433-2.98 1.3-.733.867-1.1 2.08-1.1 3.64 0 1.587.35 2.81 1.05 3.67.7.86 1.723 1.29 3.07 1.29 1.053 0 1.907-.26 2.56-.78s.98-1.273.98-2.26v-.38H92.1v-1.76h5.94V29h-1.58l-.06-1.68-.134.195A3.856 3.856 0 0194.8 28.71c-.68.327-1.493.49-2.44.49-1.227 0-2.3-.273-3.22-.82-.92-.547-1.633-1.33-2.14-2.35-.507-1.02-.76-2.23-.76-3.63 0-1.387.26-2.59.78-3.61s1.253-1.807 2.2-2.36c.947-.553 2.047-.83 3.3-.83zm15.33 0c1.266 0 2.37.273 3.31.82.94.547 1.662 1.333 2.17 2.36.506 1.027.76 2.233.76 3.62s-.254 2.593-.76 3.62c-.508 1.027-1.23 1.813-2.17 2.36-.94.547-2.044.82-3.31.82-1.268 0-2.368-.273-3.3-.82-.934-.547-1.654-1.333-2.16-2.36-.508-1.027-.76-2.233-.76-3.62s.252-2.593.76-3.62c.506-1.027 1.226-1.813 2.16-2.36.932-.547 2.032-.82 3.3-.82zm-85.582-1.12h-3.784V29H29.55v-2.926h-7.282V14.48zm38.614 1.32v11.36h7.28V29h-9.42V15.8h2.14zm15.769 1.66c-1.24 0-2.213.433-2.92 1.3-.707.867-1.06 2.08-1.06 3.64s.353 2.773 1.06 3.64c.707.867 1.68 1.3 2.92 1.3 1.253 0 2.233-.433 2.94-1.3.707-.867 1.06-2.08 1.06-3.64s-.353-2.773-1.06-3.64c-.707-.867-1.687-1.3-2.94-1.3zm31.198 0c-1.24 0-2.213.433-2.92 1.3-.707.867-1.06 2.08-1.06 3.64s.353 2.773 1.06 3.64c.707.867 1.68 1.3 2.92 1.3 1.253 0 2.233-.433 2.94-1.3.707-.867 1.06-2.08 1.06-3.64s-.353-2.773-1.06-3.64c-.707-.867-1.687-1.3-2.94-1.3z" fill="#C7C7C7" fill-rule="evenodd" data-color="1"></path>
                  </g>
                </svg>
              </div>
            </a>
        </div>
      </div>

      <section id="${sectionId}" mo-type="section" class="mo-comp mo-comp-container">

      </section>

      <div id="${footerId}" mo-type="footer" class="mo-comp mo-comp-container">
        <div id="${textId}" mo-type="text" class="mo-comp mo-comp-text">
          <p class="font-8">© 2023 by Name of Site. Created on <a href="https://editorx.com" target="_blank" data-content="https://editorx.com" data-type="external" rel="nofollow noopener">WEB_BUILDER MOBIO.</a></p>
        </div>
      </div>

    <div>
  </body> `};

  return template;
};

const DemoTemplate: IEmptyPage = 
{
  style: `
  body{
    font-family: Helvetica, Helvetica neue, Arial, Verdana, sans-serif;
    width: 100%;
    margin: 0px;
    padding: 0px;
    line-height: 150%;
  }

  p {
    margin: 0px;
    padding: 0px;
  }

  .mo-d-none {
    display: none;
  }

  .mo-d-block {
    display: block;
  }

  .mo-layout-item {
    align-self: stretch;
    justify-self: stretch;
    position: relative;
  }   

  .mo-layout-header, .mo-layout-footer {
    min-height: 100px;
  }

  .mo-layout-section {
    display: grid;
    align-self: stretch;
    justify-self: stretch;
    grid-area: 1/1/2/2;
    position: relative;
    height: auto;
    box-sizing: border-box;
  }
  
  .mo-layout-container {
    position: relative;
    box-sizing: border-box;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }

  .mo-layout-comp {
    width: auto;
    height: auto;
  }

  .mo-comp {
    align-self: start;
    justify-self: start;
    position: relative;
    grid-area: 1/1/2/2;
    display: grid;
  }

  .full-object {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .mo-comp-text {
    word-wrap: break-word;
    text-align: start;
  }

  .font-head-2 {
    font-style: normal;
    text-decoration: none;
    font-size: 35px;
    line-height: 150%;
    letter-spacing: normal;
    margin: 0px;
    color: #fff
  }

  .font-head-3 {
    font-style: normal;
    text-decoration: none;
    font-size: 30px;
    line-height: 150%;
    letter-spacing: normal;
    margin: 0px;
    color: #fff
  }

  .font-head-1 {
    font-style: normal;
    text-decoration: none;
    font-size: 37px;
    line-height: 150%;
    margin: 0px;
    color: #fff;
  }

  .font-head-6 {
    font-style: normal;
    text-decoration: none;
    font-size: 19px;
    line-height: 150%;
    margin: 0px;
    color: #fff;
  }

  .font_8 {
    font-family: Arial;
    font-size: 14px;
    color: #000000;
    line-height: 150%;
  }


  .mo-comp-button-inner {
    transition: border-color 0.4s ease 0s, background-color 0.4s ease 0s;
    position: relative;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: poiter;

    background-color: rgba(0, 0, 0, 1);
    border: solid rgba(0, 0, 0, 1) 0px;
    border-radius: 30px;
    color: #fff;
    min-height: 46px;
  }

  .mo-comp-button-inner span {
    font-style: 700;
    transition: color 0.4s ease 0s;
    font-family: Arial;
  }

  *{
    box-sizing:border-box;
  }

  #comp-abfkhkr12 {
    height: 50px; 
    width: 125px; 
    margin-left: 60px;
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    align-self: center;
  }

  #comp-anfg234da {
    margin-left: 30px;
    margin-right: 0%;
    margin-top: 30px;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
    height: auto;
    width: 300px;
  }

  #section-abcmdgfg4 {
    min-height: 500px;
  }

  #section-234542d {
    grid-template-rows: minmax(166.66666666666666px,max-content) minmax(166.66666666666666px,max-content) 1fr;
    grid-template-columns: minmax(166.66666666666666px,max-content) 1fr 1fr;
    min-height: 500px;
  }

  #comp-asdbcnwer { 
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px; 
    grid-area: 1/1/1/1;
    min-height: 46px;
    height: auto;
    width: 142px;
    align-self: center;
    justify-self: center;
  }

  #comp-abcndgerg {
    align-self: center;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
  }

  #comp-asdfrfds {
    align-self: center;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 1/1/4/4;
    background-color: #cacaca;
    width: 500px;
    height: 350px;
    grid-template-rows: minmax(100px, max-content) 1fr;
    grid-template-columns: 1fr 2fr;
  }

  #comp-awewqees {
    align-self: start;
    justify-self: start;
    margin-left: 300px;
    margin-right: 0px;
    margin-top: 150px;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
    background-color: blue;
    width: 100px;
    height: 350px;
  }

  #comp-asdbcnwem { 
    margin-left: 40px;
    margin-right: 0px;
    margin-top: 145px;
    margin-bottom: 0px;
    min-height: 46px;
    height: auto;
    width: 50.567856%;
    align-self: start;
    justify-self: start;
    grid-area: 1/1/3/2;
  }

  #comp-asdbcnwem2 { 
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    min-height: 46px;
    height: auto;
    width: 142px;
    align-self: center;
    justify-self: center;
    grid-area: 1/1/3/3;
  }

  .mo-page { 
    position: relative;
  }

  /* new styles */

  #comp-text-1 {
    height: auto;
    color: #fff;
    width: 530px;
    align-self: start;
    justify-self: start;
    margin-left: 70px;
    margin-right: 0%;
    margin-top: 59.75px;
    margin-bottom: 0px;
  }

  #comp-text-1 .font-head-2 {
    font-size: 22px;
  }

  #page-asbdfc {
    background-color: rgb(49,38,36);
  }

  .mo-comp-box {
    background-color: #ebf0f5;
    width: 80px;
    height: 20px;
  }

  .mo-comp-line {
    border-top: 1px solid #000;
    height: 5px;
    width: 100px;
  }

  .mo-comp-line-vertical {
    border-left: 1px solid #000;
    height: 100px;
    width: 5px;
  }

  .mo-comp-button {
    transition: border-color 0.4s ease 0s, background-color 0.4s ease 0s;
    /* position: relative; */
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 15px;
    padding-bottom: 15px;

    /* display: flex;
    justify-content: center;
    align-items: center;
    text-align: center; */
    cursor: pointer;

    background-color: rgba(0, 0, 0, 1);
    border: solid rgba(0, 0, 0, 1) 0px;
    border-radius: 30px;
    color: #fff;
    font-size: 16px;
  }

  .mo-comp-menu-item {
    font-size: 14px;
    line-height: 150%;
    color: #fff;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 0px;
    cursor: pointer;
  }

  #box-1 {
    width: 80px;
    height: 10px;
    background-color: #ffffff;
    align-self: center;
    justify-self: left;
    margin-left: 70px;
    margin-right: 0px;
    margin-bottom: 0px;
    margin-right: 0px;
  }

  #line-1 {
    width: auto;
    border-top: 1px solid rgba(255,255,255,0.5);
    justify-self: stretch;
    align-self: end;
    margin-left: 70px;
    margin-right: 30%;
    margin-bottom: 41px;
    margin-top: 0px;
  }

  #text-1 {
    color: #fff;
  }

  #button-1 {
    border-radius: 0px;
    background-color: rgb(228,114,99);
    width: auto;
    height: auto;
    align-self: start;
    justify-self: end;
    margin-left: 0px;
    margin-right: 70px;
    margin-top: 54px;
    margin-bottom: 0px;
    color: #000;
  }

  #button-1:hover {
    background-color: #723932;
    color: #fff;
  }

  #section-2{
    grid-template-rows: minmax(50vw,max-content);
    grid-template-columns: 70px 0.5fr 1fr 1.5fr 70px;
  }

  #box-2{
    height: auto;
    width: auto;
    justify-self: stretch;
    align-self: stretch;
    margin-left: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    margin-top: -100px;
    grid-area: 1/1/2/6;
    background-image: url('https://static.wixstatic.com/media/ea26fd_24f9ba1d8e0f492f82fd2e59ffa1abc7f000.jpg/v1/fill/w_1385,h_793,al_l,q_85,usm_0.33_1.00_0.00,enc_auto/ea26fd_24f9ba1d8e0f492f82fd2e59ffa1abc7f000.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  
  #section-1 {
    z-index: 2;
  }

  #menu-1 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 45px;
    margin-bottom: 0px;
    grid-area: 1/2/2/3;
  }

  #menu-1 .mo-comp-menu-item-selected {
    color: #e47263;
  }

  #comp-text-2 {
    align-self: start;
    justify-self: start;
    width: 100%;
    margin-left: 0.000625px;
    margin-right: 0px;
    margin-top: 35px;
    margin-bottom: 0px;
    grid-area: 1/3/2/4;
  }

  #comp-container-1 {
    width: 100%;
    height: auto;
    background-color: rgba(0,0,0,0.7);
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 50px;
    margin-bottom: 0px;
    grid-area: 1/4/2/5;
    box-sizing: border-box;
    grid-template-rows: minmax(20px,max-content) minmax(20px,max-content);
    grid-template-columns: 165.62501525878906px minmax(16.54513931274414px,max-content) 1.00006fr 0.0999155fr 1.00006fr;
  }

  #comp-text-3 {
    width: auto;
    height: auto;
    align-self: end;
    justify-self: stretch;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 15%;
    margin-bottom: 2%;
    grid-area: 1/1/2/2;
    text-align: center;
  }

  #comp-text-4 {
    width: auto;
    height: auto;
    align-self: start;
    justify-self: stretch;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 2%;
    margin-bottom: 17%;
    grid-area: 2/1/3/2;
    text-align: center;
  }

  #comp-text-5 {
    width: auto;
    height: auto;
    align-self: end;
    justify-self: stretch;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 15%;
    margin-bottom: 2%;
    grid-area: 1/3/2/4;
    text-align: center;
  }
  #comp-text-6 {
    width: auto;
    height: auto;
    align-self: start;
    justify-self: stretch;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 2%;
    margin-bottom: 17%;
    grid-area: 2/3/3/4;
    text-align: center;
  }
  #comp-text-7 {
    width: auto;
    height: auto;
    align-self: end;
    justify-self: stretch;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 15px;
    margin-bottom: 2%;
    grid-area: 1/5/2/6;
    text-align: center;
  }
  #comp-text-8 {
    width: auto;
    height: auto;
    align-self: start;
    justify-self: stretch;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 2%;
    margin-bottom: 17%;
    grid-area: 2/5/3/6;
    text-align: center;
  }

  #line-2 {
    align-self: stretch;
    justify-self: center;
    margin-left: -1.27%;
    margin-right: 0%;
    margin-top: 20px;
    margin-bottom: 20px;
    grid-area: 1/2/3/3;
    border-left: 1px solid rgba(255,255,255,0.5);
  }

  #line-3 {
    align-self: stretch;
    justify-self: center;
    margin-left: 1.9375px;
    margin-right: 0px;
    margin-top: 20px;
    margin-bottom: 20px;
    grid-area: 1/4/3/5;
    border-left: 1px solid rgba(255,255,255,0.5);
  }

  #section-3 {
    width: auto;
    height: auto;
    grid-template-rows: minmax(20px,max-content);
    grid-template-columns: 70px 0.5fr 2.5fr 70px;
  }

  #comp-text-9 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0.0021683092%;
    margin-right: 5.966307%;
    margin-top: 0px;
    margin-bottom: 14.991618%;
    grid-area: 1/3/2/4;
  }

  #box-3 {
    width: 100%;
    height: 31.693832%;
    align-self: end;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: -1px;
    grid-area: 1/1/2/6;
    position: relative;
    background-color: rgba(0, 0, 0, 0);
    background-image: url('https://static.wixstatic.com/media/ea26fd_bdc9bfe09c984d4989fb8c1dcd1ac047~mv2.png/v1/fill/w_2705,h_429,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/ea26fd_bdc9bfe09c984d4989fb8c1dcd1ac047~mv2.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  #section-4 {
    grid-template-rows: minmax(50vw,max-content);
    grid-template-columns: 1.5fr 70px 1fr 70px;
  }

  #comp-container-2{
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 1/3/2/4;
    grid-template-rows: minmax(10px,max-content) minmax(20px,max-content) minmax(20px,max-content) minmax(20px,max-content);
    grid-template-columns: 1fr;
  }

  #box-4 {
    width: 80px;
    height: 10px;
    background-color: #e47263;
    align-self: start;
    justify-self: start;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
  }

  #line-4 {
    width: auto;
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 10px;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
    border-top: 1px solid #e47263;
  }

  #comp-text-11 {
    height: auto;
    width: 100%;
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 3%;
    margin-bottom: 0px;
    grid-area: 2/1/3/2;
  }

  #comp-text-11 .font-head-3 {
    color: #e47263;
  }

  #comp-text-12 {
    width: 100%;
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 3%;
    margin-bottom: 0px;
    grid-area: 3/1/4/2;
    position: relative;
  }

  #comp-text-13 {
    align-self: start;
    justify-self: center;
    margin-left: -0.015875px;
    margin-right: 0px;
    margin-top: 3%;
    margin-bottom: 0px;
    grid-area: 4/1/5/2;
  }

  #box-5 {
    width: auto;
    height: auto;
    align-self: stretch;
    justify-self: stretch;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
    background-image: url('https://static.wixstatic.com/media/ea26fd_41155e2944b44a358e9bb81780ac95c3f000.jpg/v1/fill/w_971,h_879,al_c,q_85,usm_0.33_1.00_0.00,enc_auto/ea26fd_41155e2944b44a358e9bb81780ac95c3f000.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  #section-5 {
    grid-template-rows: 10vw minmax(50vw,max-content);
    grid-template-columns: 70px 1fr 70px 1.5fr;
  }

  #box-6 {
    width: auto;
    height: auto;
    align-self: stretch;
    justify-self: stretch;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 2/4/3/5;
    background-image: url('https://static.wixstatic.com/media/ea26fd_66af460b87ed4acf8fdafd84d19cde35~mv2.jpg/v1/fill/w_1554,h_1406,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/ea26fd_66af460b87ed4acf8fdafd84d19cde35~mv2.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  #comp-container-3{
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 2/2/3/3;
    grid-template-rows: minmax(10px,max-content) minmax(20px,max-content) minmax(20px,max-content) minmax(20px,max-content);
    grid-template-columns: 1fr;
  }

  #box-7 {
    width: 80px;
    height: 10px;
    background-color: #e47263;
    align-self: start;
    justify-self: start;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
  }

  #line-5 {
    width: auto;
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 10px;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
    border-top: 1px solid #e47263;
  }

  #comp-text-14 {
    height: auto;
    width: 100%;
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 3%;
    margin-bottom: 0px;
    grid-area: 2/1/3/2;
  }

  #comp-text-14 .font-head-3 {
    color: #e47263;
  }

  #comp-text-15 {
    width: 100%;
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 3%;
    margin-bottom: 0px;
    grid-area: 3/1/4/2;
    position: relative;
  }

  #comp-text-16 {
    align-self: start;
    justify-self: center;
    margin-left: -0.015875px;
    margin-right: 0px;
    margin-top: 3%;
    margin-bottom: 0px;
    grid-area: 4/1/5/2;
  }

  #section-6 {
    height: 83.42179vw;
    grid-template-rows: minmax(10vw,max-content) 4fr 1fr 1fr 3.5fr 1fr;
    grid-template-columns: 70px 1fr 70px 1.5fr;
  }

  #box-10 {
    width: auto;
    height: auto;
    align-self: stretch;
    justify-self: stretch;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 2/4/5/5;
    background-image: url('https://static.wixstatic.com/media/ea26fd_ffec2fcc5e9d49c4a057b4d07af8ffdcf000.jpg/v1/fill/w_990,h_751,al_c,q_85,usm_0.33_1.00_0.00,enc_auto/ea26fd_ffec2fcc5e9d49c4a057b4d07af8ffdcf000.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }


  #comp-container-4 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 2/2/3/3;
  }

  #box-11 {
    width: 80px;
    height: 10px;
    background-color: #e47263;
    align-self: start;
    justify-self: start;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
  }

  #line-6 {
    width: auto;
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 10px;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
    border-top: 1px solid #e47263;
  }

  #comp-text-17 {
    height: auto;
    width: 100%;
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 3%;
    margin-bottom: 0px;
    grid-area: 2/1/3/2;
  }

  #comp-text-17 .font-head-3 {
    color: #e47263;
  }

  #comp-text-18 {
    height: auto;
    width: 100%;
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 3%;
    margin-bottom: 0px;
    grid-area: 3/1/4/2;
  }

  #box-12 {
    width: auto;
    height: auto;
    align-self: stretch;
    justify-self: stretch;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 3/2/6/3;
    background-image: url('https://static.wixstatic.com/media/ea26fd_9c27a9353b7f408ab177f2748f99d786~mv2.jpg/v1/fill/w_1056,h_1101,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/ea26fd_9c27a9353b7f408ab177f2748f99d786~mv2.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  #comp-container-5{
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 70px;
    margin-top: 5%;
    margin-bottom: 0px;
    grid-area: 5/4/7/5;

  }

  #box-13 {
    width: 80px;
    height: 10px;
    background-color: #e47263;
    align-self: start;
    justify-self: start;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
  }

  #line-7 {
    width: auto;
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 10px;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
    border-top: 1px solid #e47263;
  }

  #comp-text-19 {
    height: auto;
    width: 100%;
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 3%;
    margin-bottom: 0px;
    grid-area: 2/1/3/2;
  }

  #comp-text-20 {
    height: auto;
    width: 100%;
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 3%;
    margin-bottom: 0px;
    grid-area: 3/1/4/2;
  }

  #section-7{
    grid-template-rows: minmax(20px,max-content) minmax(20px,max-content) minmax(20px,max-content) minmax(5vw,max-content);
    grid-template-columns: 70px 1fr 1fr 1fr 1fr 1fr 70px;
  }

  #comp-text-21 {
    height: auto;
    width: 100%;
    align-self: center;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0.0013758348%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 1/2/2/7;
  }

  #comp-text-21 .font-head-2 {
    color: rgb(228,114,99);
  }

  #comp-text-22 {
    height: auto;
    width: 100%;
    align-self: start;
    justify-self: stretch;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 2/2/3/3;
  }

  #comp-icon-10{
    height: auto;
    width: 40%;
    align-self: start;
    justify-self: start;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 5%;
    margin-bottom: 0px;
    grid-area: 3/2/4/3;
  }

  #comp-text-23 {
    height: auto;
    width: 100%;
    align-self: start;
    justify-self: stretch;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 2/3/3/4;
  }

  #comp-icon-11{
    height: auto;
    width: 40%;
    align-self: start;
    justify-self: start;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 5%;
    margin-bottom: 0px;
    grid-area: 3/3/4/4;
  }

  #comp-text-24 {
    height: auto;
    width: 100%;
    align-self: start;
    justify-self: stretch;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 2/4/3/5;
  }

  #comp-icon-12{
    height: auto;
    width: 40%;
    align-self: start;
    justify-self: start;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 5%;
    margin-bottom: 0px;
    grid-area: 3/4/4/5;
  }

  #comp-text-25 {
    height: auto;
    width: 100%;
    align-self: start;
    justify-self: stretch;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 2/5/3/6;
  }

  #comp-icon-13{
    height: auto;
    width: 40%;
    align-self: start;
    justify-self: start;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 5%;
    margin-bottom: 0px;
    grid-area: 3/5/4/6;
  }

  #comp-text-26 {
    height: auto;
    width: 100%;
    align-self: start;
    justify-self: stretch;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 2/6/3/7;
  }

  #comp-icon-14{
    height: auto;
    width: 40%;
    align-self: start;
    justify-self: start;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 5%;
    margin-bottom: 0px;
    grid-area: 3/6/4/7;
  }

  #section-8 {
    grid-template-rows: minmax(10px,max-content) minmax(20px,max-content) minmax(20px,max-content);
    grid-template-columns: 70px 1fr 1fr 70px;
  }

  #box-80 {
    width: 80px;
    height: 10px;
    background-color: #e47263;
    align-self: start;
    justify-self: start;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 1/2/2/3;
  }

  #line-80 {
    height: 5px;
    width: 100%;
    border-top: 1px solid #e47263;
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 10px;
    margin-bottom: 0px;
    grid-area: 1/2/2/4;
  }

  #comp-text-80 {
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 50px;
    margin-bottom: 0px;
    grid-area: 2/2/3/3;
    width: 100%;
  }

  #box-81 {
    width: auto;
    height: auto;
    align-self: stretch;
    justify-self: stretch;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: -0.000125px;
    grid-area: 2/1/4/5;
    background-color: rgba(0,0,0,0);
    background-image: url('https://static.wixstatic.com/media/ea26fd_ef19d71375284f9697a14e82631210eb~mv2.jpg/v1/fill/w_1774,h_1160,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/ea26fd_ef19d71375284f9697a14e82631210eb~mv2.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  #comp-container-80 {
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 5.9989057%;
    margin-bottom: 20%;
    grid-area: 3/2/4/3;
    grid-template-rows: minmax(5vw,max-content) minmax(10px,max-content) minmax(10px,max-content) minmax(10px,max-content) minmax(10px,max-content) minmax(10px,max-content) minmax(10px,max-content) minmax(10px,max-content) minmax(10px,max-content) minmax(10px,max-content) minmax(10px,max-content) minmax(10px,max-content) minmax(10px,max-content) minmax(5vw,max-content);
    grid-template-columns: 0.34246576fr 1fr 0.17123288fr 1fr 0.34246576fr;
    background-color: rgba(0,0,0,0.5);
    width: 100%;
    height: auto;
  }

  #comp-text-81 {
    align-self: center;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 2/2/3/3;
  }

  #comp-text-82 {
    align-self: center;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 2/4/3/5;
  }

  #comp-text-83 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 2%;
    margin-bottom: 0px;
    grid-area: 3/2/4/3;
  }

  #comp-text-84 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 2%;
    margin-bottom: 0px;
    grid-area: 3/4/4/5;
  }

  #comp-text-84 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 2%;
    margin-bottom: 0px;
    grid-area: 3/4/4/5;
  }

  #comp-text-85 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 4/2/5/3;
  }

  #comp-text-86 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 2%;
    margin-bottom: 0px;
    grid-area: 5/2/6/3;
  }

  #comp-text-87 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 4/4/5/5;
  }

  #comp-text-88 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 2%;
    margin-bottom: 0px;
    grid-area: 5/4/6/5;
  }

  #comp-text-89 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 6/2/7/3;
  }

  #comp-text-90 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 2%;
    margin-bottom: 0px;
    grid-area: 7/2/8/3;
  }

  #comp-text-91 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 6/4/7/5;
  }

  #comp-text-92 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 2%;
    margin-bottom: 0px;
    grid-area: 7/4/8/5;
  }

  #comp-text-93 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 8/2/9/3;
  }

  #comp-text-94 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 2%;
    margin-bottom: 0px;
    grid-area: 9/2/10/3;
  }

  #comp-text-95 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 8/4/9/5;
  }

  #comp-text-96 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 2%;
    margin-bottom: 0px;
    grid-area: 9/4/10/5;
  }

  #comp-text-97 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 10/2/11/3;
  }

  #comp-text-98 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 2%;
    margin-bottom: 0px;
    grid-area: 11/2/12/3;
  }

  #comp-text-99 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 8%;
    margin-bottom: 0px;
    grid-area: 12/2/13/3;
  }

  #comp-text-100 {
    align-self: start;
    justify-self: stretch;
    margin-left: 0%;
    margin-right: 0%;
    margin-top: 2%;
    margin-bottom: 0px;
    grid-area: 13/2/14/3;
  }

  #section-9 {
    height: auto;
    min-height: 212px;
    grid-template-rows: minmax(20px,max-content) minmax(20px,max-content) minmax(20px,max-content);
    grid-template-columns: 1fr;
  }

  #comp-text-60{
    align-self: start;
    justify-self: stretch;
    margin-left: 70px;
    margin-right: 70px;
    margin-top: 0%;
    margin-bottom: 0px;
    grid-area: 1/1/2/2;
  }

  #comp-text-60 .font-head-2 {
    color: #E47263;
  }

  #comp-text-61{
    align-self: start;
    justify-self: stretch;
    margin-left: 70px;
    margin-right: 70px;
    margin-top: 1%;
    margin-bottom: 0px;
    grid-area: 2/1/3/2;
  }

  #button-62 {
    border-radius: 0px;
    background-color: rgb(228,114,99);
    width: auto;
    height: auto;
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 2%;
    margin-bottom: 0px;
    grid-area: 3/1/4/2;
    color: #000;
  }

  #button-62:hover {
    background-color: #723932;
    color: #fff;
  }

  #section-10 {
    grid-template-rows: 4.7333636vw minmax(10px,max-content) minmax(20px,max-content) minmax(20px,max-content) minmax(6vw,max-content);
    grid-template-columns: 70px 1fr 70px;
  }

  #box-70 {
    width: 80px;
    height: 10px;
    background-color: rgba(255, 255, 255, 0.5);
    align-self: start;
    justify-self: start;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 0px;
    margin-bottom: 0px;
    grid-area: 2/2/3/3;
  }

  #line-71 {
    height: 5px;
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    align-self: start;
    justify-self: center;
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 10px;
    margin-bottom: 0px;
    grid-area: 2/2/3/3;
  }

  #comp-text-70{
    align-self: start;
    justify-self: stretch;
    margin-left: 0px;
    margin-right: 200px;
    margin-top: 1%;
    margin-bottom: 0px;
    grid-area: 3/2/4/3;
  }

  #comp-text-71 {
    align-self: start;
    justify-self: start;
    margin-left: 0%;
    margin-right: 0px;
    margin-top: 1%;
    margin-bottom: 0px;
    grid-area: 4/2/5/3;
  }

  #comp-text-71 .font-7 {
    color: rgba(255, 255, 255, 0.5);
  }

  #comp-text-72 {
    align-self: start;
    justify-self: start;
    margin-left: 0%;
    margin-right: 0px;
    margin-top: 1.5%;
    margin-bottom: 0px;
    grid-area: 5/2/6/3;
  }

  #comp-text-73 {
    align-self: start;
    justify-self: end;
    margin-left: 0px;
    margin-right: 0%;
    margin-top: 1%;
    margin-bottom: 0px;
    grid-area: 4/2/5/3;
  }

  h1,h2,h3,h4,h5,h6 {
    margin: 0px;
  }
  `,
  body: `
    <body>
      <div class="mo-page" id="page-asbdfc" mo-type="page">

        <section id="section-1" mo-type="section" class="mo-layout-section mo-layout-container">
          
          <div id="comp-text-1" mo-type="text" class="mo-comp mo-comp-text">
            <h2 class="font-head-2">ENIGMA VULTURE</h2>
          </div>

          <div mo-type="box" class="mo-comp mo-comp-box" id="box-1"></div>

          <div mo-type="line" class="mo-comp mo-comp-line" id="line-1"></div>

          <div id="button-1" mo-type="button" class="mo-comp mo-comp-button">
              <span>Learn More</span>
          </div>

        </section>

        <section id="section-2" mo-type="section" class="mo-layout-section mo-layout-container">
          <div mo-type="box" class="mo-comp mo-comp-box" id="box-2">
          </div>

          <div mo-type="menu" class="mo-comp mo-comp-menu-vertical" id="menu-1">
            <div class="mo-comp-menu-item">
              <span>About</span>
            </div>
            <div class="mo-comp-menu-item">
              <span>Specs</span>
            </div>
            <div class="mo-comp-menu-item">
              <span>Discover</span>
            </div>
            <div class="mo-comp-menu-item">
              <span>Contact</span>
            </div>
            <div class="mo-comp-menu-item mo-comp-menu-item-selected">
              <span>Home</span>
            </div>
          </div>

          <div id="comp-text-2" mo-type="text" class="mo-comp mo-comp-text">
            <h2 class="font-2">
              <span>ENIGMA<br>
              VULTURE<br>
              X100</span>
            </h1>
          </div>

          <div id="comp-container-1" mo-type="container" class="mo-layout-container mo-layout-comp">

            <div id="comp-text-3" mo-type="text" class="mo-comp mo-comp-text">
              <h2 class="font-head-6">2.5s</h2>
            </div>
            <div id="comp-text-4" mo-type="text" class="mo-comp mo-comp-text">
              <span class="font-7">From 0-60mph</span>
            </div>

            <div mo-type="line" class="mo-comp mo-comp-line-vertical" id="line-2"></div>

            <div id="comp-text-5" mo-type="text" class="mo-comp mo-comp-text">
              <h2 class="font-head-6">280mi</h2>
            </div>
            <div id="comp-text-6" mo-type="text" class="mo-comp mo-comp-text">
              <span class="font-7">From 0-60mph</span>
            </div>
            
            <div mo-type="line" class="mo-comp mo-comp-line-vertical" id="line-3"></div>

            <div id="comp-text-7" mo-type="text" class="mo-comp mo-comp-text">
              <h2 class="font-head-6">4WD</h2>
            </div>
            <div id="comp-text-8" mo-type="text" class="mo-comp mo-comp-text">
              <span class="font-7">Triple Motor</span>
            </div>

          </div>

          <div mo-type="box" class="mo-comp mo-comp-box" id="box-3">

          </div>

        </section>

        <section id="section-3" mo-type="section" class="mo-layout-section mo-layout-container">
          <div id="comp-text-9" mo-type="text" class="mo-comp mo-comp-text">
            <h2 class="font-head-2">INTRODUCING THE NEXT GENERATION OF SPORTS LUXURY.</h2>
          </div>
        </section>

        <section id="section-4" mo-type="section" class="mo-layout-section mo-layout-container">

          <div id="comp-container-2" mo-type="container" class="mo-layout-container">
            <div mo-type="box-4" class="mo-comp mo-comp-box" id="box-4"></div>
            <div mo-type="line" class="mo-comp mo-comp-line" id="line-4"></div>
            <div id="comp-text-11" mo-type="text" class="mo-comp mo-comp-text">
              <h2 class="font-head-3">Exterior</h2>
            </div>

            <div id="comp-text-12" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-head-2">
                <span>Sleek<br>
                and Agile</span></p>
            </div>

            <div id="comp-text-13" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-8">
                <span>I'm a paragraph. Click here to add your own text and edit me. 
                  It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font.  
                </span>
              </p>
            </div>

          </div>

          <div mo-type="box-5" class="mo-comp mo-comp-box" id="box-5"></div>
        </section  d="section-4" mo-type="section" class="mo-layout-section mo-layout-container">

        <section id="section-5" mo-type="section" class="mo-layout-section mo-layout-container">
          <div mo-type="box-6" class="mo-comp mo-comp-box" id="box-6"></div>

          <div id="comp-container-3" mo-type="container" class="mo-layout-container">
            <div mo-type="box" class="mo-comp mo-comp-box" id="box-7"></div>
            <div mo-type="line" class="mo-comp mo-comp-line" id="line-5"></div>
            <div id="comp-text-14" mo-type="text" class="mo-comp mo-comp-text">
              <h2 class="font-head-3">Interior</h2>
            </div>

            <div id="comp-text-15" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-head-2">
                <span>Expert<br>
                  Craftsmanship</span>
              </p>
            </div>

            <div id="comp-text-16" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-8">
                <span>I'm a paragraph. Click here to add your own text and edit me. 
                  It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font.  
                </span>
              </p>
            </div>

          </div>

        </section>

        <section id="section-6" mo-type="section" class="mo-layout-section mo-layout-container">
          <div mo-type="box" class="mo-comp mo-comp-box" id="box-10"></div>
          <div id="comp-container-4" mo-type="container" class="mo-layout-container">
            <div mo-type="box" class="mo-comp mo-comp-box" id="box-11"></div>
            <div mo-type="line" class="mo-comp mo-comp-line" id="line-6"></div>
            <div id="comp-text-17" mo-type="text" class="mo-comp mo-comp-text">
              <h2 class="font-head-3">Performance</h2>
            </div>
            <div id="comp-text-18" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-8">
                <span>I'm a paragraph. Click here to add your own text and edit me. 
                  It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font.  
                </span>
              </p>
            </div>
          </div>
          <div mo-type="box" class="mo-comp mo-comp-box" id="box-12"></div>
          
          <div id="comp-container-5" mo-type="container" class="mo-layout-container mo-layout-comp">
            <div mo-type="box" class="mo-comp mo-comp-box" id="box-13"></div>
            <div mo-type="line" class="mo-comp mo-comp-line" id="line-7"></div>
            <div id="comp-text-19" mo-type="text" class="mo-comp mo-comp-text">
              <h2 class="font-head-3">Safety</h2>
            </div>
            <div id="comp-text-20" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-8">
                <span>I'm a paragraph. Click here to add your own text and edit me. 
                  It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. 
                  I’m a great place for you to tell a story and let your users know a little more about you. 
                </span>
              </p>
            </div>
          </div>

        </section>

        <section id="section-7" mo-type="section" class="mo-layout-section mo-layout-container">
          <div id="comp-text-21" mo-type="text" class="mo-comp mo-comp-text">
            <h2 class="font-head-2">5-Star Overall Safety Rating</h2>
          </div>

          <div id="comp-text-22" mo-type="text" class="mo-comp mo-comp-text">
            <p class="font-8"><span>Driver</span></p>
            <p class="font-8"><span>Frontal</span></p>
          </div>

          <div id="comp-icon-10" mo-type="icon" class="mo-comp">
            <svg preserveAspectRatio="xMidYMid meet" data-bbox="0.635 0 156.729 23.517" xmlns="http://www.w3.org/2000/svg" viewBox="0.635 0 156.729 23.517" height="24" width="158" data-type="color" role="img" aria-labelledby="svgcid-2szitf8yxran"><defs><style>#comp-k5c5fqg7 svg [data-color="1"] {fill: #E47263;}</style></defs><title id="svgcid-2szitf8yxran">5 Star Rating</title>
              <g fill-rule="evenodd">
                  <path fill="#E47263" d="M13 19.5l-7.641 4.017 1.46-8.508L.635 8.983 9.18 7.74 13 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L13 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M46 19.5l-7.641 4.017 1.46-8.508-6.183-6.026L42.18 7.74 46 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L46 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M79 19.5l-7.641 4.017 1.46-8.508-6.183-6.026L75.18 7.74 79 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L79 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M112 19.5l-7.641 4.017 1.46-8.508-6.183-6.026 8.543-1.242L112 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L112 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M145 19.5l-7.641 4.017 1.46-8.508-6.183-6.026 8.543-1.242L145 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L145 19.5z" data-color="1"></path>
              </g>
            </svg>
          </div>

          <div id="comp-text-23" mo-type="text" class="mo-comp mo-comp-text">
            <p class="font-8"><span>Passenger</span></p>
            <p class="font-8"><span>Frontal</span></p>
          </div>

          <div id="comp-icon-11" mo-type="icon" class="mo-comp">
            <svg preserveAspectRatio="xMidYMid meet" data-bbox="0.635 0 156.729 23.517" xmlns="http://www.w3.org/2000/svg" viewBox="0.635 0 156.729 23.517" height="24" width="158" data-type="color" role="img" aria-labelledby="svgcid-2szitf8yxran"><defs><style>#comp-k5c5fqg7 svg [data-color="1"] {fill: #E47263;}</style></defs><title id="svgcid-2szitf8yxran">5 Star Rating</title>
              <g fill-rule="evenodd">
                  <path fill="#E47263" d="M13 19.5l-7.641 4.017 1.46-8.508L.635 8.983 9.18 7.74 13 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L13 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M46 19.5l-7.641 4.017 1.46-8.508-6.183-6.026L42.18 7.74 46 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L46 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M79 19.5l-7.641 4.017 1.46-8.508-6.183-6.026L75.18 7.74 79 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L79 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M112 19.5l-7.641 4.017 1.46-8.508-6.183-6.026 8.543-1.242L112 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L112 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M145 19.5l-7.641 4.017 1.46-8.508-6.183-6.026 8.543-1.242L145 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L145 19.5z" data-color="1"></path>
              </g>
            </svg>
          </div>

          <div id="comp-text-24" mo-type="text" class="mo-comp mo-comp-text">
            <p class="font-8"><span>Front Seat</span></p>
            <p class="font-8"><span>Side</span></p>
          </div>

          <div id="comp-icon-12" mo-type="icon" class="mo-comp">
            <svg preserveAspectRatio="xMidYMid meet" data-bbox="0.635 0 156.729 23.517" xmlns="http://www.w3.org/2000/svg" viewBox="0.635 0 156.729 23.517" height="24" width="158" data-type="color" role="img" aria-labelledby="svgcid-2szitf8yxran"><defs><style>#comp-k5c5fqg7 svg [data-color="1"] {fill: #E47263;}</style></defs><title id="svgcid-2szitf8yxran">5 Star Rating</title>
              <g fill-rule="evenodd">
                  <path fill="#E47263" d="M13 19.5l-7.641 4.017 1.46-8.508L.635 8.983 9.18 7.74 13 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L13 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M46 19.5l-7.641 4.017 1.46-8.508-6.183-6.026L42.18 7.74 46 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L46 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M79 19.5l-7.641 4.017 1.46-8.508-6.183-6.026L75.18 7.74 79 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L79 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M112 19.5l-7.641 4.017 1.46-8.508-6.183-6.026 8.543-1.242L112 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L112 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M145 19.5l-7.641 4.017 1.46-8.508-6.183-6.026 8.543-1.242L145 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L145 19.5z" data-color="1"></path>
              </g>
            </svg>
          </div>


          <div id="comp-text-25" mo-type="text" class="mo-comp mo-comp-text">
            <p class="font-8"><span>Rear Seat</span></p>
            <p class="font-8"><span>Side</span></p>
          </div>

          <div id="comp-icon-13" mo-type="icon" class="mo-comp">
            <svg preserveAspectRatio="xMidYMid meet" data-bbox="0.635 0 156.729 23.517" xmlns="http://www.w3.org/2000/svg" viewBox="0.635 0 156.729 23.517" height="24" width="158" data-type="color" role="img" aria-labelledby="svgcid-2szitf8yxran"><defs><style>#comp-k5c5fqg7 svg [data-color="1"] {fill: #E47263;}</style></defs><title id="svgcid-2szitf8yxran">5 Star Rating</title>
              <g fill-rule="evenodd">
                  <path fill="#E47263" d="M13 19.5l-7.641 4.017 1.46-8.508L.635 8.983 9.18 7.74 13 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L13 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M46 19.5l-7.641 4.017 1.46-8.508-6.183-6.026L42.18 7.74 46 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L46 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M79 19.5l-7.641 4.017 1.46-8.508-6.183-6.026L75.18 7.74 79 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L79 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M112 19.5l-7.641 4.017 1.46-8.508-6.183-6.026 8.543-1.242L112 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L112 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M145 19.5l-7.641 4.017 1.46-8.508-6.183-6.026 8.543-1.242L145 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L145 19.5z" data-color="1"></path>
              </g>
            </svg>
          </div>

          <div id="comp-text-26" mo-type="text" class="mo-comp mo-comp-text">
            <p class="font-8"><span>Rollover</span></p>
          </div>

          <div id="comp-icon-14" mo-type="icon" class="mo-comp">
            <svg preserveAspectRatio="xMidYMid meet" data-bbox="0.635 0 156.729 23.517" xmlns="http://www.w3.org/2000/svg" viewBox="0.635 0 156.729 23.517" height="24" width="158" data-type="color" role="img" aria-labelledby="svgcid-2szitf8yxran"><defs><style>#comp-k5c5fqg7 svg [data-color="1"] {fill: #E47263;}</style></defs><title id="svgcid-2szitf8yxran">5 Star Rating</title>
              <g fill-rule="evenodd">
                  <path fill="#E47263" d="M13 19.5l-7.641 4.017 1.46-8.508L.635 8.983 9.18 7.74 13 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L13 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M46 19.5l-7.641 4.017 1.46-8.508-6.183-6.026L42.18 7.74 46 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L46 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M79 19.5l-7.641 4.017 1.46-8.508-6.183-6.026L75.18 7.74 79 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L79 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M112 19.5l-7.641 4.017 1.46-8.508-6.183-6.026 8.543-1.242L112 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L112 19.5z" data-color="1"></path>
                  <path fill="#E47263" d="M145 19.5l-7.641 4.017 1.46-8.508-6.183-6.026 8.543-1.242L145 0l3.82 7.741 8.544 1.242-6.182 6.026 1.46 8.508L145 19.5z" data-color="1"></path>
              </g>
            </svg>
          </div>

        </section>

        <section id="section-8" mo-type="section" class="mo-layout-section mo-layout-container">
          <div mo-type="box" class="mo-comp mo-comp-box" id="box-81"></div>
          <div mo-type="box" class="mo-comp mo-comp-box" id="box-80"></div>
          <div mo-type="line" class="mo-comp mo-comp-line" id="line-80"></div>

          <div id="comp-text-80" mo-type="text" class="mo-comp mo-comp-text">
            <p class="font-head-2">
              <span>Specs</span>
            </p>
          </div>

          <div id="comp-container-80" mo-type="container" class="mo-layout-container mo-layout-comp">
            <div id="comp-text-81" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span style="text-decoration:underline;">Battery</span></p>
            </div>
            <div id="comp-text-82" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span style="text-decoration:underline;">Weight</span></p>
            </div>
            <div id="comp-text-83" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span>I’m an item. ​Click here to edit me.</span></p>
            </div>
            <div id="comp-text-84" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span>I’m an item.</span></p>
            </div>
            <div id="comp-text-85" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span style="text-decoration:underline;">Acceleration</span></p>
            </div>
            <div id="comp-text-86" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span>I’m an item.</span></p>
            </div>
            <div id="comp-text-87" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span style="text-decoration:underline;">Cargo</span></p>
            </div>
            <div id="comp-text-88" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span>I’m an item. ​Click here to edit me.</span></p>
            </div>
            <div id="comp-text-89" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span style="text-decoration:underline;">Range</span></p>
            </div>
            <div id="comp-text-90" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span>I’m an item. ​Click here to edit me.</span></p>
            </div>
            <div id="comp-text-91" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span style="text-decoration:underline;">Displays</span></p>
            </div>
            <div id="comp-text-92" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span>I’m an item.</span></p>
            </div>
            <div id="comp-text-93" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span style="text-decoration:underline;">Drive</span></p>
            </div>
            <div id="comp-text-94" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span>I’m an item.</span></p>
            </div>
            <div id="comp-text-95" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span style="text-decoration:underline;">Warranty</span></p>
            </div>
            <div id="comp-text-96" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span>I’m an item. ​Click here to edit me.</span></p>
            </div>
            <div id="comp-text-97" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span style="text-decoration:underline;">Seating</span></p>
            </div>
            <div id="comp-text-98" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span>I’m an item. ​Click here to edit me.</span></p>
            </div>
            <div id="comp-text-99" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span style="text-decoration:underline;">Wheels</span></p>
            </div>
            <div id="comp-text-100" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span>I’m an item.</span></p>
            </div>
          </div>

        </section>

        <section id="section-9" mo-type="section" class="mo-layout-section mo-layout-container">
          <div id="comp-text-60" mo-type="text" class="mo-comp mo-comp-text">
            <p class="font-head-2" style="text-align: center;"><span>Experience Enigma Vulture X100</span></p>
          </div>
          <div id="comp-text-61" mo-type="text" class="mo-comp mo-comp-text">
            <p class="font-8" style="text-align: center;"><span>I'm a paragraph. Click here to add your own text and edit me.</span></p>
          </div>

          <div id="button-62" mo-type="button" class="mo-comp mo-comp-button">
            <span>Discover</span>
        </div>
        </section>


        <div id="footer-asdfncd" mo-type="footer" class="mo-layout-footer mo-layout-item mo-layout-container">
          <section id="section-10" mo-type="section" class="mo-layout-section mo-layout-container">
            <div mo-type="box" class="mo-comp mo-comp-box" id="box-70"></div>
            <div mo-type="line" class="mo-comp mo-comp-line" id="line-71"></div>
            <div id="comp-text-70" mo-type="text" class="mo-comp mo-comp-text">
              <h2 class="font-head-3" style="color: rgba(255,255,255,0.5)">ENIGMA VULTURE</h2>
            </div>

            <div id="comp-text-71" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span>500 Terry Francois Street,</span></p>
              <p class="font-7"><span>San Francisco, CA 94158</span></p>

              <p class="font-7"><span>123-456-7890</span></p>

              <p class="font-7"><span><a data-auto-recognition="true" href="mailto:info@mysite.com" style="color: rgba(255,255,255,0.5)">info@mysite.com</a></span></p>
            </div>

            <div id="comp-text-72" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span style="color: rgba(255,255,255,0.5)">© 2023 by Enigma Vulture. Created on <a href="https://www.editorx.com" target="_blank" rel="noreferrer noopener" style="color: rgba(255,255,255,0.5)">Mobio</a>.</span></p>
            </div>

            <div id="comp-text-73" mo-type="text" class="mo-comp mo-comp-text">
              <p class="font-7"><span><a href="https://nguyenlqvn.editorx.io/my-site-11" target="_self" data-anchor="anchors-k5dj0muv" style="color: rgba(255,255,255,0.5)">About</a></span></p>

              <p class="font-7"><span><a href="https://nguyenlqvn.editorx.io/my-site-11" target="_self" data-anchor="anchors-k5qqmazk" style="color: rgba(255,255,255,0.5)">Specs</a></span></p>

              <p class="font-7"><span><a target="_self" data-popupid="ttmsn" role="button" aria-haspopup="dialog" tabindex="0" style="color: rgba(255,255,255,0.5)">Discover</a></span></p>

              <p class="font-7"><span><a href="https://nguyenlqvn.editorx.io/my-site-11" target="_self" data-anchor="anchors-k5qqotvm" style="color: rgba(255,255,255,0.5)">Contact</a></span></p>
            </div>

          </section>
        </div>
      <div>
    </body>
  
  `
};

// `
// <!doctype html>
// <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
//   <head>
//       <!-- NAME: SELL PRODUCTS -->
//       <!--[if gte mso 15]>
//       <xml>
//           <o:OfficeDocumentSettings>
//           <o:AllowPNG/>
//           <o:PixelsPerInch>96</o:PixelsPerInch>
//           </o:OfficeDocumentSettings>
//       </xml>
//       <![endif]-->
//       <meta charset="UTF-8">
//       <meta http-equiv="X-UA-Compatible" content="IE=edge">
//       <meta name="viewport" content="width=device-width, initial-scale=1">
//       <style type="text/css">
       
        

//     </style>
// </head>
  
// </html>  
// `;
export { 
  getDefaultTemplate,
  DemoTemplate
}