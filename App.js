import React, { useState } from 'react';
import AppLoading from 'expo-app-loading';

/* React Navigation: https://reactnavigation.org/docs/getting-started */
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './Navigator';

/* Realm by Mongo DB: https://www.mongodb.com/docs/realm/sdk/react-native/install/ */
/* 'expo start' Doesn't Work → Must Use 'expo run:android' */
import Realm, { schemaVersion } from "realm";
import { DBContext } from './context';

/* Realm Data Schema */
const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emoticon: "string",
    message: "string",
    isEditing: "bool"
  },
  primaryKey: "_id"
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [realm, setRealm] = useState(null);

  const startLoading = async() => {
    /* Realm Setup */
    const connection  = await Realm.open({
      path: "diaryDB",
      schema: [FeelingSchema],
      schemaVersion: 2,
      migration: (oldRealm, newRealm) => {
        if(oldRealm.schemaVersion < 2){
          const oldObjects = oldRealm.objects("Feeling");
          const newObjects = newRealm.objects("Feeling");
          for (const objectIndex in oldObjects) {
            const oldObject = oldObjects[objectIndex];
            const newObject = newObjects[objectIndex];
            newObject._id = oldObject._id;
            newObject.emoticon = oldObject.emoticon;
            newObject.message = oldObject.message;
            newObject.isEditing = false;
          }
        }
      }
    });
    setRealm(connection);
  };

  const onFinish = () => {
    setReady(true);
  }

  if(!ready) {
    return <AppLoading 
      startAsync={startLoading}
      onFinish={onFinish}
      onError={console.error}
    />;
  }

  return (
    <DBContext.Provider value={realm}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </DBContext.Provider>
  );
}