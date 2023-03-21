import { useState } from "react";
import styled from "styled-components";
import IonSearchbar from "../components/IonSearchbar";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

export default function Home() {
	const [promptValue, setPromptValue] = useState("");
	const [response, setResponse] = useState("");
	const [activeTab, setActiveTab] = useState("forChild");

	const handleChange = (event) => {
		setPromptValue(event.target.value);
		event.target.style.height = "auto";
		event.target.style.height = event.target.scrollHeight + "px";
	};

	async function askToGpt() {
		console.log(promptValue);

		const messages = [
			{
				role: "system",
				content: "answers children's questions in a simple way",
			},
			{ role: "user", content: "Qué comen las plantas" },
			{
				role: "assistant",
				content:
					"Las plantas no necesitan comer, usan la energía del sol",
			},
		];

		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [...messages, { role: "user", content: promptValue }],
				stream: true,
				temperature: 0.7,
				stop: ["\ninfo:"],
				max_tokens: 200,
			}),
		});

		const reader = response.body.getReader();
		const decoder = new TextDecoder("utf-8");

		while (true) {
			const { value, done } = await reader.read();

			if (done) {
				break;
			}

			try {
				const chunk = decoder.decode(value);
				console.log(chunk)
				const json = JSON.parse(chunk.replace("data: ", ""));
				setResponse(prev => prev.concat(json.choices[0].delta.content))
			} catch (err) {
				console.log(err);
			}

			// setResponse(prev => prev.concat(chunk))
		}

		// const data = await response.json();
		// console.log(data);
		// setResponse(data.choices[0].message.content);
	}

	return (
		<>
			{/* <ion-header translucent>
				<ion-toolbar>
					<ion-title>Askit</ion-title>
				</ion-toolbar>
			</ion-header> */}

			<ion-content fullscreen>
				{/* <ion-header collapse="condense" translucent>
					<ion-toolbar>
						<ion-title size="large">Feed</ion-title>
					</ion-toolbar>
				</ion-header> */}

				<TabBar>
					<TabButton
						active={activeTab === "forChild"}
						onClick={() => setActiveTab("forChild")}
						background="linear-gradient(to right, #1be361, #c1f13b)"
					>
						For Child
					</TabButton>
					<TabButton
						active={activeTab === "simple"}
						onClick={() => setActiveTab("simple")}
						background="linear-gradient(to right, #ffeb3b, #ffc107)"
					>
						Simple
					</TabButton>
					<TabButton
						active={activeTab === "complex"}
						onClick={() => setActiveTab("complex")}
						background="linear-gradient(to right, #ffc107, #ff5722)"
					>
						Complex
					</TabButton>
				</TabBar>

				<Container>
					<GradientTitle>Ask me anything</GradientTitle>

					<TextArea
						value={promptValue}
						onChange={handleChange}
						placeholder="Type something..."
					/>

					<Button onClick={askToGpt}>Ask</Button>

					{response}
				</Container>
			</ion-content>
		</>
	);
}

const TabBar = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	height: 54px;
	border-radius: 27px;
	position: relative;
	background: white;
	width: 90vw;
	max-width: 700px;
	margin: auto;
	margin-top: 20px;
	margin-bottom: 100px;

	&::after {
		content: "";
		background: linear-gradient(to right, #0072ff, #00c6ff);
		background: #dadada;
		width: 100%;
		height: 100%;
		padding: 3px;
		border-radius: 33px;
		position: absolute;
		z-index: -1;
		/* opacity: 0.4; */
	}
`;

const TabButton = styled.button`
	background-color: transparent;
	color: #999;
	border: none;
	font-size: 16px;
	font-weight: bold;
	font-family: "Montserrat", sans-serif;
	cursor: pointer;
	padding: 12px 16px;
	&:focus {
		outline: none;
	}
	${(props) =>
		props.active &&
		`
      background: ${props.background};
      color: #fff;
      border-radius: 20px;
      `}
`;

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

const TextArea = styled.textarea`
	width: 100%;
	min-height: 125px;
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
	margin-bottom: 40px;
`;
