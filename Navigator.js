import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/Home';
import Write from './screens/Write';

const Stacks = new createNativeStackNavigator();

const Navigator = () => {
    return (
        <Stacks.Navigator
            screenOptions={{
                headerShown: false, 
                presentation: "modal"
            }}
        >
            <Stacks.Screen name="Home" component={Home} />
            <Stacks.Screen name="Write" component={Write} />
        </Stacks.Navigator>
    );
};

export default Navigator;