// import {
//   addDays,
//   addMonths,
//   endOfDay,
//   isBefore,
//   startOfDay,
//   startOfMonth,
//   subDays,
//   subMonths,
// } from "date-fns";
// import { utcToZonedTime } from "date-fns-tz";
// import cron from "node-cron";
// import db from "../../connector";

// // Cek validitas tanggal
// function isValidDate(date) {
//   return date instanceof Date && !isNaN(date);
// }

// // Parse aman dari string/null ke Date
// function safeParseDate(input) {
//   const d = new Date(input);
//   return isValidDate(d) ? d : null;
// }

// // ========================== DAILY ===============================

// // Update penjualan harian untuk tanggal tertentu
// async function updateDailySalesForDate(date) {
//   if (!isValidDate(date)) {
//     console.error("[DAILY] Invalid input date:", date);
//     return;
//   }

//   console.log("[DAILY] Processing date:", date.toISOString());

//   const jakartaDate = utcToZonedTime(date, "Asia/Jakarta");
//   const dayStart = startOfDay(jakartaDate);
//   const dayEnd = endOfDay(jakartaDate);

//   console.log("[DAILY] Day start:", dayStart.toISOString());
//   console.log("[DAILY] Day end:", dayEnd.toISOString());

//   const sales = await db.transactions.findMany({
//     where: {
//       createdAt: { gte: dayStart, lte: dayEnd },
//       status: "SUCCESS",
//     },
//     select: { total_price: true },
//   });

//   const totalDailySales = sales.reduce(
//     (total, tx) => total + Number(tx.total_price),
//     0
//   );

//   console.log("[DAILY] Total sales:", totalDailySales);

//   const existing = await db.dailySales.findFirst({ where: { date: dayStart } });

//   if (existing) {
//     await db.dailySales.update({
//       where: { id: existing.id },
//       data: { totalSales: totalDailySales },
//     });
//     console.log("[DAILY] Updated existing dailySales.");
//   } else {
//     await db.dailySales.create({
//       data: { date: dayStart, totalSales: totalDailySales },
//     });
//     console.log("[DAILY] Created new dailySales entry.");
//   }
// }

// async function catchUpDailySales() {
//   const last = await db.dailySales.findFirst({
//     orderBy: { date: "desc" },
//   });

//   console.log("[DAILY] Last dailySales record:", last);

//   const today = startOfDay(utcToZonedTime(new Date(), "Asia/Jakarta"));
//   let cursor;

//   const lastDate = safeParseDate(last?.date);
//   if (lastDate) {
//     cursor = addDays(startOfDay(utcToZonedTime(lastDate, "Asia/Jakarta")), 1);
//   } else {
//     console.warn("[DAILY] No valid last date found. Defaulting to 7 days ago.");
//     cursor = subDays(today, 7);
//   }

//   while (isBefore(cursor, today)) {
//     try {
//       console.log("[DAILY] Catch-up processing:", cursor.toISOString());
//       await updateDailySalesForDate(cursor);
//     } catch (err) {
//       console.error(
//         "[DAILY] Error during catch-up:",
//         cursor.toISOString(),
//         err.message
//       );
//     }
//     cursor = addDays(cursor, 1);
//   }
// }

// // ========================== MONTHLY ===============================

// async function updateMonthlySalesForDate(date) {
//   if (!isValidDate(date)) {
//     console.error("[MONTHLY] Invalid input date:", date);
//     return;
//   }

//   console.log("[MONTHLY] Processing month:", date.toISOString());

//   const jakartaDate = utcToZonedTime(date, "Asia/Jakarta");
//   const monthStart = startOfMonth(jakartaDate);
//   const monthEnd = addMonths(monthStart, 1);

//   console.log("[MONTHLY] Month start:", monthStart.toISOString());
//   console.log("[MONTHLY] Month end:", monthEnd.toISOString());

//   const sales = await db.transactions.findMany({
//     where: {
//       createdAt: { gte: monthStart, lt: monthEnd },
//       status: "SUCCESS",
//     },
//     select: { total_price: true },
//   });

//   const totalMonthlySales = sales.reduce(
//     (total, tx) => total + Number(tx.total_price),
//     0
//   );

//   console.log("[MONTHLY] Total sales:", totalMonthlySales);

//   const existing = await db.monthlySales.findFirst({
//     where: { month: monthStart },
//   });

//   if (existing) {
//     await db.monthlySales.update({
//       where: { id: existing.id },
//       data: { totalSales: totalMonthlySales },
//     });
//     console.log("[MONTHLY] Updated existing monthlySales.");
//   } else {
//     await db.monthlySales.create({
//       data: { month: monthStart, totalSales: totalMonthlySales },
//     });
//     console.log("[MONTHLY] Created new monthlySales entry.");
//   }
// }

