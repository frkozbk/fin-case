import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface AppButtonProps {
	title: string;
	onPress: () => void;
	variant: "primary" | "secondary";
}

const AppButton: React.FC<AppButtonProps> = ({ title, onPress, variant }) => {
	return (
		<TouchableOpacity
			style={[
				styles.button,
				variant === "primary" ? styles.primary : styles.secondary,
			]}
			onPress={onPress}
		>
			<Text
				style={[
					styles.text,
					variant === "primary" ? styles.primaryText : styles.secondaryText,
				]}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: 50,
		paddingVertical: 8,
		paddingHorizontal: 12,
		alignSelf: "flex-start",
	},
	primary: {
		borderWidth: 1,
		borderColor: "#869c00",
	},
	secondary: {
		borderWidth: 1,
		borderColor: "#1F222944",
	},
	text: {
		fontSize: 16,
		fontWeight: "500",
	},
	primaryText: {
		color: "#869c00",
	},
	secondaryText: {
		color: "#1F2229CC",
	},
});

export default AppButton;
