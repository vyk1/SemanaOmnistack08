import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from "./pages/Login";
import Main from "./pages/Main";

export default createAppContainer(
    // switchnav usa apenas sem resposta visual
    createSwitchNavigator({
        Login,
        Main,
    })
);