import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchWallpapers = createAsyncThunk (
    'wallpaper/fetchWallpapers',
    async (_, {rejectWithValue}) => {
        try {
            const response = await fetch('http://localhost:8082/wallpaper/wallpapers');
            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || "Failed to fetch wallpapers");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue("Network Error !!!");
        }
    }
)

const wallpaperSlice = createSlice({
    name: 'wallpapers',
    initialState: {
        wallpapers: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder)=>  {
        builder
        .addCase(fetchWallpapers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchWallpapers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.wallpapers = action.payload;
        })
        .addCase(fetchWallpapers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export default wallpaperSlice.reducer;