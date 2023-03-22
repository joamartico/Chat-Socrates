import { useState } from "react";
import styled from "styled-components";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

const messages = {
	forChild: [
		{
			role: "system",
			content: "explicame como si fuese un niño de 10 años",
		},
		{ role: "user", content: "Qué comen las plantas" },
		{
			role: "assistant",
			content: "Las plantas no necesitan comer, usan la energía del sol",
		},
	],
	simple: [
		{
			role: "system",
			content: "answers questions in a simple way",
		},
		{ role: "user", content: "Qué comen las plantas" },
		{
			role: "assistant",
			content:
				"Las plantas producen su propio alimento a través de la fotosíntesis. Utilizan la energía del sol para convertir el dióxido de carbono (CO2) y el agua (H2O) en glucosa (un tipo de azúcar) y oxígeno (O2).",
		},
	],
	complex: [
		{
			role: "system",
			content: "answer questions as accurately as possible",
		},
		{ role: "user", content: "Qué comen las plantas" },
		{
			role: "assistant",
			content:
				"Las plantas obtienen la mayor parte de su alimento a través de un proceso llamado fotosíntesis. Durante la fotosíntesis, las plantas utilizan la energía de la luz solar para convertir el dióxido de carbono (CO2) y el agua (H2O) en azúcares simples, como la glucosa, y liberan oxígeno (O2) como subproducto. Este proceso ocurre en las células de la hoja de la planta, donde se encuentran los cloroplastos, que son los orgánulos celulares que contienen clorofila, la molécula que absorbe la luz solar. La luz solar se convierte en energía química que se utiliza para impulsar la fotosíntesis. Además de la fotosíntesis, las plantas también pueden obtener nutrientes del suelo a través de las raíces. Las raíces absorben agua y nutrientes del suelo, incluyendo minerales como nitrógeno, fósforo y potasio, que son necesarios para el crecimiento y la reproducción de las plantas.",
		},
	],
};

export default function Home() {
	const [promptValue, setPromptValue] = useState("");
	const [responses, setResponses] = useState({
		forChild: "",
		simple: "",
		complex: "",
	});
	const [activeTab, setActiveTab] = useState("forChild");

	const handleChange = (event) => {
		setPromptValue(event.target.value);
		event.target.style.height = "auto";
		event.target.style.height = event.target.scrollHeight + "px";
	};

	async function askToGpt() {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [...messages[activeTab], { role: "user", content: promptValue }],
				stream: true,
				temperature: 0.4,
				stop: ["\ninfo:"],
				// max_tokens: activeTab != "complex" && 200,
			}),
		});

		const reader = response.body.getReader();
		const decoder = new TextDecoder("utf-8");

		while (true) {
			const { value, done } = await reader.read();

			if (done) {
				setResponses((prev) => {
					const newResponses = { ...prev };
					newResponses[activeTab] =
						newResponses[activeTab].concat("<br/><br/>");
					return newResponses;
				});
				break;
			}

			const chunk = await decoder.decode(value);

			const data = chunk
				.split("\n")
				// .filter(Boolean)
				.map((line) => line.replace("data: ", ""));

			data.forEach((line) => {
				try {
					const json = JSON.parse(line);
					console.log("json: ", json);
					const token = json.choices[0]?.delta?.content;

					token &&
						setResponses((prev) => {
							const newResponses = { ...prev };
							newResponses[activeTab] =
								newResponses[activeTab].concat(token);
							return newResponses;
						});
				} catch (err) {
					console.log(err);
				}
			});

			// setResponses(prev => prev.concat(chunk))
		}

		// const data = await response.json();
		// console.log(data);
		// setResponses(data.choices[0].message.content);
	}

	return (
		<>

			<ion-content fullscreen>

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

					<p
						dangerouslySetInnerHTML={{
							__html: responses[activeTab],
						}}
					/>
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
