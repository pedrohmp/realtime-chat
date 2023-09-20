import { KeyboardEventHandler, useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client"

interface IChat {
	socket: Socket
}

type Message = {   
	text:string,
	authorId: string,
	author: string,
	timestamp: string
}

export default function Chat({socket}:IChat) {
	const [messageList, setMessageList] = useState<Message[]>([])
	const [userList, setUserList] = useState<string[]>([])
	const messageRef = useRef<HTMLInputElement>(null)
	const bottomRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		socket.on('receive_message', (data:Message) => {
			setMessageList((current) => [...current, data])
		})

		socket.on('receive_user', (data:string[]) => {
			setUserList(data)
		})

		socket.on('disconnect_user', (data:string[]) => {
			setUserList(data)
		})


		return () => {
			socket.off('receive_message')
			socket.off('receive_user')
			socket.off('disconnect_user')
		}
	}, [socket])

	useEffect(() => {
		scrollDown()
	}, [messageList])

	const handleSubmit = () => {
		const message = messageRef.current?.value
		if(!message?.trim()) return

		socket.emit('message', message)
		clearInput()
		focusInput()
	}

	const clearInput = () => {
		if(messageRef.current?.value) messageRef.current.value = ''	
	}

	const focusInput = () => {
		messageRef.current?.focus()
	}

	const getEnterKey = (e:React.KeyboardEvent<HTMLInputElement>) => {
		if(e.key === 'Enter') handleSubmit()
	}

	const scrollDown = () => {
		bottomRef.current?.scrollIntoView({behavior: 'smooth'})
	}

	return (
		<div>
			<h1>Chat</h1>

			<h4>Usuarios conectados:</h4>

			{userList.map((user, index) => (
				<div key={index}>
					<p >{user}</p>
				</div>
			))}

		<h4>Mensagens:</h4>

			{messageList.map((message, index) => (
				<div key={index}>
					<p>{new Date(message.timestamp).toLocaleString('pt-BR')} - {message.author}: {message.text}</p>
				</div>
			))}
			<div ref={bottomRef} />
			<input type="text" onKeyDown={getEnterKey} placeholder="Mensagem" ref={messageRef} />
			<button onClick={handleSubmit}>Enviar</button>
		</div>
	)
}