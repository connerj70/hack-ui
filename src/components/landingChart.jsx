import { Bar } from "react-chartjs-2";

export default function LandingChart({chartData}) {
	return (
		<div className="chart-container">
			<Bar
				data={chartData}
				options={{
					indexAxis: 'y',
					plugins: {
						title: {
							display: true,
							text: "Users Gained between 2016-2020"
						},
						legend: {
							display: false
						}
					}
				}}
			/>
		</div>
	);
}
