import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../colors';
import { useDB } from '../context';

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
    margin-bottom: ${SCREEN_HEIGHT / 8}px;
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

const Emotion = styled.Text`
    margin-left: 5px;
    margin-right: 10px;
`;

const Separator = styled.View`
    margin-bottom: 15px;
`

const Message = styled.Text`
    font-size: ${SCREEN_HEIGHT / 45}px;
`;

const Home = ({ navigation: { navigate }}) => {
    const realm = useDB();
    const [feelings, setFeelings] = useState([]);

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
    
    const onDelete = (item) => {
        realm.write(() => {
            const deleteItem = realm.objectForPrimaryKey("Feeling", item._id); /* Same as 'item' */
            realm.delete(deleteItem);
        });
    }

    const keyExtractor = (feeling) => {
        return feeling._id + "";
    }

    const renderItem = (feeling) => (
        <Record onPress={() => onDelete(feeling.item)}>
            <Emotion>
                <Ionicons name={feeling.item.emoticon} size={SCREEN_HEIGHT / 25} color={colors.textColor} />
            </Emotion>
            <Message>
                {feeling.item.message}
            </Message>
        </Record>
    );

    return (
        <View>
            <Title>My Journal</Title>
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