import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: 'light'
};

try {
    const savedTheme = JSON.parse(window?.localStorage.getItem('theme'));
    if (savedTheme) {
        initialState.theme = savedTheme;
    }
} catch (e) {
    console.error("Error parsing stored theme:", e);
    // Handle the error, perhaps by setting the theme to a default value
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme(state, action) {
            state.theme = action.payload;
            try {
                localStorage.setItem('theme', JSON.stringify(action.payload));
            } catch (e) {
                console.error("Error storing theme:", e);
            }
        }
    }
});

export default themeSlice.reducer;

export function SetTheme(value){
    return(dispatch) => {
        dispatch(themeSlice.actions.setTheme(value));
    }
}
