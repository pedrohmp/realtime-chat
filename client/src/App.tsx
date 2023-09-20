import './App.css'
import Join from './components/Join/Join'
import Chat from './components/Chat/Chat'
import { useState } from 'react'
import { Socket } from 'socket.io-client'

function App() {
  const [chatVisibility, setChatVisibility] = useState(false)
  const [socket, setSocket] = useState<Socket>({} as Socket)

  return (
    <div className='App'>
      {chatVisibility ?  <Chat socket={socket} /> :  <Join setSocket={setSocket} setChatVisibility={setChatVisibility} />}
    </div>
  )
}

export default App
