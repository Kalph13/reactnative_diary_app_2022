import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../colors';
import { useDB } from '../context';

/* Expo Admob: https://docs.expo.dev/versions/latest/sdk/admob */
/* How to Install: https://github.com/expo/expo/tree/main/packages/expo-ads-admob */
/* Admob Test IDs: https://developers.google.com/admob/android/test-ads */
import { AdMobBanner, PublisherBanner } from 'expo-ads-admob';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const View = styled.View`
    flex: 1;
    padding: 0px ${SCREEN_HEIGHT / 22}px;
    padding-top: ${SCREEN_WIDTH / 4}px;
    background-color: ${colors.bgColor};
`;

const Title = styled.Text`
    font-size: ${SCREEN_HEIGHT / 20}px;
    color: ${colors.textColor};
    margin-bottom: ${SCREEN_HEIGHT / 16}px;
`;

const AdBanner = styled.View`
    margin-bottom: ${SCREEN_HEIGHT / 16}px;
    align-items: center;
`;

const Button = styled.TouchableOpacity`
    position: absolute;
    background-color: ${colors.btnColor};
    height: ${SCREEN_HEIGHT / 10}px;
    width: ${SCREEN_HEIGHT / 10}px;
    border-radius: ${SCREEN_HEIGHT / 20}px;
    bottom: ${SCREEN_HEIGHT / 14}px;
    right: ${SCREEN_WIDTH / 10}px;
    justify-content: center;
    align-items: center;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 1);
    elevation: 5;
`;

const FlatList = styled.FlatList``;

const Record = styled.TouchableOpacity`
    background-color: ${colors.cardColor};
    flex-direction: row;
    padding: 15px 10px;
    border-radius: 10px;
    align-items: center;
`;

const Separator = styled.View`
    margin-bottom: 15px;
`
const Emotion = styled.Text`
    flex: 1;
    justify-content: center;
    align-items: center;
`;


const Message = styled.View`
    flex: 4.5;
    justify-content: center;
`;

const MessageText = styled.Text`
    font-size: ${SCREEN_HEIGHT / 45}px;
`;

const MessageEdit = styled.TextInput`
    font-size: ${SCREEN_HEIGHT / 45}px;
    background-color: #ffffff;
    border-radius: 6px;
    padding: 5px 10px;
    width: 100%;
    position: absolute;
`;

const DeleteIcon = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
`;  

const Home = ({ navigation: { navigate }}) => {
    const realm = useDB();
    const [feelings, setFeelings] = useState([]);
    const [message, setMessage] = useState("");
    
    useEffect(() => {
        const fetched = realm.objects("Feeling")
        fetched.addListener((feelings, changes) => {
            /* LayoutAnimation: https://reactnative.dev/docs/layoutanimation */
            /* Only For Android */
            if (Platform.OS === 'android') {
                if (UIManager.setLayoutAnimationEnabledExperimental) {
                  UIManager.setLayoutAnimationEnabledExperimental(true);
                }
            }
            /* Animate When a State is Changed */
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setFeelings(feelings.sorted("_id", true));
        });
        return () => {
            fetched.removeAllListeners();
        };
    }, [])
    
    const onEdit = (input) => {
        realm.write(() => {
            input.item.isEditing = true;
        });
        setMessage(input.item.message);
    }

    const onChangeMessage = (input) => {
        setMessage(input);
    };

    const onSubmit = (input) => {
        if (message === "") {
            return Alert.alert("Please let me know your feelings today :)");
        }
        realm.write(() => {
            input.item.message = message;
            input.item.isEditing = false;
        });
        setMessage("");
    };

    const onDelete = (item) => {
        /* Realm DB Delete */
        realm.write(() => {
            const deleteItem = realm.objectForPrimaryKey("Feeling", item._id); /* Same as 'item' */
            realm.delete(deleteItem);
        });
    }

    const keyExtractor = (feeling) => {
        return feeling._id + "";
    }

    const renderItem = (feeling) => (
        <Record onPress={() => onEdit(feeling)}>
            <Emotion>
                <Ionicons name={feeling.item.emoticon} size={SCREEN_HEIGHT / 25} color={colors.textColor} />
            </Emotion>
            <Message>
                {feeling.item.isEditing === false ?
                    <MessageText>{feeling.item.message}</MessageText> :
                    <MessageEdit 
                        placeholder={feeling.item.message}
                        value={message}
                        onChangeText={onChangeMessage}
                        onSubmitEditing={() => onSubmit(feeling)}
                        returnKeyType="done"
                    />
                }
            </Message>
            <DeleteIcon onPress={() => onDelete(feeling.item)}>
                <Ionicons name="close" size={SCREEN_HEIGHT / 25} color={colors.textColor} />
            </DeleteIcon>
        </Record>
    );

    return (
        <View>
            <Title>My Journal</Title>
            <AdBanner>
                <AdMobBanner
                    bannerSize="smartBannerLandscape"
                    adUnitID="ca-app-pub-3940256099942544/6300978111" /* Test ID */
                />
                <PublisherBanner
                    bannerSize="fullBanner"
                    adUnitID="ca-app-pub-3940256099942544/6300978111" /* Test ID */
                />
            </AdBanner>
            <FlatList
                data={feelings}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ItemSeparatorComponent={Separator} 
            />
            <Button onPress={() => navigate("Write")}>
                <Ionicons name="add" color="#ffffff" size={SCREEN_HEIGHT / 18} />
            </Button>
        </View>
    );
};

export default Home;