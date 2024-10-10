import Cursor from "@/components/LineChart/Cursor";
import Stripes from "@/components/LineChart/Stripes";
import { default as YAxisText } from "@/components/LineChart/YAxisText";
import { DataPoint } from "@/constants/price";
import {
	Canvas,
	CornerPathEffect,
	DashPathEffect,
	Group,
	Path,
	Skia,
	SkPath,
} from "@shopify/react-native-skia";

import { area, extent, line, scaleLinear, scaleTime } from "d3";
import React, { useEffect, useState } from "react";
import {
	Gesture,
	GestureDetector,
	PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { clamp, getYForX, parse } from "react-native-redash";

type Props = {
	chartWidth: number;
	chartHeight: number;
	chartMargin: {
		left: number;
		right: number;
	};
	data: DataPoint[];
	selectedDayFilterValue: number;
};

const LineChart = ({
	chartHeight,
	chartMargin,
	chartWidth,
	data,
	selectedDayFilterValue,
}: Props) => {
	const selectedDate = useSharedValue<string>("null");
	const selectedValue = useSharedValue<number>(0);
	const [showCursor, setShowCursor] = useState(false);

	const cx = useSharedValue(20);
	const cy = useSharedValue(0);
	const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

	useEffect(() => {
		setHighlightIndex(0);
	}, [selectedDayFilterValue]);

	// Create the x scale
	const x = scaleTime()
		.domain(extent([...data], (d) => new Date(d.date)) as [Date, Date])
		.range([chartMargin.left, chartWidth - chartMargin.right]);

	// Find the max and min values of the data
	const max = Math.max(...data.map((val) => val.value));
	const min = Math.min(...data.map((val) => val.value));

	const yDomain = [min, max];

	const yRange = [chartHeight, 0];

	const y = scaleLinear().domain(yDomain).range(yRange);
	const areaPath = area<DataPoint>()
		.x((d) => x(d.date))
		.y0(chartHeight)
		.y1((d) => y(d.value));

	const lineGenerator = line<DataPoint>()
		.x((d) => x(d.date))!
		.y((d) => y(d.value));
	const linePath = Skia.Path.MakeFromSVGString(lineGenerator(data)!);
	const stepX = (chartWidth - chartMargin.left - 20) / data.length;

	const path = parse(linePath!.toSVGString());

	const handleGestureEvent = (e: PanGestureHandlerEventPayload) => {
		"worklet";

		const clampValue = clamp(e.absoluteX, chartMargin.left, chartWidth - 20);
		let index = Math.round((clampValue - chartMargin.left) / stepX);
		let clampedIndex = clamp(index, 0, data.length - 1);
		const price = data[clampedIndex];
		selectedDate.value = new Date(price.date).toLocaleDateString("tr-TR", {
			day: "numeric",
			month: "short",
		});
		selectedValue.value = price.value;

		cx.value = clampValue;
		runOnJS(setHighlightIndex)(clampedIndex);

		cy.value = getYForX(path, clampValue)!;
	};

	const pan = Gesture.Pan()
		.onTouchesDown(() => {
			runOnJS(setShowCursor)(true);
		})
		.onTouchesUp(() => {
			runOnJS(setShowCursor)(false);
		})
		.onBegin(handleGestureEvent)
		.onChange(handleGestureEvent);

	return (
		<GestureDetector gesture={pan}>
			<Canvas
				style={{
					width: chartWidth,
					height: chartHeight,
				}}
			>
				<Stripes
					linePathString={linePath?.toSVGString()!}
					dimensions={{
						width: chartWidth,
						height: chartHeight,
						marginLeft: chartMargin.left,
					}}
					showCursor={showCursor}
					afterLineString={areaPath(data.slice(0, highlightIndex ?? 0))!}
				/>
				<Path style="stroke" path={linePath!} strokeWidth={4} color="#869c00">
					<CornerPathEffect r={10} />
				</Path>

				{showCursor ? (
					<Path
						style="stroke"
						path={
							Skia.Path.MakeFromSVGString(
								lineGenerator(data.slice(highlightIndex ?? 0))!
							) as SkPath
						}
						strokeWidth={4}
						color="#e9e9ea"
					>
						<CornerPathEffect r={10} />
					</Path>
				) : null}
				{y.ticks(5).map((tick, i) => (
					<Group key={`${tick}-${i}`}>
						<YAxisText
							x={20}
							y={y(tick)!}
							text={tick >= 1000 ? `${tick / 1000}K` : tick.toString()}
							key={i}
						/>
						<Path
							style="stroke"
							path={
								Skia.Path.MakeFromSVGString(
									`M${chartMargin.left},${y(tick) - 4} H${chartWidth - 20}`
								)!
							}
							strokeWidth={1}
							color="#d2d3d4"
							opacity={0.2}
						>
							<DashPathEffect intervals={[10, 10]} />
						</Path>
					</Group>
				))}
				{showCursor ? (
					<Cursor
						cx={cx}
						cy={cy}
						chartHeight={chartHeight}
						selectedValue={selectedValue}
						selectedDate={selectedDate}
					/>
				) : null}
			</Canvas>
		</GestureDetector>
	);
};

export default LineChart;
