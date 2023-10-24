"use client";

import ReactDom from "react-dom"
import { ComponentProps } from "react";

//You're advised to use an interface until you need a 'type'. Normal convention. But we need to use type because we want to extend this type and we can't do it with interfaces.

type FormSubmitButtonProps = {
	children: React.ReactNode; // Allows us to add a component btw the opening and closing tag of another component. Basically everything between the 'form' component. For this case.
	className?: string; // Allows us add classes and styling.
} & ComponentProps<"button">;
// ComponentProps is added, so that all the default 'props' or functionality a button has is also included with the button or component. Such as 'submit', 'disable', etc. So, not only are we defining our own props, we are including the default component props. This only works with 'type' and not 'interface'. That's why we used 'types'

export default function FormSubmitButton({
	children,
	className,
	...props
}: FormSubmitButtonProps) {

	// What the hell is this block of code???
	const useFormStatus = (ReactDom as any as {
		experimental_useFormStatus: () => {
			pending: boolean;
			data: FormData | null;
			method: 'get' | 'post' | null;
			action: ((formData: FormData) => Promise<void>) | null;
		}
	}).experimental_useFormStatus;

	const { pending } = useFormStatus()

	return (
		<button
			{...props}
			className={`btn btn-primary ${className}`}
			type="submit"
			disabled={pending}>
			{children}
			{pending && <span className="loading loading-dots"></span>}
		</button>
	);
}
// We hardcoded some classnames here, and some others are imported from wherever we used the component. They are imported in ${className}
