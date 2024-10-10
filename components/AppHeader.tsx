import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface HeaderProps {
	title: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const AppHeader: React.FC<HeaderProps> = ({ title, leftIcon, rightIcon }) => {
	return (
		<View style={styles.headerContainer}>
			<TouchableOpacity style={styles.iconContainer}>
				{leftIcon}
			</TouchableOpacity>
			<Text style={styles.titleContainer}>{title}</Text>
			<View style={styles.iconContainer}>
				{rightIcon || <View style={styles.placeholder} />}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
	},
	iconContainer: {
		width: 20,
	},
	titleContainer: {
		flex: 1,
		textAlign: "center",
		fontSize: 16,
		fontWeight: "500",
	},
	placeholder: {
		width: 50,
	},
});

export default AppHeader;