// async function catchUpMonthlySales() {
//   const last = await db.monthlySales.findFirst({
//     orderBy: { month: "desc" },
//   });

//   console.log("[MONTHLY] Last monthlySales record:", last);

//   const now = utcToZonedTime(new Date(), "Asia/Jakarta");
//   const thisMonthStart = startOfMonth(now);
//   let cursor;

//   const lastMonth = safeParseDate(last?.month);
//   if (lastMonth) {
//     cursor = addMonths(
//       startOfMonth(utcToZonedTime(lastMonth, "Asia/Jakarta")),
//       1
//     );
//   } else {
//     console.warn(
//       "[MONTHLY] No valid last month found. Defaulting to 6 months ago."
//     );
//     cursor = subMonths(thisMonthStart, 6);
//   }

//   while (isBefore(cursor, thisMonthStart)) {
//     try {
//       console.log("[MONTHLY] Catch-up processing:", cursor.toISOString());
//       await updateMonthlySalesForDate(cursor);
//     } catch (err) {
//       console.error(
//         "[MONTHLY] Error during catch-up:",
//         cursor.toISOString(),
//         err.message
//       );
//     }
//     cursor = addMonths(cursor, 1);
//   }
// }

// // ========================== CRON SETUP ===============================

// async function setupCronJobs() {
//   console.log("⏰ [CRON] Starting cron setup...");

//   await catchUpDailySales();
//   await catchUpMonthlySales();

//   // Harian jam 00:00 WIB
//   cron.schedule("0 0 * * *", async () => {
//     try {
//       const now = new Date();
//       console.log("[CRON DAILY] Current UTC time:", now);

//       const nowJakarta = utcToZonedTime(now, "Asia/Jakarta");
//       const yesterday = subDays(startOfDay(nowJakarta), 1);

//       if (!isValidDate(yesterday))
//         throw new Error("Invalid date for daily cron.");

//       console.log(
//         "[CRON DAILY] Processing yesterday:",
//         yesterday.toISOString()
//       );
//       await updateDailySalesForDate(yesterday);
//       console.log("[CRON DAILY] ✅ Success.");
//     } catch (err) {
//       console.error("[CRON DAILY] ❌ Error:", err.message);
//     }
//   });

//   // Bulanan tiap tanggal 1 jam 00:00 WIB
//   cron.schedule("0 0 1 * *", async () => {
//     try {
//       const now = new Date();
//       console.log("[CRON MONTHLY] Current UTC time:", now);

//       const nowJakarta = utcToZonedTime(now, "Asia/Jakarta");
//       const lastMonth = subMonths(startOfMonth(nowJakarta), 1);

//       if (!isValidDate(lastMonth))
//         throw new Error("Invalid date for monthly cron.");

//       console.log(
//         "[CRON MONTHLY] Processing last month:",
//         lastMonth.toISOString()
//       );
//       await updateMonthlySalesForDate(lastMonth);
//       console.log("[CRON MONTHLY] ✅ Success.");
//     } catch (err) {
//       console.error("[CRON MONTHLY] ❌ Error:", err.message);
//     }
//   });
// }

