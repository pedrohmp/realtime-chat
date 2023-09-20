import { useRef } from "react"
import {Socket, connect} from 'socket.io-client'

interface IJoin {
	setChatVisibility: React.Dispatch<React.SetStateAction<boolean>>
	setSocket: React.Dispatch<React.SetStateAction<Socket>>
}

export default function Join({setChatVisibility, setSocket}:IJoin) {
	const usernameRef = useRef<HTMLInputElement>(null)
	const handleSubmit = async() => {
		const username = usernameRef?.current?.value
		if(!username?.trim()) return

		const socket = connect('http://localhost:3333')
		socket.emit('set_username', username)
		setSocket(socket)

		setChatVisibility(true);
	}

	const getEnterKey = (e:React.KeyboardEvent<HTMLInputElement>) => {
		if(e.key === 'Enter') handleSubmit()
	}

	return <div>
		<h1>Entrar</h1>
		<input type="text" onKeyDown={getEnterKey} placeholder="Usuario" ref={usernameRef} />
		<button onClick={handleSubmit}>Entrar</button>
	</div>
} 