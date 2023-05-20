import './App.css'
import {Home} from './Home'
import {GlobalStateProvider} from "./GlobalStateProvider";
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <GlobalStateProvider>
        <Home />
      </GlobalStateProvider>
    </ChakraProvider>
  )
}

export default App
