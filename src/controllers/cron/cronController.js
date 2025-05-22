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

// // Validasi tanggal
// function isValidDate(date) {
//   return date instanceof Date && !isNaN(date);
// }

// // Perbarui penjualan harian untuk tanggal tertentu
// async function updateDailySalesForDate(date) {
//   const dayStart = startOfDay(date);
//   const dayEnd = endOfDay(date);

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

//   const existing = await db.dailySales.findFirst({ where: { date: dayStart } });

//   if (existing) {
//     await db.dailySales.update({
//       where: { id: existing.id },
//       data: { totalSales: totalDailySales },
//     });
//   } else {
//     await db.dailySales.create({
//       data: { date: dayStart, totalSales: totalDailySales },
//     });
//   }
// }

// // Perbarui penjualan bulanan untuk tanggal tertentu
// async function updateMonthlySalesForDate(date) {
//   const monthStart = startOfMonth(date);
//   const monthEnd = addMonths(monthStart, 1);

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

//   const existing = await db.monthlySales.findFirst({
//     where: { month: monthStart },
//   });

//   if (existing) {
//     await db.monthlySales.update({
//       where: { id: existing.id },
//       data: { totalSales: totalMonthlySales },
//     });
//   } else {
//     await db.monthlySales.create({
//       data: { month: monthStart, totalSales: totalMonthlySales },
//     });
//   }
// }

// // Catch-up untuk data harian yang ketinggalan
// async function catchUpDailySales() {
//   const last = await db.dailySales.findFirst({
//     orderBy: { date: "desc" },
//   });
//   console.log("Last dailySales:", last);

//   const today = startOfDay(utcToZonedTime(new Date(), "Asia/Jakarta"));
//   let cursor = last ? addDays(last.date, 1) : subDays(today, 7); // default ambil 7 hari terakhir

//   while (isBefore(cursor, today)) {
//     console.log("Catch-up daily:", cursor.toISOString());
//     await updateDailySalesForDate(cursor);
//     cursor = addDays(cursor, 1);
//   }
// }

// // Catch-up untuk data bulanan yang ketinggalan
// async function catchUpMonthlySales() {
//   const last = await db.monthlySales.findFirst({
//     orderBy: { month: "desc" },
//   });
//   console.log("Last monthlySales:", last);

//   const now = utcToZonedTime(new Date(), "Asia/Jakarta");
//   const thisMonthStart = startOfMonth(now);

//   let cursor = last?.month
//     ? addMonths(last.month, 1)
//     : subMonths(thisMonthStart, 6); // default ambil 6 bulan terakhir

//   while (isBefore(cursor, thisMonthStart)) {
//     console.log("Catch-up monthly:", cursor.toISOString());
//     await updateMonthlySalesForDate(cursor);
//     cursor = addMonths(cursor, 1);
//   }
// }

// // Setup cron + recovery
// async function setupCronJobs() {
//   // Jalankan recovery dulu
//   await catchUpDailySales();
//   await catchUpMonthlySales();

//   // Cron harian jam 00:00 WIB
//   cron.schedule("0 0 * * *", async () => {
//     try {
//       const nowJakarta = utcToZonedTime(new Date(), "Asia/Jakarta");
//       const yesterday = subDays(nowJakarta, 1);

//       if (!isValidDate(yesterday))
//         throw new Error("Invalid date for daily cron.");

//       console.log("Running daily cron for:", yesterday.toISOString());
//       await updateDailySalesForDate(yesterday);
//       console.log("Daily sales updated.");
//     } catch (err) {
//       console.error("Daily cron error:", err.stack || err);
//     }
//   });

//   // Cron bulanan tanggal 1 jam 00:00 WIB
//   cron.schedule("0 0 1 * *", async () => {
//     try {
//       const nowJakarta = utcToZonedTime(new Date(), "Asia/Jakarta");
//       const lastMonth = subMonths(nowJakarta, 1);
//       const lastMonthStart = startOfMonth(lastMonth);

//       if (!isValidDate(lastMonthStart))
//         throw new Error("Invalid date for monthly cron.");

//       console.log("Running monthly cron for:", lastMonthStart.toISOString());
//       await updateMonthlySalesForDate(lastMonthStart);
//       console.log("Monthly sales updated.");
//     } catch (err) {
//       console.error("Monthly cron error:", err.message);
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

// Validasi tanggal
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

