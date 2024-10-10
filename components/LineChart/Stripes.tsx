import {
	Line,
	Mask,
	Path,
	SkPath,
	Skia,
	vec,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";

const CROSS_DASH_COUNT_FOR_EACH_SIDE = 50;
type CrossDashesProps = {
	dimensions: {
		width: number;
		height: number;
		marginLeft: number;
	};
	linePathString: string;
	afterLineString: string;
	showCursor: boolean;
};
const Stripes = (props: CrossDashesProps) => {
	const {
		dimensions: { width, height, marginLeft },
		linePathString,
		afterLineString,
		showCursor,
	} = props;

	const transforms = useMemo(() => {
		const offset = width / CROSS_DASH_COUNT_FOR_EACH_SIDE;
		return new Array(2 * CROSS_DASH_COUNT_FOR_EACH_SIDE)
			.fill(null)
			.map((_, index) => {
				const translateX =
					index < CROSS_DASH_COUNT_FOR_EACH_SIDE
						? -index * offset
						: (index - CROSS_DASH_COUNT_FOR_EACH_SIDE) * offset;
				return { translateX };
			});
	}, [width]);

	const calculateMaskPath = (): SkPath => {
		const clonedPath = Skia.Path.MakeFromSVGString(linePathString);
		clonedPath
			?.lineTo(width - marginLeft + 50, height)

			?.lineTo(marginLeft, height);

		return clonedPath!;
	};

	const maskPath = calculateMaskPath();
	const afterLineMask = afterLineString
		? Skia.Path.MakeFromSVGString(afterLineString)
		: null;

	return (
		<Mask
			mask={
				showCursor && afterLineMask === null ? null : (
					<Path
						path={showCursor && afterLineMask ? afterLineMask! : maskPath}
						color="white"
					/>
				)
			}
			mode="luminance"
		>
			{transforms.map((t, index) => (
				<Line
					key={`${t.translateX}-${index}`}
					strokeCap="butt"
					p1={vec(0, height)}
					p2={vec(width, 0)}
					transform={[t]}
					color="#869c00"
					opacity={0.7}
				/>
			))}
		</Mask>
	);
};
export default Stripes;
