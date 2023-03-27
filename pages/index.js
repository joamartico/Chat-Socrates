import { useState } from "react";
import styled from "styled-components";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

export default function Home() {
	const [promptValue, setPromptValue] = useState("");
	const [messages, setMessages] = useState([]);

	const handleChange = (event) => {
		setPromptValue(event.target.value);
		if (event.target.scrollHeight > 50) {
			event.target.style.height = "auto";
			event.target.style.height = event.target.scrollHeight + "px";
		}
	};

	async function askToGpt() {
		setPromptValue("");
		const newMessages = [
			{
				role: "system",
				content:
					"You are socrates. Do not give answers, make the user find the answer to his question by asking him deeper questions.",
			},
			...messages,
			{ role: "user", content: promptValue },
		];
		setMessages(newMessages);

		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: newMessages,
				// stream: true,
				temperature: 0.6,
				stop: ["\ninfo:"],
			}),
		});

		const data = await response.json();
		console.log(data);
		const newMessages2 = [...newMessages, data.choices[0].message];
		setMessages(newMessages2);
	}

	return (
		<>
			<ion-content fullscreen>
				<Container>
					<GradientTitle>Talk with Sócrates</GradientTitle>

					<Scroll>
						{messages?.map(
							(message) =>
								message.content &&
								message.role != "system" && (
									<Message role={message.role}>
										{message.content}
									</Message>
								)
						)}
					</Scroll>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							askToGpt();
						}}
					>
						<TextArea
							value={promptValue}
							onChange={handleChange}
							placeholder="Type something..."
						/>

						<Button>Ask</Button>
					</form>
				</Container>
			</ion-content>
		</>
	);
}

const Container = styled.div`
	margin: auto;
	/* margin-top: 100px; */
	width: 90vw;
	max-width: 700px;
	/* height: 65%; */
	height: 100%;
	display: flex;
	/* justify-content: center; */
	flex-direction: column;
	font-size: 16px;
	line-height: 30px;
`;

const Scroll = styled.div`
	height: 100%;
	max-height: 95vh;
	width: 100%;
	overflow-y: scroll;
	margin-bottom: 30px;
`;

const GradientTitle = styled.h1`
	font-size: 2rem;
	font-family: "Montserrat", "Open Sans", sans-serif;
	font-weight: bold;
	background: linear-gradient(to right, #00c6ff, #0072ff);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	text-align: left;
	margin-bottom: 15px;
	/* margin-top: -100px; */
`;

const Message = styled.div`
	width: 100%;
	background: #cef;
	border-radius: 4px;
	padding: 5px 10px;
	margin-bottom: 15px;
	background: ${(props) => (props.role == "user" ? "#cef" : "#ddd")};
`;

const TextArea = styled.textarea`
	width: 100%;
	min-height: 50px !important;
	height: 50px;
	padding: 10px;
	font-size: 16px;
	border: none;
	border-radius: 6px;
	background-color: #f2f2f2;
	resize: none;
	&:focus {
		outline: none;
	}
	margin-bottom: 15px;
`;

const Button = styled.button`
	background-color: #0072ff;
	width: 100%;
	color: #fff;
	padding: 16px 24px;
	border: none;
	border-radius: 6px;
	font-size: 16px;
	font-weight: bold;
	cursor: pointer;
	&:active {
		background-color: #00c6ff;
	}
	font-size: 16px;
	font-weight: bold;
	font-family: "Montserrat", "Open Sans", sans-serif;
	margin-bottom: 30px;
`;
