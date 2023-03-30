import { useState } from "react";
import styled from "styled-components";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

export default function Home() {
	const [promptValue, setPromptValue] = useState("");
	const [messages, setMessages] = useState([]);
	const [isTyping, setIsTyping] = useState(false);

	const handleChange = (event) => {
		setPromptValue(event.target.value);
		if (event.target.scrollHeight > 50) {
			event.target.style.height = "auto";
			event.target.style.height = event.target.scrollHeight + "px";
		}
	};

	async function askToGpt() {
		setPromptValue("");
		setIsTyping(true);
		const newMessages = [
			{
				role: "system",
				content:
					"You are socrates, a philosopher bot. Do not give answers, make the user find the answer to his question by asking him deeper questions.",
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
		const newMessages2 = [...newMessages, data.choices[0].message];
		setIsTyping(false);
		setMessages(newMessages2);
	}

	return (
		<>
			<ion-content fullscreen>
				<Container>
					<GradientTitle>Chat Socrates</GradientTitle>

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
						{isTyping && (
							<Message role="assistant" typing>
								...
							</Message>
						)}
					</Scroll>

					<Form
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

						<Button>
							<ion-icon size={30} name="paper-plane" />
						</Button>
					</Form>
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
	height: 100%;
	display: flex;
	/* justify-content: center; */
	flex-direction: column;
	font-size: 16px;
	line-height: 30px;
`;

const Scroll = styled.div`
	height: 100%;
	max-height: 100%;
	width: 100%;
	overflow-y: scroll;
	margin-bottom: 20px;
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
	/* width: 100%; */
	max-width: 80%;
	width: fit-content;
	background: #cef;
	border-radius: 10px;
	padding: 5px 15px;
	margin: ${(props) => (props.role == "user" ? "0 0 0 auto" : "0 auto 0 0")};
	margin-bottom: 20px;
	background: ${(props) => (props.role == "user" ? "#cef" : "#ddd")};
	color: ${(props) => (props.typing ? "#999" : "")};
`;

const Form = styled.form`
	width: 100%;
	display: flex;
	padding: 10px;
	margin-bottom: 16%;
	height: 50px;
	/* bottom: 0; */
	/* position: fixed; */
`;

const TextArea = styled.textarea`
	width: 100%;
	min-height: 50px !important;
	height: 50px !important;
	padding: 10px;
	font-size: 16px;
	border: none;
	border-radius: 10px;
	background-color: #f2f2f2;
	resize: none;
	&:focus {
		outline: none;
	}
	margin-right: 10px;
`;

const Button = styled.button`
	background-color: #0072ff;
	/* width: 100%; */
	width: 50px;
	height: 50px;
	color: #fff;
	border: none;
	border-radius: 10px;
	font-size: 16px;
	font-weight: bold;
	cursor: pointer;
	&:active {
		background-color: #00c6ff;
	}
	/* font-weight: bold; */
	/* font-family: "Montserrat", "Open Sans", sans-serif; */
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	background: linear-gradient(to right, #00c6ff, #0072ff);
`;
