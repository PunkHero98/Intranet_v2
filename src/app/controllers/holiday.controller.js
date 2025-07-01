import vnholiday from "../../config/VN-holiday.json" assert { type: "json" };
import auholiday from "../../config/AU-holiday.json" with { type: "json" };
import fs from "fs";
import path from "path";

function generateMonthlyCalendarWithHolidays(year, month, holidays) {
  const daysInMonth = new Date(year, month, 0).getDate(); // tháng từ 1 -> 12
  const calendar = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const holidayInfo = holidays.find(h => h.date.iso === dateStr);

    calendar.push({
      date: dateStr,
      isHoliday: !!holidayInfo,
      holidayName: holidayInfo ? holidayInfo.name : null,
      holidayDescription: holidayInfo ? holidayInfo.description : null,
    });
  }

  // Ghi ra file JSON
  const outputPath = path.join('./output', `calendar-${year}-${month}.json`);

  if(fs.existsSync('./output')) {
    console.log(`✅ Thư mục output đã tồn tại: ${outputPath}`);
    return calendar; // nếu thư mục đã tồn tại thì không cần tạo lại
  }
  fs.mkdirSync('./output', { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(calendar, null, 2), 'utf-8');

  console.log(`✅ Đã tạo file: ${outputPath}`);
  return calendar;
}
export default new (class HolidayController {
  async createHoliday(req, res) {
    try {
      const { countryName, data, date, createdBy } = req.body;
      const holiday = await insertDataHoliday(countryName, data, date, createdBy);
      res.status(201).json(holiday);
    } catch (error) {
      console.error("Error creating holiday:", error);
      res.status(500).json({ message: "Error creating holiday", error: error.message });
    }
  }

 async getVNHoliday(req, res) {
  try {
    const { year, month } = req.query;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);

    const holidays = auholiday.response.holidays.filter(holiday => {
      const hYear = holiday.date?.datetime?.year;
      const hMonth = holiday.date?.datetime?.month;
      return hYear === y && (month ? hMonth === m : true);
    });

    // Nếu có tháng thì tạo file JSON
    if (month) {
    const calendarData = generateMonthlyCalendarWithHolidays(y, m, holidays);
    res.status(200).json(calendarData); // gửi dữ liệu đã format toàn bộ tháng
    } else {
    res.status(200).json(holidays); // nếu không có month thì gửi raw holiday
    }
  } catch (error) {
    console.error("Error fetching VN holidays:", error);
    res.status(500).json({ message: "Error fetching VN holidays", error: error.message });
  }
}

  async check(req, res) {
    try {
    //   const { year, month } = req.query;
    //   if (!year || !month) {
    //     return res.status(400).json({ message: "Year and month are required" });
    //   }
    //   const holidays = vnholiday.filter(holiday => {
    //     const holidayDate = new Date(holiday.date);
    //     return holidayDate.getFullYear() == year && holidayDate.getMonth() + 1 == month;
    //   });
      res.status(200).json('yes');
    } catch (error) {
      console.error("Error checking holidays:", error);
      res.status(500).json({ message: "Error checking holidays", error: error.message });
    }
  }
})();