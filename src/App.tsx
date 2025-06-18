import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import QuestionsComponent from './page/questions.component.tsx'
import HomeNavigation from './navigation/HomeNavigation.tsx'
import AppContext, { APP_CONTEXT } from './context/app-context.ts'
import { Toaster } from '@/components/ui/sonner.tsx'

function App() {
  return (
    <BrowserRouter>
      <HomeNavigation />
      <Toaster />

      <AppContext value={APP_CONTEXT}>
        <Routes>
          <Route path="/" element={<QuestionsComponent />} />
          <Route path="/questions" element={<QuestionsComponent />} />
        </Routes>
      </AppContext>
    </BrowserRouter>
  )
}

export default App