// Perbarui penjualan harian untuk tanggal tertentu
async function updateDailySalesForDate(date) {
  const jakartaDate = utcToZonedTime(date, "Asia/Jakarta");
  const dayStart = startOfDay(jakartaDate);
  const dayEnd = endOfDay(jakartaDate);

  const sales = await db.transactions.findMany({
    where: {
      createdAt: { gte: dayStart, lte: dayEnd },
      status: "SUCCESS",
    },
    select: { total_price: true },
  });

  const totalDailySales = sales.reduce(
    (total, tx) => total + Number(tx.total_price),
    0
  );

  const existing = await db.dailySales.findFirst({ where: { date: dayStart } });

  if (existing) {
    await db.dailySales.update({
      where: { id: existing.id },
      data: { totalSales: totalDailySales },
    });
  } else {
    await db.dailySales.create({
      data: { date: dayStart, totalSales: totalDailySales },
    });
  }
}

// Perbarui penjualan bulanan untuk tanggal tertentu
async function updateMonthlySalesForDate(date) {
  const jakartaDate = utcToZonedTime(date, "Asia/Jakarta");
  const monthStart = startOfMonth(jakartaDate);
  const monthEnd = addMonths(monthStart, 1);

  const sales = await db.transactions.findMany({
    where: {
      createdAt: { gte: monthStart, lt: monthEnd },
      status: "SUCCESS",
    },
    select: { total_price: true },
  });

  const totalMonthlySales = sales.reduce(
    (total, tx) => total + Number(tx.total_price),
    0
  );

  const existing = await db.monthlySales.findFirst({
    where: { month: monthStart },
  });

  if (existing) {
    await db.monthlySales.update({
      where: { id: existing.id },
      data: { totalSales: totalMonthlySales },
    });
  } else {
    await db.monthlySales.create({
      data: { month: monthStart, totalSales: totalMonthlySales },
    });
  }
}

// Catch-up untuk data harian yang ketinggalan
async function catchUpDailySales() {
  const last = await db.dailySales.findFirst({
    orderBy: { date: "desc" },
  });

  const today = startOfDay(utcToZonedTime(new Date(), "Asia/Jakarta"));

  let cursor = last
    ? addDays(startOfDay(utcToZonedTime(last.date, "Asia/Jakarta")), 1)
    : subDays(today, 7); // default ambil 7 hari terakhir

  while (isBefore(cursor, today)) {
    console.log("Catch-up daily:", cursor.toISOString());
    await updateDailySalesForDate(cursor);
    cursor = addDays(cursor, 1);
  }
}

// Catch-up untuk data bulanan yang ketinggalan
async function catchUpMonthlySales() {
  const last = await db.monthlySales.findFirst({
    orderBy: { month: "desc" },
  });

  const now = utcToZonedTime(new Date(), "Asia/Jakarta");
  const thisMonthStart = startOfMonth(now);

  let cursor = last?.month
    ? addMonths(startOfMonth(utcToZonedTime(last.month, "Asia/Jakarta")), 1)
    : subMonths(thisMonthStart, 6); // default ambil 6 bulan terakhir

  while (isBefore(cursor, thisMonthStart)) {
    console.log("Catch-up monthly:", cursor.toISOString());
    await updateMonthlySalesForDate(cursor);
    cursor = addMonths(cursor, 1);
  }
}

// Setup cron + recovery
async function setupCronJobs() {
  // Jalankan recovery dulu
  await catchUpDailySales();
  await catchUpMonthlySales();

  // Cron harian jam 00:00 WIB
  cron.schedule("0 0 * * *", async () => {
    try {
      const nowJakarta = utcToZonedTime(new Date(), "Asia/Jakarta");
      const yesterday = subDays(startOfDay(nowJakarta), 1);

      if (!isValidDate(yesterday))
        throw new Error("Invalid date for daily cron.");

      console.log("Running daily cron for:", yesterday.toISOString());
      await updateDailySalesForDate(yesterday);
      console.log("Daily sales updated.");
    } catch (err) {
      console.error("Daily cron error:", err.message);
    }
  });

  // Cron bulanan tanggal 1 jam 00:00 WIB
  cron.schedule("0 0 1 * *", async () => {
    try {
      const nowJakarta = utcToZonedTime(new Date(), "Asia/Jakarta");
      const lastMonth = subMonths(startOfMonth(nowJakarta), 1);

      if (!isValidDate(lastMonth))
        throw new Error("Invalid date for monthly cron.");

      console.log("Running monthly cron for:", lastMonth.toISOString());
      await updateMonthlySalesForDate(lastMonth);
      console.log("Monthly sales updated.");
    } catch (err) {
      console.error("Monthly cron error:", err.message);
    }
  });
}

export { setupCronJobs, updateDailySalesForDate, updateMonthlySalesForDate };