// export { setupCronJobs, updateDailySalesForDate, updateMonthlySalesForDate };
import {
  addDays,
  addMonths,
  endOfDay,
  isBefore,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import cron from "node-cron";
import db from "../../connector";

// ======================= HELPERS =======================

function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

function safeParseDate(input) {
  const parsed = new Date(input);
  return isValidDate(parsed) ? parsed : null;
}

function getJakartaDate(date) {
  return utcToZonedTime(date, "Asia/Jakarta");
}

// ======================= DAILY SALES =======================

export async function updateDailySalesForDate(date) {
  if (!isValidDate(date))
    return console.error("[DAILY] ❌ Invalid date:", date);

  const jakartaDate = getJakartaDate(date);
  const dayStart = startOfDay(jakartaDate);
  const dayEnd = endOfDay(jakartaDate);

  console.log(`[DAILY] 📅 Processing ${dayStart.toISOString().slice(0, 10)}`);

  try {
    const sales = await db.transactions.findMany({
      where: {
        createdAt: { gte: dayStart, lte: dayEnd },
        status: "SUCCESS",
      },
      select: { total_price: true },
    });

    const totalSales = sales.reduce(
      (sum, tx) => sum + Number(tx.total_price),
      0
    );
    const existing = await db.dailySales.findFirst({
      where: { date: dayStart },
    });

    if (existing) {
      await db.dailySales.update({
        where: { id: existing.id },
        data: { totalSales },
      });
      console.log("[DAILY] 🔄 Updated existing record.");
    } else {
      await db.dailySales.create({
        data: { date: dayStart, totalSales },
      });
      console.log("[DAILY] ✅ Created new record.");
    }
  } catch (err) {
    console.error("[DAILY] ❌ Error:", err.message);
  }
}

async function catchUpDailySales() {
  const last = await db.dailySales.findFirst({ orderBy: { date: "desc" } });
  const today = startOfDay(getJakartaDate(new Date()));
  let cursor;

  const lastDate = safeParseDate(last?.date);
  cursor = lastDate
    ? addDays(startOfDay(getJakartaDate(lastDate)), 1)
    : subDays(today, 7);

  console.log("[DAILY] 🔁 Starting catch-up from:", cursor.toISOString());

  while (isBefore(cursor, today)) {
    await updateDailySalesForDate(cursor);
    cursor = addDays(cursor, 1);
  }
}

// ======================= MONTHLY SALES =======================

export async function updateMonthlySalesForDate(date) {
  if (!isValidDate(date))
    return console.error("[MONTHLY] ❌ Invalid date:", date);

  const jakartaDate = getJakartaDate(date);
  const monthStart = startOfMonth(jakartaDate);
  const monthEnd = addMonths(monthStart, 1);

  console.log(
    `[MONTHLY] 📅 Processing ${monthStart.toISOString().slice(0, 7)}`
  );

  try {
    const sales = await db.transactions.findMany({
      where: {
        createdAt: { gte: monthStart, lt: monthEnd },
        status: "SUCCESS",
      },
      select: { total_price: true },
    });

    const totalSales = sales.reduce(
      (sum, tx) => sum + Number(tx.total_price),
      0
    );
    const existing = await db.monthlySales.findFirst({
      where: { month: monthStart },
    });

    if (existing) {
      await db.monthlySales.update({
        where: { id: existing.id },
        data: { totalSales },
      });
      console.log("[MONTHLY] 🔄 Updated existing record.");
    } else {
      await db.monthlySales.create({
        data: { month: monthStart, totalSales },
      });
      console.log("[MONTHLY] ✅ Created new record.");
    }
  } catch (err) {
    console.error("[MONTHLY] ❌ Error:", err.message);
  }
}

async function catchUpMonthlySales() {
  const last = await db.monthlySales.findFirst({ orderBy: { month: "desc" } });
  const thisMonth = startOfMonth(getJakartaDate(new Date()));
  let cursor;

  const lastMonth = safeParseDate(last?.month);
  cursor = lastMonth
    ? addMonths(startOfMonth(getJakartaDate(lastMonth)), 1)
    : subMonths(thisMonth, 6);

  console.log("[MONTHLY] 🔁 Starting catch-up from:", cursor.toISOString());

  while (isBefore(cursor, thisMonth)) {
    await updateMonthlySalesForDate(cursor);
    cursor = addMonths(cursor, 1);
  }
}

// ======================= CRON SETUP =======================

export async function setupCronJobs() {
  console.log("⏰ [CRON] Setting up jobs...");

  // Jalankan catch-up saat server start
  await catchUpDailySales();
  await catchUpMonthlySales();

  // Harian (jam 00:00 WIB)
  cron.schedule("0 0 * * *", async () => {
    const nowJakarta = getJakartaDate(new Date());
    const yesterday = subDays(startOfDay(nowJakarta), 1);
    console.log(
      "[CRON DAILY] 🕛 Running for:",
      yesterday.toISOString().slice(0, 10)
    );

    try {
      await updateDailySalesForDate(yesterday);
      console.log("[CRON DAILY] ✅ Success");
    } catch (err) {
      console.error("[CRON DAILY] ❌ Error:", err.message);
    }
  });

  // Bulanan (tanggal 1 jam 00:00 WIB)
  cron.schedule("0 0 1 * *", async () => {
    const nowJakarta = getJakartaDate(new Date());
    const lastMonth = subMonths(startOfMonth(nowJakarta), 1);
    console.log(
      "[CRON MONTHLY] 🕛 Running for:",
      lastMonth.toISOString().slice(0, 7)
    );

    try {
      await updateMonthlySalesForDate(lastMonth);
      console.log("[CRON MONTHLY] ✅ Success");
    } catch (err) {
      console.error("[CRON MONTHLY] ❌ Error:", err.message);
    }
  });
}
