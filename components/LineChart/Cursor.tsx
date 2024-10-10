import React, { useMemo } from "react";
import {
	Circle,
	DashPathEffect,
	DiscretePathEffect,
	FontStyle,
	Group,
	matchFont,
	Paragraph,
	Path,
	Skia,
	Text,
	TextAlign,
} from "@shopify/react-native-skia";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { Platform } from "react-native";
import { DataPoint } from "@/constants/price";
import { color } from "d3";

type Props = {
	cx: SharedValue<number>;
	cy: SharedValue<number>;
	selectedDate: SharedValue<string>;
	chartHeight: number;
	selectedValue: SharedValue<number>;
};

const Cursor = ({
	cx,
	cy,
	chartHeight,
	selectedValue,
	selectedDate,
}: Props) => {
	const path = useDerivedValue(() => {
		const dottedLine = Skia.Path.Make();
		dottedLine.moveTo(cx.value, 30);
		dottedLine.lineTo(cx.value, chartHeight);

		return dottedLine;
	}, [cx, cy]);

	const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });

	const dateFont = {
		fontFamily,
		fontSize: 12,
		fontStyle: FontStyle.Bold,
		color: Skia.Color("#1F2229CC"),
	};

	const priceTextCx = useDerivedValue(() => {
		return cx.value - 100;
	}, [cx]);
	const priceValue = useDerivedValue(() => {
		return selectedValue?.value.toString();
	});

	const priceDate = useDerivedValue(() => {
		return selectedDate.value;
	});
	const paragraph = useDerivedValue(() => {
		const para = Skia.ParagraphBuilder.Make({
			textAlign: TextAlign.Center,
		})
			.pushStyle(dateFont)
			.addText(priceValue.value)
			.addText(" TL \n")
			.pushStyle({ ...dateFont, fontSize: 10, fontStyle: FontStyle.Normal })
			.addText(priceDate.value)
			.build();

		return para;
	}, [cx, priceDate, priceValue, cy]);
	return (
		<Group>
			<Paragraph paragraph={paragraph} x={priceTextCx} y={10} width={200} />
			<Path
				path={path}
				color="#d2d3d4"
				style="stroke"
				strokeJoin="round"
				strokeWidth={2}
			>
				<DashPathEffect intervals={[4, 4]} />
			</Path>
		</Group>
	);
};

export default Cursor;
