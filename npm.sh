#!/bin/bash
function coppyFile() {

   rm -rf node_modules/lib/
   rm -rf node_modules/layout/
   rm -f package-lock.json
   npm i
   mkdir -p src/assets/i18n
   cp -R node_modules/lib/src/assets/i18n/* src/assets/i18n
   mkdir -p src/assets/data
   cp -R node_modules/lib/src/assets/data/* src/assets/data
   mkdir -p src/assets/audio
   cp -R node_modules/lib/src/assets/audio/* src/assets/audio

   rm -rf node_modules/media-store/node_modules/
   rm -rf node_modules/lib/node_modules/
   rm -rf node_modules/layout/node_modules/
}

function replaceDomainMac() {
  if [[ $partner == "app" ]]; then
    sed -i '' 's+#DOMAIN_API#+https://api.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_PUBLIC#+https://ck.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_WEB#+https://app.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#FE_TOOLS_HOST#+https://tools.app.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_WEB#+https://app.mobio.vn+' node_modules/lib/src/styles.scss
  elif [[ $partner == "vnpay" ]]; then
    sed -i '' 's+#DOMAIN_API#+https://api-cem.vnpay.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_PUBLIC#+https://ck.vnpay.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_WEB#+https://cem.vnpay.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#FE_TOOLS_HOST#+https://cem.vnpay.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_WEB#+https://cem.vnpay.vn+' node_modules/lib/src/styles.scss
  elif [[ $partner == "beta" ]]; then
    sed -i '' 's+#DOMAIN_API#+https://beta.api.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_PUBLIC#+https://beta.app.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_WEB#+https://beta.app.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#FE_TOOLS_HOST#+https://tools.beta.app.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_WEB#+https://beta.app.mobio.vn+' node_modules/lib/src/styles.scss
  elif [[ $partner == "dev" ]]; then
    sed -i '' 's+#DOMAIN_API#+https://api-dev1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_PUBLIC#+https://dev1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_WEB#+https://dev1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#FE_TOOLS_HOST#+https://tools.dev1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_WEB#+https://dev1.mobio.vn+' node_modules/lib/src/styles.scss
  elif [[ $partner == "test" ]]; then
    sed -i '' 's+#DOMAIN_API#+https://api-test1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_PUBLIC#+https://t1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_WEB#+https://test1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#FE_TOOLS_HOST#+https://tools.test1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i '' 's+#DOMAIN_WEB#+https://test1.mobio.vn+' node_modules/lib/src/styles.scss
  fi
}
function replaceDomainOther() {
  if [[ $partner == "app" ]]; then
    sed -i 's+#DOMAIN_API#+https://api.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_PUBLIC#+https://ck.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_WEB#+https://app.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#FE_TOOLS_HOST#+https://tools.app.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_WEB#+https://app.mobio.vn+' node_modules/lib/src/styles.scss
  elif [[ $partner == "vnpay" ]]; then
    sed -i 's+#DOMAIN_API#+https://api-cem.vnpay.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_PUBLIC#+https://ck.vnpay.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_WEB#+https://cem.vnpay.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#FE_TOOLS_HOST#+https://cem.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_WEB#+https://cem.vnpay.vn+' node_modules/lib/src/styles.scss
  elif [[ $partner == "beta" ]]; then
    sed -i 's+#DOMAIN_API#+https://beta.api.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_PUBLIC#+https://beta.app.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_WEB#+https://beta.app.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#FE_TOOLS_HOST#+https://tools.beta.app.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_WEB#+https://beta.app.mobio.vn+' node_modules/lib/src/styles.scss
  elif [[ $partner == "dev" ]]; then
    sed -i 's+#DOMAIN_API#+https://api-dev1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_PUBLIC#+https://dev1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_WEB#+https://dev1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#FE_TOOLS_HOST#+https://dev1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_WEB#+https://dev1.mobio.vn+' node_modules/lib/src/styles.scss
  elif [[ $partner == "test" ]]; then
    sed -i 's+#DOMAIN_API#+https://api-test1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_PUBLIC#+https://t1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_WEB#+https://test1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#FE_TOOLS_HOST#+https://tools.test1.mobio.vn+' node_modules/lib/src/app/common/define/host-domain.define.ts
    sed -i 's+#DOMAIN_WEB#+https://test1.mobio.vn+' node_modules/lib/src/styles.scss
  fi
}

function replaceFile() {
   if [[ "$OSTYPE" == "darwin"* ]]; then
      replaceDomainMac
   else
      replaceDomainOther
   fi
}

function runMode() {
   if [[ $mode == "start" ]]; then
      ng serve -p $port -o
   elif [[ $mode == "build" ]]; then
      ng build
   elif [[ $mode == "build:prod" ]]; then
      ng build -prod --aot=false --sourcemaps=false --output-hashing=none --extractCss=true
   elif [[ $mode == "build:aot" ]]; then
      node --max_old_space_size=8048 ./node_modules/@angular/cli/bin/ng build -prod --aot=true --sourcemaps=false --output-hashing=none --extractCss=true
      zipFile
   fi
}

function zipFile() {
   if [[ "$OSTYPE" == "darwin"* ]]; then
      zip -r $partner.zip WebCEM
   fi
}

function start() {
   if [[ $mode == "start" ]]; then
      echo "npm run ${mode}:${partner} port=${port}"
   else
      echo "npm run ${mode}:${partner}"
   fi
   coppyFile
   replaceFile
   runMode
}

mode=$1
partner=$2
port=$3
if [[ -z $port ]]; then
   port=4200
fi

if ([[ $partner == "app" ]] || [[ $partner == "vpbank" ]] || [[ $partner == "sw" ]] || [[ $partner == "vnpay" ]] || [[ $partner == "beta" ]] || [[ $partner == "test" ]] || [[ $partner == "dev" ]]) && ([[ $mode == "start" ]] || [[ $mode == "build" ]] || [[ $mode == "build:prod" ]] || [[ $mode == "build:aot" ]]); then
   start
   exit 0
elif [[ -n $mode ]] && [[ -n $partner ]]; then
   echo "Chế độ và đối tượng không hợp lệ."
fi

while true; do
   echo -n "chế độ (start, build, build:prod, build:aot): "
   read -r mode
   if [[ $mode == "start" ]] || [[ $mode == "build" ]] || [[ $mode == "build:prod" ]] || [[ $mode == "build:aot" ]]; then
      break
   fi
   echo -n "Không hợp lệ. "
done

while true; do
   echo -n "Đối tượng(test,dev,app ...): "
   read -r partner
   if [[ $partner == "app" ]] || [[ $partner == "vpbank" ]] || [[ $partner == "sw" ]] || [[ $partner == "vnpay" ]] || [[ $partner == "beta" ]] || [[ $partner == "test" ]] || [[ $partner == "dev" ]]; then
      break
   fi
   echo -n "Không hợp lệ. "
done

if [[ $mode == "start" ]]; then
   echo -n "Port(default 4200): "
   read -r port
fi
if [[ -z $port ]]; then
   port=4200
fi
start
