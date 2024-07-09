import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ selectedDate, onChange }) => {
	return (
		<div className="">
			<DatePicker
				selected={selectedDate}
				onChange={onChange}
				showTimeSelect
				timeFormat="HH:mm"
				timeIntervals={10}
				dateFormat="MMMM d, yyyy h:mm aa"
				className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				popperClassName="z-50"
			/>
		</div>
	);
};

export default CustomDatePicker;
