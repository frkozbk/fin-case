import AppButton from "@/components/AppButton";
import AppHeader from "@/components/AppHeader";
import BackIcon from "@/components/icons/BackIcon";
import LineChart from "@/components/LineChart";
import { DataPoint, priceData } from "@/constants/price";
import { format } from "d3";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const aspectRatio = 9 / 16;

const getLastNumberOfData = (data: DataPoint[], numberOfData: number) => {
	return data.slice(data.length - numberOfData);
};
const Second = () => {
	const [selectedDayFilterValue, setSelectedDayFilterValue] = useState(7);
	const [data, setData] = React.useState<DataPoint[]>(() =>
		getLastNumberOfData(priceData, 7)
	);

	const screenWidth = Dimensions.get("window").width;
	const margin = { right: 20, left: 70 };
	const width = screenWidth;
	const height = width * aspectRatio;

	const handleSelectDayFilter = (value: number) => {
		setSelectedDayFilterValue(value);
		setData(getLastNumberOfData(priceData, value));
	};
	const differenceBetweenFirstAndLastValue =
		data[data.length - 1].value - data[0].value;
	return (
		<SafeAreaView style={styles.container}>
			<AppHeader title="Cüzdan Analizi" leftIcon={<BackIcon width={36} />} />
			<View
				style={{
					flexDirection: "row",
					gap: 10,
					paddingHorizontal: margin.right,
				}}
			>
				<AppButton
					variant={selectedDayFilterValue === 7 ? "primary" : "secondary"}
					title="Son 7 gün"
					onPress={() => handleSelectDayFilter(7)}
				/>
				<AppButton
					variant={selectedDayFilterValue === 30 ? "primary" : "secondary"}
					title="Son 30 gün"
					onPress={() => handleSelectDayFilter(30)}
				/>
			</View>
			<View style={styles.priceTextContainer}>
				<Text style={styles.incrementText}>
					{format(".2f")(differenceBetweenFirstAndLastValue)} TL
				</Text>
			</View>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<LineChart
					data={data}
					chartHeight={height}
					chartMargin={margin}
					chartWidth={width}
					selectedDayFilterValue={selectedDayFilterValue}
				/>
			</GestureHandlerRootView>
		</SafeAreaView>
	);
};

export default Second;
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	text: {
		color: "white",
		fontSize: 28,
		textAlign: "center",
	},
	priceTextContainer: {
		alignItems: "flex-start",
		paddingLeft: 20,
		color: "#869c00",
		paddingVertical: 32,
	},

	incrementText: {
		color: "#869621",
		fontSize: 16,
		textAlign: "center",
	},
});
