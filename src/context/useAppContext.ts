import { useContext } from 'react'
import AppContext from './app-context.ts'

export const useAppContext = () => useContext(AppContext)
