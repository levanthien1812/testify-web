import { useDispatch } from "react-redux";
import { AppDispatch, AppStore } from "../stores/store";
import { useSelector } from "react-redux";
import { useStore } from "react-redux";
import { RootState } from "../stores/rootState";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
