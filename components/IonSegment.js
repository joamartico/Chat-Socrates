import { useEffect, useRef } from "react";

const IonSegment = (props) => {
	const ref = useRef();

	useEffect(() => {
		ref?.current?.addEventListener("ionChange", props.onChange);

		// cleanup this component
		return () => {
			ref?.current?.removeEventListener("ionChange", props.onChange);
		};
	}, []);

	return (
		<ion-segment ref={ref} {...props}>
			{props.segments.map((segment) => (
				<ion-segment-button value={segment}>
					{segment}
				</ion-segment-button>
			))}
		</ion-segment>
	);
};

export default IonSegment;
