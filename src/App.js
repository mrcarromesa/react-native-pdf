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

import Share from 'react-native-share';

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
      const optionsShare = {
        url: 'file://' + file.filePath,
      };
      Share.open(optionsShare)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
      // alert(file.filePath);
    } else {
      const optionsShare = {
        url: 'file://' + file.filePath,
      };
      Share.open(optionsShare)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
      // RNFetchBlob.ios.openDocument(file.filePath);
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
