import {
	createContext as React_createContext,
	useLayoutEffect as React_useLayoutEffect,
	useContext,
	useEffect,
	useMemo,
} from "react";

export const canUseDOM = !!(
	typeof window !== "undefined" &&
	window.document &&
	window.document.createElement
);

export const useLayoutEffect = canUseDOM ? React_useLayoutEffect : useEffect;

type ContextProvider<T> = React.FC<React.PropsWithChildren<T>>;

export function createContext<ContextValueType extends object | null>(
	rootComponentName: string,
	defaultContext?: ContextValueType,
): [
	ContextProvider<ContextValueType>,
	(callerComponentName: string) => ContextValueType,
] {
	const Ctx = React_createContext<ContextValueType | undefined>(defaultContext);

	function Provider(props: React.PropsWithChildren<ContextValueType>) {
		const { children, ...context } = props;

		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		const value = useMemo(
			() => context,
			Object.values(context),
		) as ContextValueType;

		return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
	}

	function useValidatedContext(callerComponentName: string) {
		const context = useContext(Ctx);
		if (context) {
			return context;
		}
		if (defaultContext) {
			return defaultContext;
		}
		throw Error(
			`${callerComponentName} must be rendered inside of a ${rootComponentName} component.`,
		);
	}

	Ctx.displayName = `${rootComponentName}Context`;
	Provider.displayName = `${rootComponentName}Provider`;
	return [Provider, useValidatedContext];
}
