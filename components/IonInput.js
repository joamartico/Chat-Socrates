import { useEffect, useRef } from "react";

const IonInput = (props) => {
	const ref = useRef();

	useEffect(() => {
		ref?.current?.addEventListener("ionChange", props.onChange);

		// cleanup this component
		return () => {
			ref?.current?.removeEventListener("ionChange", props.onChange);
		};
	}, []);

	return (
		<ion-input
			ref={ref}
            {...props}
		/>
	);
};

export default IonInput;
