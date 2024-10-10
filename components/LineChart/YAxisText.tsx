import React from "react";
import { matchFont, Text } from "@shopify/react-native-skia";
import { Platform } from "react-native";

type Props = {
	x: number;
	y: number;
	text: string;
};

const YAxisText = ({ x, y, text }: Props) => {
	const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
	const font = matchFont({
		fontFamily,
		fontSize: 11,
		fontWeight: "400",
	});
	return <Text font={font} x={x} y={y} text={text} color={"#1F222999"} />;
};

export default YAxisText;
