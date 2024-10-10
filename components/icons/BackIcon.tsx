import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";
const BackIcon = (props: SvgProps) => (
	<Svg width={36} height={36} {...props} viewBox="0 0 36 36">
		<Path
			fill="#1F2229"
			fillOpacity={0.8}
			d="m13.646 16.94 6.647-6.647 1.414 1.414L15.414 18l6.293 6.293-1.414 1.414-6.647-6.646a1.5 1.5 0 0 1 0-2.122Z"
		/>
	</Svg>
);
export default BackIcon;
