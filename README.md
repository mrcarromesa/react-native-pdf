https://www.npmjs.com/package/react-native-html-to-pdf

https://stackoverflow.com/questions/56058142/open-file-downloaded-within-react-native-app-with-another-app

https://github.com/joltup/rn-fetch-blob


# React Native PDF

- Iniciar um novo projeto

```bash
npx react-native init pdf
```

- Adicionar as dependencias necessárias.

## react-native-html-to-pdf

Converte html para pdf

```bash
yarn add react-native-html-to-pdf
```

- Acessar a pasta `ios` e executar:

```bash
pod install
```

- Para Android, acessar o arquivo `android/settings.gradle` no final do arquivo adicionar:

```gradle
include ':react-native-html-to-pdf'
project(':react-native-html-to-pdf').projectDir = new File(rootProject.projectDir,'../node_modules/react-native-html-to-pdf/android')
```

- Em `android/app/build.gradle` adicionar dentro de `dependencies`


```gradle
dependencies {
  # ....
  
  implementation project(':react-native-html-to-pdf')
  
  # ....

}
```

- No arquivo `MainApplication.java` adicionar o import:

```java
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
```

- No `AndroidManifest.xml` adicionar essas permissões:

```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

**Caso alguns erros de multidex ocorram**

- Alguns erros forçaram a utilizar o `multidex`

- Em `android/app/build.gradle` adicionar dentro de `dependencies`


```gradle
defaultConfig {
    # ...
    multiDexEnabled true
}
```

e em 

```gradle
dependencies {

  # ...
  implementation 'androidx.multidex:multidex:2.0.1'
  # ...
}
```

---

## rn-fetch-blob

Permite abrir arquivos

- Execute na linha de comando:

```bash
yarn add rn-fetch-blob
```

- Depois isso:

```bash
yarn react-native link rn-fetch-blob
```

- Depois acesse a pasta `ios` e execute:

```bash
pod install
```

---

## Projeto

- Crie o arquivo `src/App.js` e adicione o seguinte:

```js
import React, {useEffect} from 'react';

import {
  Text,
  TouchableHighlight,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';

import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function Example() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      async function getPermissionAndroid() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'escrever arquivos',
              message: 'Precisamos salvar arquivos',
              buttonNeutral: 'Depois',
              buttonNegative: 'Cancelar',
              buttonPositive: 'OK',
            },
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Ler arquivos',
              message: 'Precisamos acessar arquivos',
              buttonNeutral: 'Depois',
              buttonNegative: 'Cancelar',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can read/write files');
          } else {
            console.log('read/write files permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
      getPermissionAndroid();
    }
  }, []);

  async function createPDF() {
    let options = {
      html: '<h1>PDF TEST</h1><p style="text-align: right;">teste</p>',
      fileName: 'test',
      directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options);
    // console.log(file.filePath);
    if (Platform.OS === 'android') {
      RNFetchBlob.android.actionViewIntent(file.filePath, 'application/pdf');
      alert(file.filePath);
    } else {
      RNFetchBlob.ios.openDocument(file.filePath);
    }
    // RNFetchBlob.ios.previewDocument(file.filePath);
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableHighlight onPress={createPDF}>
        <Text>Create PDF</Text>
      </TouchableHighlight>
    </View>
  );
}

```

- no arquivo `index.js` altere:

```js
import App from './src/App';
```