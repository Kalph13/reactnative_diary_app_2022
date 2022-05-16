import React, { useState } from 'react';
import styled from 'styled-components';
import { Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../colors';
import {  useDB } from '../context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const View = styled.View`
    flex: 1;
    background-color: ${colors.bgColor};
    align-items: center;
    padding: 0px 20px;
`;

const Emotions = styled.View`
    flex-direction: row;
    width: ${SCREEN_WIDTH / 1.3}px;
    justify-content: space-between;
    margin-top: ${SCREEN_HEIGHT / 16}px;
`;

const Emotion = styled.TouchableOpacity`
    background-color: #ffffff;
    padding: 10px;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 1);
    elevation: 5;
    border-color: ${props => props.selected ? colors.textColor : "#ffffff"};
    border-width: 2px;
    align-items: center;
    justify-content: center;
`;

const Title = styled.Text`
    font-size: ${SCREEN_HEIGHT / 28}px;
    color: ${colors.textColor};
    margin-top: ${SCREEN_HEIGHT / 8}px;
    text-align: center;
`;

const TextInput = styled.TextInput`
    background-color: #ffffff;
    border-radius: 20px;
    width: ${SCREEN_WIDTH / 1.2}px;
    padding: 10px 20px;
    font-size: ${SCREEN_HEIGHT / 55}px;
    margin-top: ${SCREEN_HEIGHT / 25}px;
`;

const Button = styled.TouchableOpacity`
    width: ${SCREEN_WIDTH / 1.2}px;
    background-color: ${colors.btnColor};
    margin-top: ${SCREEN_HEIGHT / 25}px;
    align-items: center;
    border-radius: 20px;
    padding: 10px 20px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 1);
    elevation: 5;
`;

const ButtonText = styled.Text`
    color: #ffffff;
    font-size: ${SCREEN_HEIGHT / 40}px;
`;

const emoticonList = ["happy-outline", "sad-outline", "heart-outline", "skull-outline"]

const Write = ({ navigation: { goBack }}) => {
    const [ emoticon, setEmoticon ] = useState("");
    const [ message, setMessage ] = useState("");

    const realm = useDB();

    const onPressEmoticon = (input) => {
        setEmoticon(input);
    };

    const onChangeMessage = (input) => {
        setMessage(input);
    };

    const onSubmit = () => {
        if (emoticon === "" || message === "") {
            return Alert.alert("Please let me know your feelings today :)");
        }
        realm.write(() => {
            realm.create("Feeling", {
                _id: Date.now(),
                emoticon: emoticon,
                message: message
            })
        });
        goBack(); /* Same as navigate("Home"); */
    };

    return (
        <View>
            <Title>How do you feel today?</Title>
            <Emotions>
                {emoticonList.map((emoticonItem, index) => 
                    <Emotion
                        key={index}
                        onPress={() => onPressEmoticon(emoticonItem)}
                        selected={emoticon === emoticonItem}
                    >
                        <Ionicons name={emoticonItem} size={SCREEN_HEIGHT / 25} color={colors.textColor} />
                    </Emotion>
                )}
            </Emotions>
            <TextInput
                placeholder="Please write your feelings today :)"
                value={message}
                onChangeText={onChangeMessage}
                onSubmitEditing={onSubmit}
                returnKeyType="done"
            />
            <Button onPress={onSubmit}>
                <ButtonText>Save</ButtonText>
            </Button>
        </View>
    );
};

export default Write;